import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import Actions from '../stores/Actions';
import Classes from '../utils/Classes';

import Chatbox from './Chatbox';

interface IProperties {
  chatOpened: boolean;
  openChat: () => void;
}

class Container extends React.Component<IProperties, {}> {

  constructor(props: IProperties) {
    super(props);
    this.openChat = this.openChat.bind(this);
  }

  public render() {
    return (
      <div id="chatz-container">
        <Chatbox/>
        <button className={this.buttonClasses()} onClick={this.openChat}>
          <i className="fa fa-comments"/>
        </button>
      </div>
    );
  }

  private openChat(): void {
    this.props.openChat();
  }

  private buttonClasses(): string {
    return Classes.get({
      'chatz-button': true,
      'chatz-show': !this.props.chatOpened,
      'chatz-hide': this.props.chatOpened,
    });
  }
}

function mapStateToProps(state: any): any {
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
