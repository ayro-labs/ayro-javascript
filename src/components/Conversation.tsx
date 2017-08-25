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
          <div key={chatMessage.id} className={this.incomingClasses(continuation)}>
            {this.renderAuthorPhoto(chatMessage, continuation)}
            <div className={this.messageClasses(chatMessage)}>
              {this.renderAuthorName(chatMessage, continuation)}
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
            </div>
            <div className="chatz-clear"/>
          </div>
        );
      } else {
        return (
          <div key={chatMessage.id} className={this.outgoingClasses(continuation)}>
            <div className={this.messageClasses(chatMessage)} style={this.outgoingStyles()}>
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
            </div>
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

  private messageClasses(chatMessage: ChatMessage): string {
    return Classes.get({
      'chatz-message': true,
      'chatz-message-sending': chatMessage.status === ChatMessage.STATUS_SENDING,
      'chatz-message-sent': !chatMessage.status || chatMessage.status === ChatMessage.STATUS_SENT,
      'chatz-message-error': chatMessage.status === ChatMessage.STATUS_ERROR_SENDING,
    });
  }

  private incomingClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-incoming': true,
      'chatz-message-discontinuation' : !continuation,
    });
  }

  private outgoingClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-outgoing': true,
      'chatz-message-discontinuation' : !continuation,
    });
  }

  private outgoingStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.conversation_color,
    };
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
