'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../store/Actions';
import Classes from '../utils/Classes';
import ChatzClient from '../services/ChatzClient';

import ChatMessage from '../models/ChatMessage';

import Conversation from './Conversation';

interface Properties {
  apiToken: string,
  chatOpened: boolean,
  addMessage: Function
}
interface State {
  message: string
}

class ChatBox extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
    this.state = {message: ''};
    this.onMessageChanged = this.onMessageChanged.bind(this)
    this.postMessage = this.postMessage.bind(this)
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
    ChatzClient.postMessage(this.props.apiToken, chatMessage.text).then(() => {
      this.props.addMessage(chatMessage);
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
        <div className="chatz-header">How can we help?</div>
        <div className="chatz-conversation">
          <Conversation/>
        </div>
        <div className="chatz-footer">
          <div className="chatz-compose">
            <div className="chatz-input">
              <input type="text" name="message" placeholder="Type a message..." value={this.state.message} onChange={this.onMessageChanged}/>
            </div>
            <button onClick={this.postMessage}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apiToken: state.apiToken,
    chatOpened: state.chatOpened
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMessage: (chatMessage: ChatMessage) => {
      dispatch(Actions.addMessage(chatMessage));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);