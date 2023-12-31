import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';

import Conversation from 'frame/components/Conversation';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {AyroError} from 'frame/errors/AyroError';
import {Messages} from 'frame/utils/Messages';
import {Constants} from 'frame/utils/Constants';
import {ApplicationConstants} from 'utils/ApplicationConstants';

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
  removeChatMessage: (chatMessage: ChatMessage) => void;
}

interface OwnState {
  message: string;
  alert: string;
}

class Chatbox extends React.Component<StateProps & DispatchProps, OwnState> {

  private static readonly ALERT_TIME = 5000;

  private contentReference: React.RefObject<HTMLDivElement>;
  private inputReference: React.RefObject<HTMLInputElement>;
  private subscriptions: any[] = [];

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.onAlert = this.onAlert.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMessageChanged = this.onMessageChanged.bind(this);
    this.onSetChatMessages = this.onSetChatMessages.bind(this);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.postFile = this.postFile.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.contentReference = React.createRef<HTMLDivElement>();
    this.inputReference = React.createRef<HTMLInputElement>();
    this.state = {
      message: '',
      alert: null,
    };
  }

  public componentDidMount(): void {
    this.subscriptions.push(PubSub.subscribe(Actions.SET_CHAT_MESSAGES, this.onSetChatMessages));
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
    this.subscriptions.push(PubSub.subscribe(Constants.EVENT_ALERT, this.onAlert));
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render(): JSX.Element {
    if (!this.props.showChat) {
      return null;
    }
    return (
      <div className="chat main-box">
        {this.renderHeader()}
        {this.renderAlert()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }

  private renderHeader(): JSX.Element {
    return (
      <div className="header" style={this.headerStyles()} onClick={this.closeChat}>
        {this.props.settings.chatbox.title}
        <svg className="close-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
        </svg>
      </div>
    );
  }

  private renderContent(): JSX.Element {
    return (
      <div className="content" ref={this.contentReference}>
        <Conversation/>
      </div>
    );
  }

  private renderAlert(): JSX.Element {
    if (!this.state.alert) {
      return null;
    }
    return (
      <div className="alert">
        {this.state.alert}
      </div>
    );
  }

  private renderFooter(): JSX.Element {
    return (
      <div className="footer">
        <input ref={this.inputReference} placeholder={this.props.settings.chatbox.input_placeholder} value={this.state.message} onChange={this.onMessageChanged} onKeyPress={this.onKeyPress} type="text" name="message"/>
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
    );
  }

  private headerStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private onAlert(err: AyroError): void {
    const message = Messages.get(err);
    if (message) {
      this.setState({...this.state, alert: message});
      setTimeout(() => {
        this.setState({...this.state, alert: null});
      }, Chatbox.ALERT_TIME);
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

  private onSetChatMessages(): void {
    this.scrollToBottom();
    this.inputFocus();
  }

  private onChatMessageAdded(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const contentElement = this.contentReference.current;
    if (contentElement) {
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }

  private inputFocus(): void {
    const inputElement = this.inputReference.current;
    if (inputElement) {
      inputElement.focus();
    }
  }

  private async postMessage(): Promise<void> {
    if (this.state.message.length > 0) {
      this.inputFocus();
      const now = new Date();
      const messageData = {type: ChatMessage.TYPE_TEXT, text: this.state.message};
      const chatMessage = new ChatMessage({
        ...messageData,
        id: String(now.getTime()),
        direction: ChatMessage.DIRECTION_OUTGOING,
        status: ChatMessage.STATUS_SENDING,
        date: now,
      });
      this.props.addChatMessage(chatMessage);
      this.setState({message: ''});
      try {
        const postedMessage = await AyroService.postMessage(this.props.apiToken, messageData);
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
    if (file.size > Constants.FILE_MAX_SIZE) {
      this.onAlert(new AyroError({code: Messages.FILE_SIZE_LIMIT_EXCEEDED}));
      return;
    }
    const reader = new FileReader();
    reader.onload = async (readEvent: any) => {
      const now = new Date();
      const chatMessage = new ChatMessage({
        id: String(now.getTime()),
        type: ChatMessage.TYPE_FILE,
        media: {
          file,
          name: file.name,
          type: file.type,
          url: readEvent.target.result,
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

  private closeChat(): void {
    this.props.hideChat();
    window.parent.postMessage({
      type: ApplicationConstants.EVENT_SIZE_CHANGED,
      size: ApplicationConstants.SIZE_BUTTON,
    }, '*');
    setTimeout(() => {
      this.props.showButton();
    }, 100);
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
    removeChatMessage: Actions.removeChatMessage,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Chatbox);
