'use strict';

import * as React from 'react';
import { bindActionCreators } from 'redux';
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
    let messages = this.props.chatMessages.map((chatMessage) =>
      <div key={chatMessage.date.getTime()}>{chatMessage.text}</div>
    );
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