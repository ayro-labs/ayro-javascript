import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import Chatbox from 'components/Chatbox';

import {Actions} from 'stores/Actions';
import {IState as IStoreState} from 'stores/Store';
import {Classes} from 'utils/Classes';

interface IProperties {
  chatOpened: boolean;
  openChat: () => void;
}

class Container extends React.Component<IProperties, {}> {

  public render() {
    return (
      <div id="chatz-container">
        <Chatbox/>
        <button className={this.buttonClasses()} onClick={this.props.openChat}>
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
}

function mapStateToProps(state: IStoreState): any {
  return {
    chatOpened: state.chatOpened,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    openChat: () => {
      dispatch(Actions.openChat());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
