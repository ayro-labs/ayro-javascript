import * as React from 'react';
import {connect} from 'react-redux';

import IncomingMessage from 'components/IncomingMessage';
import Chatbox from 'components/Chatbox';
import ChatButton from 'components/ChatButton';

import {ChatMessage} from 'models/ChatMessage';
import {IStoreState} from 'stores/Store';

interface IStateProps {
  lastUnread: ChatMessage;
}

class Container extends React.Component<IStateProps, {}> {

  public render() {
    return (
      <div id="ayro-container">
        <IncomingMessage chatMessage={this.props.lastUnread} unreadStyle={true}/>
        <Chatbox/>
        <ChatButton/>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    lastUnread: state.lastUnread,
  };
}

export default connect<IStateProps, any, any, IStoreState>(mapStateToProps, null)(Container);
