import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import Chatbox from 'components/Chatbox';

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

class Container extends React.Component<IStateProps & IDispatchProps, any> {

  public render() {
    return (
      <div id="ayro-container">
        <Chatbox/>
        <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.props.openChat}>
          <i className="fa fa-commenting"/>
        </button>
      </div>
    );
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
  return {
    openChat: () => {
      dispatch(Actions.openChat());
    },
  };
}

export default connect<IStateProps, IDispatchProps, any>(mapStateToProps, mapDispatchToProps)(Container);
