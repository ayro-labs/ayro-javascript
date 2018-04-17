import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import {AyroService} from 'services/AyroService';
import {Integration} from 'models/Integration';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IStateProps {
  integration: Integration;
  apiToken: string;
}

interface IDispatchProps {
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
  removeChatMessage: (chatMessage: ChatMessage) => void;
}

interface IParamProps {
  chatMessage: ChatMessage;
  continuation: boolean;
}

class OutgoingMessage extends React.Component<IStateProps & IDispatchProps & IParamProps, any> {

  constructor(props: IStateProps & IDispatchProps & IParamProps) {
    super(props);
    this.retryMessage = this.retryMessage.bind(this);
  }

  public render() {
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        <div className="ayro-message" style={this.messageStyles()}>
          <div className="ayro-message-text">
            <span>{this.props.chatMessage.text}</span>
          </div>
          <div className="ayro-message-status">
            <span className="ayro-message-time">{this.formatMessageTime()}</span>
            <i className={this.messageStatusClasses()}/>
          </div>
        </div>
        {this.renderRefreshButton()}
        <div className="ayro-clear"/>
      </div>
    );
  }

  private retryMessage() {
    this.props.removeChatMessage(this.props.chatMessage);
    const now = new Date();
    const chatMessage = new ChatMessage({
      id: String(now.getTime()),
      direction: ChatMessage.DIRECTION_OUTGOING,
      status: ChatMessage.STATUS_SENDING,
      text: this.props.chatMessage.text,
      date: now,
    });
    this.props.addChatMessage(chatMessage);
    AyroService.postMessage(this.props.apiToken, chatMessage.text).then((postedMessage) => {
      postedMessage.status = ChatMessage.STATUS_SENT;
      this.props.updateChatMessage(chatMessage.id, postedMessage);
    }).catch(() => {
      chatMessage.status = ChatMessage.STATUS_ERROR;
      this.props.updateChatMessage(chatMessage.id, chatMessage);
    });
  }

  private formatMessageTime(): string {
    const date = this.props.chatMessage.date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return [hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes].join(':');
  }

  private renderRefreshButton() {
    if (this.props.chatMessage.status === ChatMessage.STATUS_ERROR) {
      return (
        <div className="ayro-message-retry" onClick={this.retryMessage}>
          <i className="ayro-fas ayro-fa-sync"/>
        </div>
      );
    }
    return null;
  }

  private messageClasses(): string {
    return Classes.get({
      'ayro-message-outgoing': true,
      'ayro-message-discontinuation': !this.props.continuation,
    });
  }

  private messageStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.conversation_color,
    };
  }

  private messageStatusClasses() {
    const status = this.props.chatMessage.status;
    return Classes.get({
      'ayro-fas': [ChatMessage.STATUS_SENT, ChatMessage.STATUS_ERROR].includes(status),
      'ayro-far': status === ChatMessage.STATUS_SENDING,
      'ayro-fa-check': status === ChatMessage.STATUS_SENT,
      'ayro-fa-clock': status === ChatMessage.STATUS_SENDING,
      'ayro-fa-times': status === ChatMessage.STATUS_ERROR,
    });
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    integration: state.integration,
    apiToken: state.apiToken,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): IDispatchProps {
  return bindActionCreators({
    addChatMessage: Actions.addChatMessage,
    updateChatMessage: Actions.updateChatMessage,
    removeChatMessage: Actions.removeChatMessage,
  }, dispatch);
}

export default connect<IStateProps, IDispatchProps, IParamProps, IStoreState>(mapStateToProps, mapDispatchToProps)(OutgoingMessage);
