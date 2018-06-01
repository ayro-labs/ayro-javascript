import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as classNames from 'classnames';

import {Settings} from 'frame/models/Settings';
import {Integration} from 'frame/models/Integration';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Channel} from 'frame/models/Channel';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {Channels} from 'frame/utils/Channels';

interface StateProps {
  settings: Settings;
  integration: Integration;
}

interface DispatchProps {
  setChannelToConnect: (channel: Channel) => void;
  showConnectChannel: () => void;
  hideChat: () => void;
}

interface OwnProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

class ConnectChannelMessage extends React.Component<StateProps & DispatchProps & OwnProps> {

  public render(): JSX.Element {
    if (!this.props.showConnectChannel) {
      return null;
    }
    const availableChannels = this.renderAvailableChannels();
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="balloon">
          <div className="message-content">
            {this.renderAgentName()}
            <div className="text">
              <span>{this.props.settings.chatbox.connect_channels_message}</span>
            </div>
            <div className="available-channels">
              {availableChannels}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderAvailableChannels(): JSX.Element[] {
    return this.props.chatMessage.metadata.available_channels.map((availableChannel: string) => {
      const channel = Channels.get(availableChannel);
      if (!channel) {
        return null;
      }
      return (
        <div key={channel.id} onClick={this.openConnectChannel.bind(this, channel)} className="available-channel">
          <img src={channel.icon} title={channel.name}/>
          {this.renderChannelConnectedIcon(channel)}
        </div>
      );
    });
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

  private renderChannelConnectedIcon(channel: Channel): JSX.Element {
    if (!channel.connected) {
      return null;
    }
    return (
      <div style={this.connectedBackgroundStyles()} className="connected-background">
        <svg className="connected-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/>
        </svg>
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

  private connectedBackgroundStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private openConnectChannel(channel: Channel): void {
    this.props.setChannelToConnect(channel);
    this.props.showConnectChannel();
    this.props.hideChat();
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    settings: state.settings,
    integration: state.integration,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    setChannelToConnect: Actions.setChannelToConnect,
    showConnectChannel: Actions.showConnectChannel,
    hideChat: Actions.hideChat,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ConnectChannelMessage);
