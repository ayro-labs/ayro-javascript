import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import * as classNames from 'classnames';

import QuickReplyButton from 'frame/components/QuickReplyButton';
import IncomingMessage from 'frame/components/messages/IncomingMessage';
import OutgoingMessage from 'frame/components/messages/OutgoingMessage';
import ConnectChannelsMessage from 'frame/components/messages/ConnectChannelsMessage';
import FileMessage from 'frame/components/messages/FileMessage';

import {AyroService} from 'frame/services/AyroService';
import {UserStatus} from 'frame/enums/UserStatus';
import {User} from 'frame/models/User';
import {ChatMessage} from 'frame/models/ChatMessage';
import {QuickReply} from 'frame/models/QuickReply';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';

interface StateProps {
  apiToken: string;
  userStatus: UserStatus;
  user: User;
  chatMessages: ChatMessage[];
  lastMessage: ChatMessage;
}

interface DispatchProps {
  setChatMessages: (chatMessages: ChatMessage[]) => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
  removeChatMessage: (chatMessage: ChatMessage) => void;
}

class Conversation extends React.Component<StateProps & DispatchProps> {

  private subscriptions: any[] = [];
  private contentRef: React.RefObject<HTMLDivElement>;

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
    this.onUserChanged = this.onUserChanged.bind(this);
    this.postQuickReply = this.postQuickReply.bind(this);
    this.contentRef = React.createRef<HTMLDivElement>();
  }

  public componentDidMount(): void {
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
    this.subscriptions.push(PubSub.subscribe(Actions.SET_USER, this.onUserChanged));
    this.scrollToBottom();
    if (this.props.chatMessages.length === 0) {
      this.loadMessages();
    }
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render(): JSX.Element {
    return (
      <div className="content" ref={this.contentRef}>
        <div className="conversation">
          <div className={this.messagesClasses()}>
            {this.renderMessages()}
          </div>
          {this.renderQuickReplies()}
        </div>
      </div>
    );
  }

  private renderMessages(): JSX.Element[] {
    return this.props.chatMessages.map((chatMessage, index) => {
      const previousMessage = this.props.chatMessages[index - 1];
      const continuation = previousMessage && previousMessage.direction === chatMessage.direction && this.isSameAgent(previousMessage, chatMessage);
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        switch (chatMessage.type) {
          case ChatMessage.TYPE_TEXT:
            return <IncomingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
          case ChatMessage.TYPE_CONNECT_CHANNELS:
            return <ConnectChannelsMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
          default:
            return null;
        }
      }
      switch (chatMessage.type) {
        case ChatMessage.TYPE_TEXT:
          return <OutgoingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
        case ChatMessage.TYPE_FILE:
          return <FileMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
        default:
          return null;
      }
    });
  }

  private renderQuickReplies(): JSX.Element {
    if (!this.props.lastMessage || !this.props.lastMessage.quick_replies) {
      return null;
    }
    return (
      <div className={this.quickRepliesClasses()}>
        {this.renderQuickRepliesButtons()}
      </div>
    );
  }

  private renderQuickRepliesButtons(): JSX.Element[] {
    return this.props.lastMessage.quick_replies.map((quickReply, index) => {
      return <QuickReplyButton key={index} quickReply={quickReply} onButtonClick={this.postQuickReply}/>;
    });
  }

  private messagesClasses(): any {
    return classNames({
      messages: true,
      'with-replies': this.props.lastMessage && this.props.lastMessage.quick_replies,
    });
  }

  private quickRepliesClasses(): any {
    return classNames({
      'quick-replies': true,
    });
  }

  private scrollToBottom(): void {
    this.contentRef.current.scrollTop = this.contentRef.current.scrollHeight;
  }

  private onUserChanged(): void {
    this.loadMessages();
  }

  private onChatMessageAdded(): void {
    this.scrollToBottom();
  }

  private isSameAgent(previousMessage: ChatMessage, chatMessage: ChatMessage): boolean {
    return !previousMessage.agent && !chatMessage.agent || (previousMessage.agent && chatMessage.agent && previousMessage.agent.id === chatMessage.agent.id);
  }

  private async loadMessages(): Promise<void> {
    const chatMessages = await AyroService.listMessages(this.props.apiToken);
    this.props.setChatMessages(chatMessages);
    setTimeout(() => {
      this.scrollToBottom();
    }, 200);
  }

  private async postQuickReply(quickReply: QuickReply): Promise<void> {
    const now = new Date();
    const messageData = {
      type: ChatMessage.TYPE_TEXT,
      text: quickReply.title,
      payload: quickReply.payload,
    };
    const chatMessage = new ChatMessage({
      ...messageData,
      id: String(now.getTime()),
      direction: ChatMessage.DIRECTION_OUTGOING,
      status: ChatMessage.STATUS_SENDING,
      date: now,
    });
    this.props.addChatMessage(chatMessage);
    try {
      const postedMessage = await AyroService.postMessage(this.props.apiToken, messageData);
      postedMessage.status = ChatMessage.STATUS_SENT;
      this.props.updateChatMessage(chatMessage.id, postedMessage);
    } catch (err) {
      chatMessage.status = ChatMessage.STATUS_ERROR;
      this.props.updateChatMessage(chatMessage.id, chatMessage);
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    apiToken: state.apiToken,
    userStatus: state.userStatus,
    user: state.user,
    chatMessages: state.chatMessages,
    lastMessage: state.lastMessage,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    setChatMessages: Actions.setChatMessages,
    addChatMessage: Actions.addChatMessage,
    updateChatMessage: Actions.updateChatMessage,
    removeChatMessage: Actions.removeChatMessage,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Conversation);
