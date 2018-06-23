import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import truncate from 'lodash-es/truncate';

import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {AppUtils} from 'frame/utils/AppUtils';
import {ApplicationConstants} from 'utils/ApplicationConstants';

interface StateProps {
  lastUnread: ChatMessage;
}

interface DispatchProps {
  unsetLastUnread: () => void;
}

class UnreadMessage extends React.Component<StateProps & DispatchProps> {

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.closeUnreadMessage = this.closeUnreadMessage.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.lastUnread) {
      return null;
    }
    return (
      <div key={this.props.lastUnread.id} className="message unread">
        <div className="balloon">
          <div className="agent-photo">
            <img src={this.props.lastUnread.agent.photo_url}/>
          </div>
          <div className="content">
            <svg onClick={this.closeUnreadMessage} className="close-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
            </svg>
            <div className="agent-name">
              {this.props.lastUnread.agent.name}
            </div>
            <div className="text">
              <span>{this.getTruncatedText()}</span>
            </div>
            <div className="status">
              <span className="time">
                {AppUtils.formatMessageTime(this.props.lastUnread)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getTruncatedText(): string {
    return truncate(this.props.lastUnread.text, {
      length: 100,
      separator: ' ',
      omission: '...',
    });
  }

  private closeUnreadMessage(): void {
    this.props.unsetLastUnread();
    window.parent.postMessage({
      type: ApplicationConstants.EVENT_SIZE_CHANGED,
      size: ApplicationConstants.SIZE_BUTTON,
    }, '*');
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    lastUnread: state.lastUnread,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    unsetLastUnread: Actions.unsetLastUnread,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(UnreadMessage);
