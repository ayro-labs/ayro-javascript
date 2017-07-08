'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../stores/Actions';
import Classes from '../utils/Classes';

import Chatbox from './Chatbox';

interface Properties {
  chatOpened: boolean,
  openChat: Function
}
interface State {}

class Container extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
    this.openChat = this.openChat.bind(this)
  }

  private openChat() {
    this.props.openChat();
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
        <button className={this.buttonClasses()} onClick={this.openChat}>
          <i className="fa fa-comments"></i>
        </button>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);