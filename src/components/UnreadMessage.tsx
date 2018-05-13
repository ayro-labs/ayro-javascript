import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

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

class UnreadMessage extends React.Component<StateProps & DispatchProps> {

  public render() {
    if (!this.props.lastUnread) {
      return null;
    }
    return (
      <div key={this.props.lastUnread.id} className="ayro-message-unread">
        <div className="ayro-balloon">
          <div className="ayro-agent-photo">
            <img src={this.props.lastUnread.agent.photo_url}/>
          </div>
          <div className="ayro-message">
            <svg onClick={this.props.clearUnreads} className="ayro-close-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
            </svg>
            <div className="ayro-agent-name">
              {this.props.lastUnread.agent.name}
            </div>
            <div className="ayro-text">
              <span>{this.props.lastUnread.text}</span>
            </div>
            <div className="ayro-status">
              <span className="ayro-status-time">
                {AppUtils.formatMessageTime(this.props.lastUnread)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
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

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(UnreadMessage);
