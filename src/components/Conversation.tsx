'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import ChatMessage from '../models/ChatMessage';

interface Properties {
  chatMessages: Array<ChatMessage>
}
interface State {}

class Conversation extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
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
            {chatMessage.text}
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
    chatMessages: state.chatMessages
  };
}

export default connect(mapStateToProps)(Conversation);