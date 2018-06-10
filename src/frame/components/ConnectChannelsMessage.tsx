import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as classNames from 'classnames';
import * as isNil from 'lodash.isnil';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {User} from 'frame/models/User';
import {Device} from 'frame/models/Device';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';

interface StateProps {
  apiToken: string;
  settings: Settings;
  integration: Integration;
  user: User;
  devices: Device[];
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
  editingEmail: boolean;
}

class ConnectChannelMessage extends React.Component<StateProps & DispatchProps & OwnProps, OwnState> {

  private static readonly CHANNEL_EMAIL = 'email';

  private emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  private emailDirty = false;

  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.editEmail = this.editEmail.bind(this);
    const emailDevice = this.props.devices.find((device) => {
      return device.channel === ConnectChannelMessage.CHANNEL_EMAIL;
    });
    this.state = {
      email: !isNil(emailDevice) ? emailDevice.info.email : this.props.user.email || '',
      editingEmail: isNil(emailDevice),
    };
  }

  public render(): JSX.Element {
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="balloon">
          <div className="message-content">
            {this.renderAgentName()}
            {this.renderConnectEmail()}
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

  private renderConnectEmail(): JSX.Element {
    const messageSettings = this.props.settings.chatbox.connect_channels_message;
    if (this.state.email && !this.state.editingEmail) {
      return (
        <div>
          <span>{messageSettings.email_provided}</span>
          <div className="mt">
            <div className="flex">
              <input className={this.inputClasses()} value={this.state.email} disabled={true} name="email" type="email"/>
              <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.editEmail} type="button">
                {messageSettings.edit_email_button}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <span>{messageSettings.ask_for_email}</span>
        <div className="mt">
          <div className="flex">
            <input className={this.inputClasses()} onChange={this.onEmailChanged} defaultValue={this.state.email} name="email" type="email" placeholder={messageSettings.email_input_placeholder}/>
            <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.sendEmail} type="button">
              {messageSettings.send_email_button}
            </button>
          </div>
        </div>
      </div>
    );
  }

  private messageClasses(): string {
    return classNames({
      message: true,
      'message-incoming': true,
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

  private async sendEmail(): Promise<void> {
    if (this.isValidEmail()) {
      await AyroService.connectEmail(this.props.apiToken, this.state.email);
      this.setState({...this.state, editingEmail: false});
    }
  }

  private async editEmail(): Promise<void> {
    this.setState({...this.state, editingEmail: true});
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    apiToken: state.apiToken,
    settings: state.settings,
    integration: state.integration,
    user: state.user,
    devices: state.devices,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    hideChat: Actions.hideChat,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ConnectChannelMessage);
