'use strict';

import * as React from 'react';

import ChatBox from './ChatBox';
import classes from '../utils/classes';

interface Properties {}
interface State {
  chatOpened: boolean
}

export default class ChatzContainer extends React.Component<Properties, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      chatOpened: false
    };
    this.toggleConversation = this.toggleConversation.bind(this)
  }

  private toggleConversation(): void {
    this.setState({chatOpened: !this.state.chatOpened});
  }

  private chatboxContainerClasses(): string {
    return classes({
      'chatz-chatbox-container': true,
      'chatz-show': this.state.chatOpened,
      'chatz-hide': !this.state.chatOpened
    });
  }

  private buttonClasses(): string {
    return classes({
      'chatz-button': true,
      'chatz-show': !this.state.chatOpened,
      'chatz-hide': this.state.chatOpened
    });
  }

  render() {
    return (
      <div id="chatz-container">
        <div className={this.chatboxContainerClasses()}>
          <ChatBox/>
        </div>
        <button className={this.buttonClasses()} onClick={this.toggleConversation}></button>
      </div>
    );
  }
}