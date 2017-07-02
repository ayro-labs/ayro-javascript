'use strict';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './store/actions';
import classes from '../utils/classes';

interface Properties {
  chatOpened: boolean,
  dispatch: Function
}
interface State {}

class ChatBox extends React.Component<Properties, State> {

  private getClasses(): string {
    return classes({
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
        </div>
        <div className="chatz-conversation"></div>
        <div className="chatz-footer">
          <div className="chatz-compose">
            <div className="chatz-input">
              <input type="text" name="message" placeholder="Type a message..."/>
            </div>
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

export default connect(mapStateToProps)(ChatBox);