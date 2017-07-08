'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as PubSub from 'pubsub-js';

import Actions from '../stores/Actions';
import Classes from '../utils/Classes';
import ChatzService from '../services/ChatzService';

import ChatMessage from '../models/ChatMessage';

interface Properties {
  chatMessages: Array<ChatMessage>,
  setChatMessages: Function
}
interface State {}

class Conversation extends React.Component<Properties, State> {

  subscriptions: Array<any> = new Array<any>();

  constructor(props: Properties) {
    super(props);
    this.onConversationChanged = this.onConversationChanged.bind(this)
  }

  componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.OPEN_CHAT, this.onConversationChanged));
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onConversationChanged));
    ChatzService.listMessages().then((chatMessages) => {
      this.props.setChatMessages(chatMessages);
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach((subscription) => PubSub.unsubscribe(subscription));
  }

  private onConversationChanged() {
    let element = ReactDOM.findDOMNode(this.refs.conversation);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  private incomingClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-incoming': true,
      'chatz-message-discontinuation' : !continuation
    });
  }

  private outgoingClasses(continuation: boolean): string {
    return Classes.get({
      'chatz-message-outgoing': true,
      'chatz-message-discontinuation' : !continuation
    });
  }

  private messageClasses(chatMessage: ChatMessage): string {
    return Classes.get({
      'chatz-message': true,
      'chatz-message-sending': chatMessage.status === ChatMessage.STATUS_SENDING,
      'chatz-message-sent': !chatMessage.status || chatMessage.status === ChatMessage.STATUS_SENT,
      'chatz-message-error': chatMessage.status === ChatMessage.STATUS_ERROR_SENDING
    });
  }

  render() {
    let messages = this.props.chatMessages.map((chatMessage, index) => {
      let previousChatMessage = this.props.chatMessages[index - 1];
      let continuation = previousChatMessage && previousChatMessage.author.id === chatMessage.author.id;
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        return (
          <div key={chatMessage._id} className={this.incomingClasses(continuation)}>
            {!continuation &&
              <div className="chatz-author-photo">
                <img src={chatMessage.author.photo_url}/>
              </div>
            }
            <div className={this.messageClasses(chatMessage)}>
              {!continuation &&
                <div className="chatz-message-author">
                  {chatMessage.author.name}
                </div>
              }
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
            </div>
            <div className="chatz-clear"></div>
          </div>
        );
      } else {
        return (
          <div key={chatMessage._id} className={this.outgoingClasses(continuation)}>
            <div className={this.messageClasses(chatMessage)}>
              <div className="chatz-message-text">
                <span>{chatMessage.text}</span>
              </div>
            </div>
            <div className="chatz-clear"></div>
          </div>
        );
      }
    });
    return (
      <div className="chatz-conversation" ref="conversation">
        <div className="chatz-messages">
          {messages}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatMessages: state.chatMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setChatMessages: (chatMessages: Array<ChatMessage>) => {
      dispatch(Actions.setChatMessages(chatMessages));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);