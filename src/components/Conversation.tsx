import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as PubSub from 'pubsub-js';

import Actions from '../stores/Actions';
import Classes from '../utils/Classes';
import ChatzService from '../services/ChatzService';

import ChatMessage from '../models/ChatMessage';

interface IProperties {
  chatMessages: ChatMessage[];
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

class Conversation extends React.Component<IProperties, {}> {

  private subscriptions: any[] = [];
  private conversationElement: HTMLDivElement;

  constructor(props: IProperties) {
    super(props);
    this.setConversationElement = this.setConversationElement.bind(this);
    this.onConversationChanged = this.onConversationChanged.bind(this);
  }

  public componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.OPEN_CHAT, this.onConversationChanged));
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onConversationChanged));
    ChatzService.listMessages().then((chatMessages) => {
      this.props.setChatMessages(chatMessages);
    });
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
            <div className={this.messageClasses(chatMessage)}>
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

  private onConversationChanged() {
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
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

  private messageClasses(chatMessage: ChatMessage): string {
    return Classes.get({
      'chatz-message': true,
      'chatz-message-sending': chatMessage.status === ChatMessage.STATUS_SENDING,
      'chatz-message-sent': !chatMessage.status || chatMessage.status === ChatMessage.STATUS_SENT,
      'chatz-message-error': chatMessage.status === ChatMessage.STATUS_ERROR_SENDING,
    });
  }
}

function mapStateToProps(state: any): any {
  return {
    chatMessages: state.chatMessages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    setChatMessages: (chatMessages: ChatMessage[]) => {
      dispatch(Actions.setChatMessages(chatMessages));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
