'use strict';

import * as React from 'react';

export default class ChatBox extends React.Component<{}, {}> {

  render() {
    return (
      <div className="chatz-chatbox">
        <div className="chatz-chatbox-header">
          How can we help?
        </div>
        <div className="chatz-chatbox-conversation"></div>
        <div className="chatz-chatbox-footer">
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