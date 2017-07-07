'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../store/Actions';
import Classes from '../utils/Classes';
import ChatzService from '../services/ChatzService';

import ChatMessage from '../models/ChatMessage';

import Conversation from './Conversation';

interface Properties {
  chatOpened: boolean,
  closeChat: Function,
  addChatMessage: Function
}
interface State {
  message: string
}

class Chatbox extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
    this.state = {message: ''};
    this.closeChat = this.closeChat.bind(this)
    this.onMessageChanged = this.onMessageChanged.bind(this)
    this.postMessage = this.postMessage.bind(this)
  }

  private closeChat() {
    this.props.closeChat();
  }

  private onMessageChanged(event) {
    this.setState({message: event.target.value});
  }

  private postMessage() {
    let chatMessage = new ChatMessage({
      direction: ChatMessage.DIRECTION_OUTGOING,
      status: ChatMessage.STATUS_SENDING,
      text: this.state.message,
      date: new Date()
    });
    ChatzService.postMessage(chatMessage.text).then(() => {
      this.props.addChatMessage(chatMessage);
      this.setState({message: ''});
    });
  }

  private getClasses(): string {
    return Classes.get({
      'chatz-chatbox': true,
      'chatz-show': this.props.chatOpened,
      'chatz-hide': !this.props.chatOpened
    });
  }

  render() {
    return (
      <div className={this.getClasses()}>
        <div className="chatz-header">
          How can we help?
          <div className="chatz-close" onClick={this.closeChat}>
            <i className="fa fa-times"></i>
          </div>
        </div>
        <Conversation/>
        <div className="chatz-footer">
          <div className="chatz-input">
            <input type="text" name="message" placeholder="Type a message..." value={this.state.message} onChange={this.onMessageChanged}/>
          </div>
          <div className="chatz-send" onClick={this.postMessage}>
            <i className="fa fa-paper-plane"></i>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatOpened: state.chatOpened
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addChatMessage: (chatMessage: ChatMessage) => {
      dispatch(Actions.addChatMessage(chatMessage));
    },
    closeChat: () => {
      dispatch(Actions.closeChat());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);