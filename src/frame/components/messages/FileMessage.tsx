import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import * as classNames from 'classnames';
import truncate from 'lodash-es/truncate';

import {AyroService} from 'frame/services/AyroService';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {AppUtils} from 'frame/utils/AppUtils';
import {Messages} from 'frame/utils/Messages';
import {Constants} from 'frame/utils/Constants';

interface StateProps {
  apiToken: string;
}

interface DispatchProps {
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
  removeChatMessage: (chatMessage: ChatMessage) => void;
}

interface OwnProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

class FileMessage extends React.Component<StateProps & DispatchProps & OwnProps> {

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);
    this.getFileName = this.getFileName.bind(this);
    this.getFileSize = this.getFileSize.bind(this);
    this.openMediaUrl = this.openMediaUrl.bind(this);
    this.retryMessage = this.retryMessage.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div key={this.props.chatMessage.id} onClick={this.openMediaUrl} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="balloon">
          <div className="content">
            {this.renderAgentName()}
            {this.renderFile()}
            <div className="status-bg"/>
            <div className="status">
              <span className="time">
                {AppUtils.formatMessageTime(this.props.chatMessage)}
              </span>
              {this.renderStatusIcon()}
            </div>
          </div>
        </div>
        {this.renderRefreshButton()}
      </div>
    );
  }

  private renderAgentPhoto(): JSX.Element {
    if (this.props.chatMessage.direction === ChatMessage.DIRECTION_OUTGOING || this.props.continuation) {
      return null;
    }
    return (
      <div className="agent-photo">
        <img src={this.props.chatMessage.agent.photo_url}/>
      </div>
    );
  }

  private renderAgentName(): JSX.Element {
    if (this.props.chatMessage.direction === ChatMessage.DIRECTION_OUTGOING || this.props.continuation) {
      return null;
    }
    return (
      <div className="agent-name">
        {this.props.chatMessage.agent.name}
      </div>
    );
  }

  private renderFile(): JSX.Element {
    if (this.props.chatMessage.media.type.startsWith('image')) {
      return (
        <img src={this.props.chatMessage.media.url}/>
      );
    }
    return (
      <div className="attachment">
        <svg className="icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1596 1385q0 117-79 196t-196 79q-135 0-235-100l-777-776q-113-115-113-271 0-159 110-270t269-111q158 0 273 113l605 606q10 10 10 22 0 16-30.5 46.5t-46.5 30.5q-13 0-23-10l-606-607q-79-77-181-77-106 0-179 75t-73 181q0 105 76 181l776 777q63 63 145 63 64 0 106-42t42-106q0-82-63-145l-581-581q-26-24-60-24-29 0-48 19t-19 48q0 32 25 59l410 410q10 10 10 22 0 16-31 47t-47 31q-12 0-22-10l-410-410q-63-61-63-149 0-82 57-139t139-57q88 0 149 63l581 581q100 98 100 235z"/>
        </svg>
        <div className="info">
          <div className="name">{this.getFileName()}</div>
          <div className="size">{this.getFileSize()}</div>
        </div>
      </div>
    );
  }

  private renderStatusIcon(): JSX.Element {
    if (this.props.chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
      return null;
    }
    switch (this.props.chatMessage.status) {
      case ChatMessage.STATUS_SENDING:
        return (
          <svg className="status-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1024 544v448q0 14-9 23t-23 9h-320q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h224v-352q0-14 9-23t23-9h64q14 0 23 9t9 23zm416 352q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
          </svg>
        );
      case ChatMessage.STATUS_SENT:
        return (
          <svg className="status-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/>
          </svg>
        );
      case ChatMessage.STATUS_ERROR:
        return (
          <svg className="status-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
          </svg>
        );
      default:
        return null;
    }
  }

  private renderRefreshButton(): JSX.Element {
    if (this.props.chatMessage.status !== ChatMessage.STATUS_ERROR) {
      return null;
    }
    return (
      <div onClick={this.retryMessage} className="retry">
        <svg className="retry-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1639 1056q0 5-1 7-64 268-268 434.5t-478 166.5q-146 0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 19 19 45z"/>
        </svg>
      </div>
    );
  }

  private messageClasses(): string {
    return classNames({
      message: true,
      incoming: this.props.chatMessage.direction === ChatMessage.DIRECTION_INCOMING,
      outgoing: this.props.chatMessage.direction === ChatMessage.DIRECTION_OUTGOING,
      image: this.props.chatMessage.media.type.startsWith('image'),
      file: !this.props.chatMessage.media.type.startsWith('image'),
      discontinuation: !this.props.continuation,
    });
  }

  private getFileName(): string {
    return truncate(this.props.chatMessage.media.name, {
      length: 20,
      separator: ' ',
      omission: '...',
    });
  }

  private getFileSize(): string {
    const sizeInMB = this.props.chatMessage.media.size / 1000000;
    return `${Math.round(sizeInMB * 100) / 100} MB`;
  }

  private openMediaUrl(): void {
    if (this.props.chatMessage.media.url) {
      const win = window.open();
      win.location.href = this.props.chatMessage.media.url;
    }
  }

  private async retryMessage(): Promise<void> {
    const chatMessage = this.props.chatMessage;
    if (chatMessage.media.file.size > Constants.FILE_MAX_SIZE) {
      PubSub.publish(Constants.EVENT_ALERT, {code: Messages.FILE_SIZE_LIMIT_EXCEEDED});
      return;
    }
    chatMessage.status = ChatMessage.STATUS_SENDING;
    this.props.updateChatMessage(chatMessage.id, chatMessage);
    try {
      const postedMessage = await AyroService.postFile(this.props.apiToken, chatMessage.media.file);
      postedMessage.status = ChatMessage.STATUS_SENT;
      this.props.removeChatMessage(chatMessage);
      this.props.addChatMessage(postedMessage);
    } catch (err) {
      chatMessage.status = ChatMessage.STATUS_ERROR;
      this.props.updateChatMessage(chatMessage.id, chatMessage);
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
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

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(FileMessage);
