import * as React from 'react';
import {connect} from 'react-redux';
import * as classNames from 'classnames';

import {ChatMessage} from 'frame/models/ChatMessage';
import {AppUtils} from 'frame/utils/AppUtils';

interface OwnProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

class IncomingMessage extends React.Component<OwnProps> {

  public render(): JSX.Element {
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="balloon">
          <div className="content">
            {this.renderAgentName()}
            <div className="text">
              <span>{this.props.chatMessage.text}</span>
            </div>
            <div className="status">
              <span className="time">
                {AppUtils.formatMessageTime(this.props.chatMessage)}
              </span>
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
      incoming: true,
      discontinuation: !this.props.continuation,
    });
  }
}

export default connect<{}, {}, OwnProps>(null)(IncomingMessage);
