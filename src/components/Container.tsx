import * as React from 'react';
import {connect} from 'react-redux';

import Chatbox from 'components/Chatbox';
import ChatButton from 'components/ChatButton';

class Container extends React.Component<any, any> {

  public render() {
    return (
      <div id="ayro-container">
        <Chatbox/>
        <ChatButton/>
      </div>
    );
  }
}

export default connect<any, any, any>(null, null)(Container);
