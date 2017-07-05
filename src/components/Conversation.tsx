'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../store/Actions';
import ChatzService from '../services/Chatz';

import ChatMessage from '../models/ChatMessage';

interface Properties {
  apiToken: string,
  chatMessages: Array<ChatMessage>,
  setChatMessages: Function
}
interface State {}

class Conversation extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
  }

  componentDidMount() {
    ChatzService.listChatMessages(this.props.apiToken).then((chatMessages) => {
      this.props.setChatMessages(chatMessages);
    });
  }

  render() {
    let messages = this.props.chatMessages.map((chatMessage) => {
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        return (
          <div key={chatMessage.date.getTime()} className="chatz-message-incoming">
            <div className="chatz-author-photo">
              <img src={chatMessage.author.photo}/>
            </div>
            <div className="chatz-message">
              <div className="chatz-author-name">
                {chatMessage.author.name}
              </div>
              <div className="chatz-message-text">
                {chatMessage.text}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={chatMessage.date.getTime()} className="chatz-message-outgoing">
            <div className="chatz-message">
              <div className="chatz-message-text">
                {chatMessage.text}
              </div>
            </div>
          </div>
        );
      }
    });
    return (
      <div>{messages}</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apiToken: state.apiToken,
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