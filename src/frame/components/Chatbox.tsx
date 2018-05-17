import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as classNames from 'classnames';

import Conversation from 'frame/components/Conversation';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {Constants} from 'utils/Constants';

interface StateProps {
  settings: Settings;
  integration: Integration;
  apiToken: string;
  showChat: boolean;
}

interface DispatchProps {
  hideChat: () => void;
  showButton: () => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
}

interface OwnState {
  message: string;
}

class Chatbox extends React.Component<StateProps & DispatchProps, OwnState> {

  private inputElement: HTMLInputElement;

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.state = {message: ''};
    this.setInputElement = this.setInputElement.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMessageChanged = this.onMessageChanged.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.showChat) {
      return null;
    }
    return (
      <div className="chat main-box">
        <div className="header" style={this.headerStyles()} onClick={this.closeChat}>
          {this.props.settings.chatbox.title}
          <svg className="close-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
          </svg>
        </div>
        <Conversation/>
        <div className="footer">
          <input ref={this.setInputElement} placeholder={this.props.settings.chatbox.input_placeholder} value={this.state.message} onChange={this.onMessageChanged} onKeyPress={this.onKeyPress} type="text" name="message"/>
          <svg onClick={this.postMessage} className={this.iconSendClasses()} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/>
          </svg>
        </div>
      </div>
    );
  }

  private iconSendClasses(): string {
    return classNames({
      'send-icon': true,
      disabled: this.state.message.length === 0,
      enabled: this.state.message.length > 0,
    });
  }

  private headerStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private setInputElement(input: HTMLInputElement): void {
    this.inputElement = input;
  }

  private onKeyPress(event: any): void {
    if (event.key === 'Enter') {
      this.postMessage();
    }
  }

  private onMessageChanged(event: any): void {
    this.setState({message: event.target.value});
  }

  private closeChat(): void {
    this.props.hideChat();
    window.parent.postMessage({
      type: Constants.EVENT_SIZE_CHANGED,
      size: Constants.SIZE_BUTTON,
    }, '*');
    setTimeout(() => {
      this.props.showButton();
    }, 100);
  }

  private async postMessage(): Promise<void> {
    if (this.state.message.length > 0) {
      this.inputElement.focus();
      const now = new Date();
      const chatMessage = new ChatMessage({
        id: String(now.getTime()),
        type: ChatMessage.TYPE_TEXT,
        text: this.state.message,
        direction: ChatMessage.DIRECTION_OUTGOING,
        status: ChatMessage.STATUS_SENDING,
        date: now,
      });
      this.props.addChatMessage(chatMessage);
      this.setState({message: ''});
      try {
        const postedMessage = await AyroService.postMessage(this.props.apiToken, chatMessage.text);
        postedMessage.status = ChatMessage.STATUS_SENT;
        this.props.updateChatMessage(chatMessage.id, postedMessage);
      } catch (err) {
        chatMessage.status = ChatMessage.STATUS_ERROR;
        this.props.updateChatMessage(chatMessage.id, chatMessage);
      }
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    settings: state.settings,
    integration: state.integration,
    apiToken: state.apiToken,
    showChat: state.showChat,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    hideChat: Actions.hideChat,
    showButton: Actions.showButton,
    unsetLastUnread: Actions.unsetLastUnread,
    addChatMessage: Actions.addChatMessage,
    updateChatMessage: Actions.updateChatMessage,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Chatbox);
