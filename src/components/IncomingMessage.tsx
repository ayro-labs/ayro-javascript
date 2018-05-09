import * as React from 'react';
import {connect} from 'react-redux';
import * as classNames from 'classnames';

import {ChatMessage} from 'models/ChatMessage';
import {AppUtils} from 'utils/AppUtils';

interface ParamProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
}

class IncomingMessage extends React.Component<ParamProps, {}> {

  public render() {
    return (
      <div key={this.props.chatMessage.id} className={this.messageClasses()}>
        {this.renderAuthorPhoto()}
        <div className="ayro-message">
          {this.renderAuthorName()}
          <div className="ayro-message-text">
            <span>{this.props.chatMessage.text}</span>
          </div>
          <div className="ayro-message-status">
            <span className="ayro-message-time">
              {AppUtils.formatMessageTime(this.props.chatMessage)}
            </span>
          </div>
        </div>
        <div className="ayro-clear"/>
      </div>
    );
  }

  private renderAuthorPhoto() {
    if (this.props.continuation) {
      return null;
    }
    return (
      <div className="ayro-agent-photo">
        <img src={this.props.chatMessage.agent.photo_url}/>
      </div>
    );
  }

  private renderAuthorName() {
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

export default connect<any, any, ParamProps>(null, null)(IncomingMessage);
