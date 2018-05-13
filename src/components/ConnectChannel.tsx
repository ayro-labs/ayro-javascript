import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import ConnectEmail from 'components/connect-channel/ConnectEmail';

import {Integration} from 'models/Integration';
import {Channel} from 'models/Channel';
import {Actions} from 'stores/Actions';
import {StoreState} from 'stores/Store';
import {Channels} from 'utils/Channels';

interface StateProps {
  integration: Integration;
  apiToken: string;
  showConnectChannel: boolean;
  channelToConnect: Channel;
}

interface DispatchProps {
  showChat: () => void;
  showButton: () => void;
  hideConnectChannel: () => void;
  unsetChannelToConnect: () => void;
}

class ConnectChannel extends React.Component<StateProps & DispatchProps> {

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.backToChat = this.backToChat.bind(this);
    this.closeConnectChannel = this.closeConnectChannel.bind(this);
  }

  public render() {
    if (!this.props.showConnectChannel || !this.props.channelToConnect) {
      return null;
    }
    return (
      <div className="ayro-connect-channel ayro-box">
        <div className="ayro-header" style={this.headerStyles()}>
          <svg onClick={this.backToChat} className="ayro-arrow-left-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"/>
          </svg>
          <div className="ayro-title">
            {this.props.channelToConnect.name}
          </div>
          <svg onClick={this.closeConnectChannel} className="ayro-close-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
          </svg>
        </div>
        <div className="ayro-content">
          <div className="ayro-channel">
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }

  private renderContent() {
    switch (this.props.channelToConnect) {
      case Channels.EMAIL:
        return <ConnectEmail/>;
      default:
        return null;
    }
  }

  private headerStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private backToChat() {
    this.props.showChat();
    this.props.hideConnectChannel();
    this.props.unsetChannelToConnect();
  }

  private closeConnectChannel() {
    this.props.hideConnectChannel();
    this.props.unsetChannelToConnect();
    this.props.showButton();
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    integration: state.integration,
    apiToken: state.apiToken,
    showConnectChannel: state.showConnectChannel,
    channelToConnect: state.channelToConnect,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    showChat: Actions.showChat,
    showButton: Actions.showButton,
    hideConnectChannel: Actions.hideConnectChannel,
    unsetChannelToConnect: Actions.unsetChannelToConnect,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(ConnectChannel);
