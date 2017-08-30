import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as PubSub from 'pubsub-js';

import {ChatzApp} from 'core/ChatzApp';
import {ChatzService} from 'services/ChatzService';
import {UserStatus} from 'enums/UserStatus';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';
import {Actions, IAction} from 'stores/Actions';
import {IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IProperties {
  userStatus: UserStatus;
  integration: Integration;
  user: User;
  apiToken: string;
  chatMessages: ChatMessage[];
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

class Conversation extends React.Component<IProperties, {}> {

  private subscriptions: any[] = [];
  private conversationElement: HTMLDivElement;

  constructor(props: IProperties) {
    super(props);
    this.setConversationElement = this.setConversationElement.bind(this);
    this.onChatOpened = this.onChatOpened.bind(this);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
  }

  public componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.OPEN_CHAT, this.onChatOpened));
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
  }

  public componentWillUnmount() {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render() {
    const messages = this.props.chatMessages.map((chatMessage, index) => {
      const previousChatMessage = this.props.chatMessages[index - 1];
      const continuation = previousChatMessage && previousChatMessage.author.id === chatMessage.author.id;
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        return (
          <div key={chatMessage.id} className={this.incomingMessageClasses(continuation)}>
            {this.renderAuthorPhoto(chatMessage, continuation)}
            <div className="chatz-message">
              {this.renderAuthorName(chatMessage, continuation)}
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
              <div className="chatz-message-status">
                {this.formatMessageTime(chatMessage)}
              </div>
            </div>
            <div className="chatz-clear"/>
          </div>
        );
      } else {
        return (
          <div key={chatMessage.id} className={this.outgoingMessageClasses(continuation)}>
            <div className="chatz-message" style={this.outgoingMessageStyles()}>
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
              <div className="chatz-message-status">
                <span className="chatz-message-time">{this.formatMessageTime(chatMessage)}</span>
                <i className={this.messageStatusClasses(chatMessage)}/>
              </div>
            </div>
            {this.renderRefreshButton(chatMessage)}
            <div className="chatz-clear"/>
          </div>
        );
      }
    });
    return (
      <div className="chatz-conversation" ref={this.setConversationElement}>
        <div className="chatz-messages">
          {messages}
        </div>
      </div>
    );
  }

  private setConversationElement(div: HTMLDivElement) {
    this.conversationElement = div;
  }

  private onChatOpened() {
    if (UserStatus.LOGGED_IN !== this.props.userStatus) {
      ChatzApp.getInstance().login(this.props.user).then(() => {
        this.loadMessages();
      });
    } else {
      this.loadMessages();
    }
  }

  private onChatMessageAdded() {
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
  }

  private loadMessages() {
    ChatzService.listMessages(this.props.apiToken).then((chatMessages) => {
      this.props.setChatMessages(chatMessages);
      this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
    });
  }

  private renderAuthorPhoto(chatMessage: ChatMessage, continuation: boolean) {
    if (!continuation) {
      return (
        <div className="chatz-author-photo">
          <img src={chatMessage.author.photo_url}/>
        </div>
      );
    }
    return null;
  }

  private renderAuthorName(chatMessage: ChatMessage, continuation: boolean) {
    if (!continuation) {
      return (
        <div className="chatz-message-author">
          {chatMessage.author.name}
        </div>
      );
    }
    return null;
  }

  private renderRefreshButton(chatMessage: ChatMessage) {
    if (chatMessage.status === ChatMessage.STATUS_ERROR) {
      return (
        <div className="chatz-message-refresh">
          <i className="fa fa-refresh"/>
        </div>
      );
    }
    return null;
  }

  private formatMessageTime(chatMessage: ChatMessage): string {
    const date = chatMessage.date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return [hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes].join(':');
  }

  private incomingMessageClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-incoming': true,
      'chatz-message-discontinuation': !continuation,
    });
  }

  private outgoingMessageClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-outgoing': true,
      'chatz-message-discontinuation': !continuation,
    });
  }

  private outgoingMessageStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.conversation_color,
    };
  }

  private messageStatusClasses(chatMessage: ChatMessage) {
    return Classes.get({
      fa: true,
      'fa-check': chatMessage.status === ChatMessage.STATUS_SENT,
      'fa-clock-o': chatMessage.status === ChatMessage.STATUS_SENDING,
      'fa-times': chatMessage.status === ChatMessage.STATUS_ERROR,
    });
  }
}

function mapStateToProps(state: IStoreState): any {
  return {
    userStatus: state.userStatus,
    integration: state.integration,
    user: state.user,
    apiToken: state.apiToken,
    chatMessages: state.chatMessages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>): any {
  return {
    setChatMessages: (chatMessages: ChatMessage[]) => {
      dispatch(Actions.setChatMessages(chatMessages));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
