import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';

import {Integration} from 'frame/models/Integration';
import {Actions} from 'frame/stores/Actions';
import {StoreState} from 'frame/stores/Store';
import {ApplicationConstants} from 'utils/ApplicationConstants';

interface StateProps {
  showButton: boolean;
  integration: Integration;
}

interface DispatchProps {
  hideButton: () => void;
  showChat: () => void;
  unsetLastUnread: () => void;
}

class ChatButton extends React.Component<StateProps & DispatchProps> {

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.openChat = this.openChat.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.showButton) {
      return null;
    }
    return (
      <button onClick={this.openChat} className="main-button" style={this.buttonStyles()}>
        <svg className="button-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <path d="M280.9,70.5h-63.3c-99.4,0-180.2,81.4-179.2,181c1,98.7,82.8,177.5,181.5,177.5h230c5.7,0,10.3-4.6,10.3-10.3 v-169C460.2,150.7,379.9,70.5,280.9,70.5z M255.5,304H138.7c-7.2,0-13-5.8-13-13c0-7.2,5.8-13,13-13h116.8c7.2,0,13,5.8,13,13 C268.5,298.2,262.7,304,255.5,304z M389.3,255H138.9c-7.3,0-13.2-6.4-13.2-14.4c0-8,5.9-14.4,13.2-14.4h250.4 c7.3,0,13.2,6.4,13.2,14.4C402.5,248.5,396.6,255,389.3,255z"/>
        </svg>
      </button>
    );
  }

  private buttonStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }

  private openChat(): void {
    this.props.unsetLastUnread();
    this.props.hideButton();
    window.parent.postMessage({
      type: ApplicationConstants.EVENT_SIZE_CHANGED,
      size: ApplicationConstants.SIZE_BOX,
    }, '*');
    setTimeout(() => {
      this.props.showChat();
    }, 100);
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    showButton: state.showButton,
    integration: state.integration,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    hideButton: Actions.hideButton,
    showChat: Actions.showChat,
    unsetLastUnread: Actions.unsetLastUnread,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(ChatButton);
