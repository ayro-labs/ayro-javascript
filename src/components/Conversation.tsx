import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';

import ConnectChannelsMessage from 'components/ConnectChannelsMessage';
import IncomingMessage from 'components/IncomingMessage';
import OutgoingMessage from 'components/OutgoingMessage';

import {AyroService} from 'services/AyroService';
import {UserStatus} from 'enums/UserStatus';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {StoreState} from 'stores/Store';

interface StateProps {
  userStatus: UserStatus;
  user: User;
  apiToken: string;
  chatMessages: ChatMessage[];
}

interface DispatchProps {
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

class Conversation extends React.Component<StateProps & DispatchProps> {

  private subscriptions: any[] = [];
  private conversationElement: HTMLDivElement;

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.setConversationElement = this.setConversationElement.bind(this);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
    this.onUserChanged = this.onUserChanged.bind(this);
  }

  public componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
    this.subscriptions.push(PubSub.subscribe(Actions.SET_USER, this.onUserChanged));
    if (this.props.chatMessages.length === 0) {
      this.loadMessages();
    }
  }

  public componentWillUnmount() {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render() {
    return (
      <div className="ayro-content" ref={this.setConversationElement}>
        <div className="ayro-messages">
          {this.renderMessages()}
        </div>
      </div>
    );
  }

  private renderMessages() {
    return this.props.chatMessages.map((chatMessage, index) => {
      const previousMessage = this.props.chatMessages[index - 1];
      const continuation = previousMessage && previousMessage.direction === chatMessage.direction && this.isSameAgent(previousMessage, chatMessage);
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        switch (chatMessage.type) {
          case ChatMessage.TYPE_TEXT:
            return <IncomingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
          case ChatMessage.TYPE_CONNECT_CHANNELS:
            return <ConnectChannelsMessage key={chatMessage.id} chatMessage={chatMessage}/>;
          default:
            return null;
        }
      }
      switch (chatMessage.type) {
        case ChatMessage.TYPE_TEXT:
          return <OutgoingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
        default:
          return null;
      }
    });
  }

  private setConversationElement(div: HTMLDivElement) {
    this.conversationElement = div;
  }

  private onUserChanged() {
    this.loadMessages();
  }

  private onChatMessageAdded() {
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
  }

  private isSameAgent(previousMessage: ChatMessage, chatMessage: ChatMessage) {
    return !previousMessage.agent && !chatMessage.agent || (previousMessage.agent && chatMessage.agent && previousMessage.agent.id === chatMessage.agent.id);
  }

  private async loadMessages(): Promise<void> {
    const chatMessages = await AyroService.listMessages(this.props.apiToken);
    this.props.setChatMessages(chatMessages);
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    userStatus: state.userStatus,
    user: state.user,
    apiToken: state.apiToken,
    chatMessages: state.chatMessages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    setChatMessages: Actions.setChatMessages,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Conversation);
