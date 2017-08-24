import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import Chatbox from 'components/Chatbox';

import {Integration} from 'models/Integration';
import {Actions, IAction} from 'stores/Actions';
import {IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IProperties {
  integration: Integration;
  chatOpened: boolean;
  openChat: () => void;
}

class Container extends React.Component<IProperties, {}> {

  public render() {
    return (
      <div id="chatz-container">
        <Chatbox/>
        <button className={this.buttonClasses()} style={this.buttonStyles()} onClick={this.props.openChat}>
          <i className="fa fa-comments"/>
        </button>
      </div>
    );
  }

  private buttonClasses(): string {
    return Classes.get({
      'chatz-button': true,
      'chatz-show': !this.props.chatOpened,
      'chatz-hide': this.props.chatOpened,
    });
  }

  private buttonStyles(): any {
    return {
      backgroundColor: this.props.integration.configuration.primary_color,
    };
  }
}

function mapStateToProps(state: IStoreState): any {
  return {
    integration: state.integration,
    chatOpened: state.chatOpened,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>): any {
  return {
    openChat: () => {
      dispatch(Actions.openChat());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
