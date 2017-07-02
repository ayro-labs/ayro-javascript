'use strict';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './store/actions';
import classes from '../utils/classes';

import ChatMessage from '../models/ChatMessage';

interface Properties {
  chatMessages: Array<ChatMessage>,
  dispatch: Function
}
interface State {}

class Conversation extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
  }

  render() {
    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatMessages: state.chatMessages
  };
}

export default connect(mapStateToProps)(Conversation);