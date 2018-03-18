import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {Integration} from 'models/Integration';
import {Actions, IAction} from 'stores/Actions';
import {IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IStateProps {
  integration: Integration;
  chatOpened: boolean;
}

interface IDispatchProps {
  openChat: () => void;
}

class ChatButton extends React.Component<IStateProps & IDispatchProps, {}> {

  constructor(props: IStateProps & IDispatchProps) {
    super(props);
    this.openChat = this.openChat.bind(this);
  }

  public render() {
    return (
      <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.props.openChat}>
        <i className="ayro-fas ayro-fa-comment-alt"></i>
      </button>
    );
  }

  private openChat() {
    this.props.openChat();
  }

  private buttonClasses(): string {
    return Classes.get({
      'ayro-button': true,
      'ayro-show': !this.props.chatOpened,
      'ayro-hide': this.props.chatOpened,
    });
  }

  private buttonStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    integration: state.integration,
    chatOpened: state.chatOpened,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>): IDispatchProps {
  return bindActionCreators({
    openChat: Actions.openChat,
  }, dispatch);
}

export default connect<IStateProps, IDispatchProps, any>(mapStateToProps, mapDispatchToProps)(ChatButton);