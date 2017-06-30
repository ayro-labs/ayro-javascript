'use strict';

import * as React from 'react';

import classes from '../utils/classes';

interface Properties {
  opened: boolean
}
interface State {}

export default class ChatBox extends React.Component<Properties, State> {

  constructor(props: any) {
    super(props);
  }

  private getClasses(): string {
    return classes({
      'chatz-chatbox': true,
      'chatz-show': this.props.opened,
      'chatz-hide': !this.props.opened
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