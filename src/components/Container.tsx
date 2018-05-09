import * as React from 'react';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';

import IncomingMessage from 'components/IncomingMessage';
import Chatbox from 'components/Chatbox';
import ChatButton from 'components/ChatButton';

import {ChatMessage} from 'models/ChatMessage';
import {StoreState} from 'stores/Store';
import {Actions} from 'stores/Actions';
import {Sounds} from 'utils/Sounds';

interface StateProps {
  lastUnread: ChatMessage;
  chatOpened: boolean;
}

class Container extends React.Component<StateProps, {}> {

  private subscriptions: any[] = [];

  constructor(props: StateProps) {
    super(props);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
  }

  public componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
  }

  public componentWillUnmount() {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render() {
    return (
      <div id="ayro-container">
        <IncomingMessage chatMessage={this.props.lastUnread} unreadStyle={true}/>
        <Chatbox/>
        <ChatButton/>
      </div>
    );
  }

  // tslint:disable-next-line:variable-name
  private onChatMessageAdded(_type: string, action: AnyAction) {
    const chatMessage: ChatMessage = action.extraProps.chatMessage;
    if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING && (!this.props.chatOpened || !document.hasFocus())) {
      Sounds.playChatMessageSound();
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    lastUnread: state.lastUnread,
    chatOpened: state.chatOpened,
  };
}

export default connect<StateProps, any, any, StoreState>(mapStateToProps, null)(Container);
