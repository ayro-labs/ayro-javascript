'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../store/Actions';
import Classes from '../utils/Classes';

import Chatbox from './Chatbox';

interface Properties {
  chatOpened: boolean,
  openChat: Function,
  closeChat: Function,
}
interface State {}

class Container extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
    this.toggleConversation = this.toggleConversation.bind(this)
  }

  private toggleConversation() {
    if (this.props.chatOpened) {
      this.props.closeChat();
    } else {
      this.props.openChat();
    }
  }

  private buttonClasses(): string {
    return Classes.get({
      'chatz-button': true,
      'chatz-show': !this.props.chatOpened,
      'chatz-hide': this.props.chatOpened
    });
  }

  render() {
    return (
      <div id="chatz-container">
        <Chatbox/>
        <button className={this.buttonClasses()} onClick={this.toggleConversation}></button>
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
    openChat: () => {
      dispatch(Actions.openChat());
    },
    closeChat: () => {
      dispatch(Actions.closeChat());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);