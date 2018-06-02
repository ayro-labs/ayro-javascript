import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as classNames from 'classnames';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {User} from 'frame/models/User';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';

interface StateProps {
  settings: Settings;
  integration: Integration;
  user: User;
  apiToken: string;
}

interface DispatchProps {
  hideChat: () => void;
}

interface OwnProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

interface OwnState {
  email: string;
  connected: boolean;
}

class ConnectChannelMessage extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  private emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  private emailDirty = false;

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);
    this.state = {
      email: this.props.user.email || '',
      connected: false,
    };
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.connectEmail = this.connectEmail.bind(this);
  }

  public render(): JSX.Element {
    const messageSettings = this.props.settings.chatbox.connect_channels_message;
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="balloon">
          <div className="message-content">
            {this.renderAgentName()}
            <span>{messageSettings.leave_your_email}</span>
            <div className="mt">
              <div className="flex">
                <div>
                  <input className={this.inputClasses()} onChange={this.onEmailChanged} defaultValue={this.state.email} name="email" type="email" placeholder={messageSettings.email_input_placeholder}/>
                </div>
                <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.connectEmail} type="submit">
                  {messageSettings.send_email_button}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderAgentPhoto(): JSX.Element {
    if (this.props.continuation) {
      return null;
    }
    return (
      <div className="agent-photo">
        <img src={this.props.chatMessage.agent.photo_url}/>
      </div>
    );
  }

  private renderAgentName(): JSX.Element {
    if (this.props.continuation) {
      return null;
    }
    return (
      <div className="agent-name">
        {this.props.chatMessage.agent.name}
      </div>
    );
  }

  private messageClasses(): string {
    return classNames({
      message: true,
      'message-connect-channel': true,
      'message-discontinuation': !this.props.continuation,
    });
  }

  private inputClasses(): string {
    return classNames({
      input: true,
      error: this.emailDirty && !this.isValidEmail(),
      'w-100': true,
    });
  }

  private buttonClasses(): string {
    return classNames({
      button: true,
      disabled: !this.isValidEmail(),
      'ml-2': true,
    });
  }

  private buttonStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private onEmailChanged(event: any): void {
    this.emailDirty = true;
    this.setState({email: event.target.value});
  }

  private isValidEmail(): boolean {
    return this.emailRegex.test(this.state.email);
  }

  private async connectEmail(): Promise<void> {
    if (this.isValidEmail()) {
      await AyroService.connectEmail(this.props.apiToken, this.state.email);
      this.setState({...this.state, connected: true});
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    settings: state.settings,
    integration: state.integration,
    apiToken: state.apiToken,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    hideChat: Actions.hideChat,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ConnectChannelMessage);
