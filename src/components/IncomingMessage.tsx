import * as React from 'react';
import {connect} from 'react-redux';
import * as classNames from 'classnames';

import {ChatMessage} from 'models/ChatMessage';
import {AppUtils} from 'utils/AppUtils';

interface OwnProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

class IncomingMessage extends React.Component<OwnProps> {

  public render() {
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAgentPhoto()}
        <div className="ayro-balloon">
          <div className="ayro-message">
            {this.renderAgentName()}
            <div className="ayro-text">
              <span>{this.props.chatMessage.text}</span>
            </div>
            <div className="ayro-status">
              <span className="ayro-status-time">
                {AppUtils.formatMessageTime(this.props.chatMessage)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderAgentPhoto() {
    if (this.props.continuation) {
      return null;
    }
    return (
      <div className="ayro-agent-photo">
        <img src={this.props.chatMessage.agent.photo_url}/>
      </div>
    );
  }

  private renderAgentName() {
    if (this.props.continuation) {
      return null;
    }
    return (
      <div className="ayro-agent-name">
        {this.props.chatMessage.agent.name}
      </div>
    );
  }

  private messageClasses(): string {
    return classNames({
      'ayro-message-incoming': true,
      'ayro-message-discontinuation': !this.props.continuation,
    });
  }
}

export default connect<{}, {}, OwnProps>(null)(IncomingMessage);
