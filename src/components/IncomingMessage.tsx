import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {Classes} from 'utils/Classes';

interface IParamProps {
  chatMessage: ChatMessage;
  continuation?: boolean;
  unreadStyle?: boolean;
}

interface IDispatchProps {
  clearUnreads: () => void;
}

class IncomingMessage extends React.Component<IParamProps & IDispatchProps, any> {

  constructor(props: IDispatchProps & IParamProps) {
    super(props);
    this.renderCloseButton = this.renderCloseButton.bind(this);
  }

  public render() {
    if (this.props.chatMessage) {
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
    return null;
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
          {this.renderCloseButton()}
        </div>
      );
    }
    return null;
  }

  private renderCloseButton() {
    if (this.props.unreadStyle) {
      return (
        <svg onClick={this.props.clearUnreads} className="ayro-icon-close" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
        </svg>
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
      'ayro-message-discontinuation': this.props.continuation === false,
    });
  }
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): IDispatchProps {
  return bindActionCreators({
    clearUnreads: Actions.clearUnreads,
  }, dispatch);
}

export default connect<any, IDispatchProps, IParamProps>(null, mapDispatchToProps)(IncomingMessage);
