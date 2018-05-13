import * as React from 'react';
import {connect} from 'react-redux';
import * as classNames from 'classnames';

import {AyroService} from 'services/AyroService';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {StoreState} from 'stores/Store';
import {Channels} from 'utils/Channels';

interface StateProps {
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
    this.state = {email: '', connected: false};
    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.connectEmail = this.connectEmail.bind(this);
  }

  public render() {
    if (!this.state.connected) {
      return (
        <div className="ayro-connect-email">
          <img src={this.channel.icon}/>
          <p>Conecte seu email e seja notificado quando receber uma resposta.</p>
          <div className="ayro-flex">
            <input className={this.inputClasses()} onChange={this.onEmailChanged} defaultValue={this.props.user.email} name="email" type="email" placeholder="Email"/>
            <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.connectEmail} type="submit">Enviar</button>
          </div>
        </div>
      );
    }
    return (
      <div className="ayro-connect-email">
        <img src={this.channel.icon}/>
        <p>Email conectado com sucesso!</p>
      </div>
    );
  }

  private inputClasses(): string {
    return classNames({
      'ayro-input': true,
      'ayro-flex-grow-1': true,
      'ayro-error': this.emailDirty && !this.isValidEmail(),
    });
  }

  private buttonClasses(): string {
    return classNames({
      'ayro-btn': true,
      'ayro-ml': true,
      'ayro-disabled': !this.isValidEmail(),
    });
  }

  private buttonStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private onEmailChanged(event: any) {
    this.emailDirty = true;
    this.setState({email: event.target.value});
  }

  private isValidEmail() {
    return this.emailRegex.test(this.state.email);
  }

  private async connectEmail() {
    if (this.isValidEmail()) {
      await AyroService.connectEmail(this.props.apiToken, this.state.email);
      this.setState({...this.state, connected: true});
      this.channel.connected = true;
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    integration: state.integration,
    apiToken: state.apiToken,
    user: state.user,
  };
}

export default connect<StateProps, {}, {}, StoreState>(mapStateToProps)(ConnectEmail);
