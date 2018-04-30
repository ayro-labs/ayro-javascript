import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import Conversation from 'components/Conversation';

import {AyroService} from 'services/AyroService';
import {Settings} from 'models/Settings';
import {Integration} from 'models/Integration';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IStateProps {
  settings: Settings;
  integration: Integration;
  apiToken: string;
  chatOpened: boolean;
}

interface IDispatchProps {
  closeChat: () => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  updateChatMessage: (id: string, chatMessage: ChatMessage) => void;
}

interface IState {
  message: string;
}

class Chatbox extends React.Component<IStateProps & IDispatchProps, IState> {

  private inputElement: HTMLInputElement;

  constructor(props: IStateProps & IDispatchProps) {
    super(props);
    this.state = {message: ''};
    this.setInputElement = this.setInputElement.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMessageChanged = this.onMessageChanged.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  public render() {
    return (
      <div className={this.chatboxClasses()}>
        <div className="ayro-chatbox-header" style={this.headerStyles()} onClick={this.closeChat}>
          {this.props.settings.chatbox.title}
          <svg className="ayro-icon-close" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
          </svg>
        </div>
        <Conversation/>
        <div className="ayro-chatbox-footer">
          <div className="ayro-input">
            <input type="text" name="message" ref={this.setInputElement} placeholder={this.props.settings.chatbox.input_placeholder} value={this.state.message} onChange={this.onMessageChanged} onKeyPress={this.onKeyPress}/>
          </div>
          <svg onClick={this.postMessage} className={this.iconSendClasses()} width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/>
          </svg>
        </div>
      </div>
    );
  }

  private setInputElement(input: HTMLInputElement) {
    this.inputElement = input;
  }

  private closeChat() {
    this.props.closeChat();
  }

  private onKeyPress(event: any) {
    if (event.key === 'Enter') {
      this.postMessage();
    }
  }

  private onMessageChanged(event: any) {
    this.setState({message: event.target.value});
  }

  private async postMessage(): Promise<void> {
    if (this.state.message.length > 0) {
      this.inputElement.focus();
      const now = new Date();
      const chatMessage = new ChatMessage({
        id: String(now.getTime()),
        direction: ChatMessage.DIRECTION_OUTGOING,
        status: ChatMessage.STATUS_SENDING,
        text: this.state.message,
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

  private chatboxClasses(): string {
    return Classes.get({
      'ayro-chatbox': true,
      'ayro-show': this.props.chatOpened,
      'ayro-hide': !this.props.chatOpened,
    });
  }

  private iconSendClasses(): string {
    return Classes.get({
      'ayro-icon-send': true,
      'ayro-disabled': this.state.message.length === 0,
      'ayro-enabled': this.state.message.length > 0,
    });
  }

  private headerStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    settings: state.settings,
    integration: state.integration,
    apiToken: state.apiToken,
    chatOpened: state.chatOpened,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): IDispatchProps {
  return bindActionCreators({
    closeChat: Actions.closeChat,
    addChatMessage: Actions.addChatMessage,
    updateChatMessage: Actions.updateChatMessage,
  }, dispatch);
}

export default connect<IStateProps, IDispatchProps, any, IStoreState>(mapStateToProps, mapDispatchToProps)(Chatbox);
