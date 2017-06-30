'use strict';

import * as React from 'react';

import ChatBox from './ChatBox';
import classes from '../utils/classes';

interface Properties {}
interface State {
  opened: boolean
}

export default class ChatzContainer extends React.Component<Properties, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      opened: false
    };
    this.toggleConversation = this.toggleConversation.bind(this)
  }

  private toggleConversation(): void {
    this.setState({opened: !this.state.opened});
  }

  private buttonClasses(): string {
    return classes({
      'chatz-button': true,
      'chatz-show': !this.state.opened,
      'chatz-hide': this.state.opened
    });
  }

  render() {
    return (
      <div id="chatz-container">
        <ChatBox opened={this.state.opened}/>
        <button className={this.buttonClasses()} onClick={this.toggleConversation}></button>
      </div>
    );
  }
}