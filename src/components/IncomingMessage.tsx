import * as React from 'react';
import {connect} from 'react-redux';

import {ChatMessage} from 'models/ChatMessage';
import {Classes} from 'utils/Classes';

interface IParamProps {
  chatMessage: ChatMessage;
  continuation: boolean;
}

class IncomingMessage extends React.Component<IParamProps, any> {

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
            <span className="ayro-message-time">{this.formatMessageTime()}</span>
          </div>
        </div>
        <div className="ayro-clear"/>
      </div>
    );
  }

  private renderAuthorPhoto() {
    if (!this.props.continuation) {
      return (
        <div className="ayro-agent-photo">
          <img src={this.props.chatMessage.agent.photo_url}/>
        </div>
      );
    }
    return null;
  }

  private renderAuthorName() {
    if (!this.props.continuation) {
      return (
        <div className="ayro-message-agent">
          {this.props.chatMessage.agent.name}
        </div>
      );
    }
    return null;
  }

  private formatMessageTime(): string {
    const date = this.props.chatMessage.date;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return [hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes].join(':');
  }

  private messageClasses(): string {
    return Classes.get({
      'ayro-message-incoming': true,
      'ayro-message-discontinuation': !this.props.continuation,
    });
  }
}

export default connect<any, any, IParamProps>(null, null)(IncomingMessage);
