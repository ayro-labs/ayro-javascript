import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';

import IncomingMessage from 'frame/components/messages/IncomingMessage';
import OutgoingMessage from 'frame/components/messages/OutgoingMessage';
import ConnectChannelsMessage from 'frame/components/messages/ConnectChannelsMessage';
import FileMessage from 'frame/components/messages/FileMessage';

import {AyroService} from 'frame/services/AyroService';
import {UserStatus} from 'frame/enums/UserStatus';
import {User} from 'frame/models/User';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';

interface StateProps {
  apiToken: string;
  userStatus: UserStatus;
  user: User;
  chatMessages: ChatMessage[];
}

interface DispatchProps {
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

class Conversation extends React.Component<StateProps & DispatchProps> {

  private subscriptions: any[] = [];
  private contentRef: React.RefObject<HTMLDivElement>;

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
    this.onUserChanged = this.onUserChanged.bind(this);
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
          <div className="messages">
            {this.renderMessages()}
          </div>
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
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    apiToken: state.apiToken,
    userStatus: state.userStatus,
    user: state.user,
    chatMessages: state.chatMessages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    setChatMessages: Actions.setChatMessages,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Conversation);
