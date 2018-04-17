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
        <div className="ayro-header" style={this.headerStyles()} onClick={this.closeChat}>
          {this.props.settings.chatbox.title}
          <div className="ayro-close">
            <i className="ayro-fas ayro-fa-times"/>
          </div>
        </div>
        <Conversation/>
        <div className="ayro-footer">
          <div className="ayro-input">
            <input type="text" name="message" ref={this.setInputElement} placeholder={this.props.settings.chatbox.input_placeholder} value={this.state.message} onChange={this.onMessageChanged} onKeyPress={this.onKeyPress}/>
          </div>
          <div className={this.postMessageClasses()} onClick={this.postMessage}>
            <i className="ayro-fas ayro-fa-paper-plane"/>
          </div>
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

  private postMessage() {
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
      AyroService.postMessage(this.props.apiToken, chatMessage.text).then((postedMessage) => {
        postedMessage.status = ChatMessage.STATUS_SENT;
        this.props.updateChatMessage(chatMessage.id, postedMessage);
      }).catch(() => {
        chatMessage.status = ChatMessage.STATUS_ERROR;
        this.props.updateChatMessage(chatMessage.id, chatMessage);
      });
    }
  }

  private chatboxClasses(): string {
    return Classes.get({
      'ayro-chatbox': true,
      'ayro-show': this.props.chatOpened,
      'ayro-hide': !this.props.chatOpened,
    });
  }

  private postMessageClasses(): string {
    return Classes.get({
      'ayro-post': true,
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
