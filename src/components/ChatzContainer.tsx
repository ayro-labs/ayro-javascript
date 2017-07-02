'use strict';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './store/actions';
import classes from '../utils/classes';

import ChatBox from './ChatBox';

interface Properties {
  chatOpened: boolean,
  dispatch: Function
}
interface State {}

class ChatzContainer extends React.Component<Properties, State> {

  constructor(props: Properties) {
    super(props);
    this.toggleConversation = this.toggleConversation.bind(this)
  }

  private toggleConversation(): void {
    this.props.dispatch(this.props.chatOpened ? actions.closeChat() : actions.openChat());
  }

  private buttonClasses(): string {
    return classes({
      'chatz-button': true,
      'chatz-show': !this.props.chatOpened,
      'chatz-hide': this.props.chatOpened
    });
  }

  render() {
    return (
      <div id="chatz-container">
        <ChatBox/>
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

export default connect(mapStateToProps)(ChatzContainer);