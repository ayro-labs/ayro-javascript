import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import {AyroService} from 'services/AyroService';
import {Integration} from 'models/Integration';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {StoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface StateProps {
  integration: Integration;
  apiToken: string;
}

interface DispatchProps {
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
  removeChatMessage: (chatMessage: ChatMessage) => void;
}

interface ParamProps {
  chatMessage: ChatMessage;
  continuation: boolean;
}

class OutgoingMessage extends React.Component<StateProps & DispatchProps & ParamProps, {}> {

  constructor(props: StateProps & DispatchProps & ParamProps) {
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
            {this.renderStatusIcon()}
          </div>
        </div>
        {this.renderRefreshButton()}
        <div className="ayro-clear"/>
      </div>
    );
  }

  private async retryMessage(): Promise<void> {
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
    try {
      const postedMessage = await AyroService.postMessage(this.props.apiToken, chatMessage.text);
      postedMessage.status = ChatMessage.STATUS_SENT;
      this.props.updateChatMessage(chatMessage.id, postedMessage);
    } catch (err) {
      chatMessage.status = ChatMessage.STATUS_ERROR;
      this.props.updateChatMessage(chatMessage.id, chatMessage);
    }
  }

  private formatMessageTime(): string {
    const date = this.props.chatMessage.date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return [hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes].join(':');
  }

  private renderStatusIcon() {
    switch (this.props.chatMessage.status) {
      case ChatMessage.STATUS_SENDING:
        return (
          <svg className="ayro-icon-status" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1024 544v448q0 14-9 23t-23 9h-320q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h224v-352q0-14 9-23t23-9h64q14 0 23 9t9 23zm416 352q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
          </svg>
        );
      case ChatMessage.STATUS_SENT:
        return (
          <svg className="ayro-icon-status" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/>
          </svg>
        );
      case ChatMessage.STATUS_ERROR:
        return (
          <svg className="ayro-icon-status" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
          </svg>
        );
      default:
        return null;
    }
  }

  private renderRefreshButton() {
    if (this.props.chatMessage.status === ChatMessage.STATUS_ERROR) {
      return (
        <div className="ayro-message-retry" onClick={this.retryMessage}>
          <svg className="ayro-icon-retry" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1639 1056q0 5-1 7-64 268-268 434.5t-478 166.5q-146 0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 19 19 45z"/>
          </svg>
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
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    integration: state.integration,
    apiToken: state.apiToken,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    addChatMessage: Actions.addChatMessage,
    updateChatMessage: Actions.updateChatMessage,
    removeChatMessage: Actions.removeChatMessage,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, ParamProps, StoreState>(mapStateToProps, mapDispatchToProps)(OutgoingMessage);
