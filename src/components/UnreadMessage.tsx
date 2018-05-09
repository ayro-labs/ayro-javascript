import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as classNames from 'classnames';

import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {StoreState} from 'stores/Store';
import {AppUtils} from 'utils/AppUtils';

interface StateProps {
  lastUnread: ChatMessage;
}

interface DispatchProps {
  clearUnreads: () => void;
}

class UnreadMessage extends React.Component<StateProps & DispatchProps, {}> {

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.renderCloseButton = this.renderCloseButton.bind(this);
  }

  public render() {
    if (!this.props.lastUnread) {
      return null;
    }
    return (
      <div key={this.props.lastUnread.id} className={this.messageClasses()}>
        <div className="ayro-message">
          {this.renderAuthorPhoto()}
          <div>
            {this.renderAuthorName()}
            <div className="ayro-message-text">
              <span>{this.props.lastUnread.text}</span>
            </div>
            <div className="ayro-message-status">
              <span className="ayro-message-time">
                {AppUtils.formatMessageTime(this.props.lastUnread)}
              </span>
            </div>
          </div>
        </div>
        <div className="ayro-clear"/>
      </div>
    );
  }

  private renderAuthorPhoto() {
    return (
      <div className="ayro-agent-photo">
        <img src={this.props.lastUnread.agent.photo_url}/>
      </div>
    );
  }

  private renderAuthorName() {
    return (
      <div className="ayro-agent-name">
        {this.props.lastUnread.agent.name}
        {this.renderCloseButton()}
      </div>
    );
  }

  private renderCloseButton() {
    return (
      <svg onClick={this.props.clearUnreads} className="ayro-icon-close" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
      </svg>
    );
  }

  private messageClasses(): string {
    return classNames({
      'ayro-message-unread': true,
    });
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    lastUnread: state.lastUnread,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    clearUnreads: Actions.clearUnreads,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, any, StoreState>(mapStateToProps, mapDispatchToProps)(UnreadMessage);
