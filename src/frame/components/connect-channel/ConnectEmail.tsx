import * as React from 'react';
import {connect} from 'react-redux';
import * as classNames from 'classnames';

import {AyroService} from 'frame/services/AyroService';
import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {User} from 'frame/models/User';
import {StoreState} from 'frame/stores/Store';
import {Channels} from 'frame/utils/Channels';

interface StateProps {
  settings: Settings;
  integration: Integration;
  user: User;
  apiToken: string;
}

interface OwnState {
  email: string;
  connected: boolean;
}

class ConnectEmail extends React.Component<StateProps, OwnState> {

  private channel = Channels.EMAIL;
  private emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  private emailDirty = false;

  constructor(props: StateProps) {
    super(props);
    this.state = {
      email: this.props.user.email || '',
      connected: false,
    };
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.connectEmail = this.connectEmail.bind(this);
  }

  public render(): JSX.Element {
    if (!this.state.connected) {
      return (
        <div className="connect-email">
          <img src={this.channel.icon}/>
          <p>{this.props.settings.connect_email.description}</p>
          <div className="flex">
            <input className={this.inputClasses()} onChange={this.onEmailChanged} defaultValue={this.state.email} name="email" type="email" placeholder={this.props.settings.connect_email.input_placeholder}/>
            <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.connectEmail} type="submit">
              {this.props.settings.connect_email.send_button}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="connect-email">
        <img src={this.channel.icon}/>
        <p>{this.props.settings.connect_email.success_message}</p>
      </div>
    );
  }

  private inputClasses(): string {
    return classNames({
      'flex-grow': true,
      input: true,
      error: this.emailDirty && !this.isValidEmail(),
    });
  }

  private buttonClasses(): string {
    return classNames({
      button: true,
      ml: true,
      disabled: !this.isValidEmail(),
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
      this.channel.connected = true;
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

export default connect<StateProps, {}, {}, StoreState>(mapStateToProps)(ConnectEmail);
