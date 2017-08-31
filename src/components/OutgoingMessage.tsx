import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import {ChatzService} from 'services/ChatzService';
import {Integration} from 'models/Integration';
import {ChatMessage} from 'models/ChatMessage';
import {Actions, IAction} from 'stores/Actions';
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
        <div className="chatz-message" style={this.messageStyles()}>
          <div className="chatz-message-text">
            <span>{this.props.chatMessage.text}</span>
          </div>
          <div className="chatz-message-status">
            <span className="chatz-message-time">{this.formatMessageTime()}</span>
            <i className={this.messageStatusClasses()}/>
          </div>
        </div>
        {this.renderRefreshButton()}
        <div className="chatz-clear"/>
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
    ChatzService.postMessage(this.props.apiToken, chatMessage.text).then((postedMessage) => {
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
        <div className="chatz-message-refresh" onClick={this.retryMessage}>
          <i className="fa fa-refresh"/>
        </div>
      );
    }
    return null;
  }

  private messageClasses(): string {
    return Classes.get({
      'chatz-message-outgoing': true,
      'chatz-message-discontinuation': !this.props.continuation,
    });
  }

  private messageStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.conversation_color,
    };
  }

  private messageStatusClasses() {
    return Classes.get({
      fa: true,
      'fa-check': this.props.chatMessage.status === ChatMessage.STATUS_SENT,
      'fa-clock-o': this.props.chatMessage.status === ChatMessage.STATUS_SENDING,
      'fa-times': this.props.chatMessage.status === ChatMessage.STATUS_ERROR,
    });
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    integration: state.integration,
    apiToken: state.apiToken,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>): IDispatchProps {
  return {
    addChatMessage: (chatMessage: ChatMessage) => {
      dispatch(Actions.addChatMessage(chatMessage));
    },
    updateChatMessage: (id: string, chatMessage: ChatMessage) => {
      dispatch(Actions.updateChatMessage(id, chatMessage));
    },
    removeChatMessage: (chatMessage: ChatMessage) => {
      dispatch(Actions.removeChatMessage(chatMessage));
    },
  };
}

export default connect<IStateProps, IDispatchProps, IParamProps>(mapStateToProps, mapDispatchToProps)(OutgoingMessage);
