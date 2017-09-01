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
        <div className="chatz-message">
          {this.renderAuthorName()}
          <div className="chatz-message-text">
            <span>{this.props.chatMessage.text}</span>
          </div>
          <div className="chatz-message-status">
            <span className="chatz-message-time">{this.formatMessageTime()}</span>
          </div>
        </div>
        <div className="chatz-clear"/>
      </div>
    );
  }

  private renderAuthorPhoto() {
    if (!this.props.continuation) {
      return (
        <div className="chatz-author-photo">
          <img src={this.props.chatMessage.author.photo_url}/>
        </div>
      );
    }
    return null;
  }

  private renderAuthorName() {
    if (!this.props.continuation) {
      return (
        <div className="chatz-message-author">
          {this.props.chatMessage.author.name}
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
      'chatz-message-incoming': true,
      'chatz-message-discontinuation': !this.props.continuation,
    });
  }
}

export default connect<any, any, IParamProps>(null, null)(IncomingMessage);
