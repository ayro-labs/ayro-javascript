import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import Conversation from 'frame/components/Conversation';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {Constants} from 'utils/Constants';

interface StateProps {
  showChat: boolean;
  apiToken: string;
  settings: Settings;
  integration: Integration;
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
    this.setInputElement = this.setInputElement.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMessageChanged = this.onMessageChanged.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.postFile = this.postFile.bind(this);
    this.state = {message: ''};
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
          <label className="upload-file">
            <svg className="attachment-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1596 1385q0 117-79 196t-196 79q-135 0-235-100l-777-776q-113-115-113-271 0-159 110-270t269-111q158 0 273 113l605 606q10 10 10 22 0 16-30.5 46.5t-46.5 30.5q-13 0-23-10l-606-607q-79-77-181-77-106 0-179 75t-73 181q0 105 76 181l776 777q63 63 145 63 64 0 106-42t42-106q0-82-63-145l-581-581q-26-24-60-24-29 0-48 19t-19 48q0 32 25 59l410 410q10 10 10 22 0 16-31 47t-47 31q-12 0-22-10l-410-410q-63-61-63-149 0-82 57-139t139-57q88 0 149 63l581 581q100 98 100 235z"/>
            </svg>
            <input onChange={this.postFile} style={{display: 'none'}} name="file" type="file" accept="*/*"/>
          </label>
          <svg onClick={this.postMessage} className="send-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/>
          </svg>
        </div>
      </div>
    );
  }

  private headerStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private setInputElement(input: HTMLInputElement): void {
    this.inputElement = input;
    if (this.inputElement) {
      this.inputElement.focus();
    }
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

  private async postFile(event: any): Promise<void> {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (readEvent: any) => {
      const now = new Date();
      const chatMessage = new ChatMessage({
        id: String(now.getTime()),
        type: ChatMessage.TYPE_FILE,
        media: {
          name: file.name,
          type: file.type,
          url: readEvent.target.result,
          file: file,
        },
        direction: ChatMessage.DIRECTION_OUTGOING,
        status: ChatMessage.STATUS_SENDING,
        date: now,
      });
      this.props.addChatMessage(chatMessage);
      try {
        const postedMessage = await AyroService.postFile(this.props.apiToken, file);
        postedMessage.status = ChatMessage.STATUS_SENT;
        this.props.updateChatMessage(chatMessage.id, postedMessage);
      } catch (err) {
        chatMessage.status = ChatMessage.STATUS_ERROR;
        this.props.updateChatMessage(chatMessage.id, chatMessage);
      }
    };
    reader.readAsDataURL(file);
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    showChat: state.showChat,
    apiToken: state.apiToken,
    settings: state.settings,
    integration: state.integration,
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
