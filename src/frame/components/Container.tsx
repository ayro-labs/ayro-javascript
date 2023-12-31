import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import debounce from 'lodash-es/debounce';

import ChatButton from 'frame/components/ChatButton';
import Chatbox from 'frame/components/Chatbox';
import UnreadMessage from 'frame/components/messages/UnreadMessage';

import {ChatMessage} from 'frame/models/ChatMessage';
import {StoreState} from 'frame/stores/Store';
import {Actions} from 'frame/stores/Actions';
import {Sounds} from 'frame/utils/Sounds';
import {ApplicationConstants} from 'utils/ApplicationConstants';

interface StateProps {
  showButton: boolean;
  showChat: boolean;
  lastUnread: ChatMessage;
}

interface DispatchProps {
  setLastUnread: (chatMessage: ChatMessage) => void;
}

interface OwnState {
  screenSize: string;
}

class Container extends React.Component<StateProps & DispatchProps, OwnState> {

  private static readonly SIZE_XS = 'xs';
  private static readonly SIZE_SM = 'sm';
  private static readonly SIZE_MD = 'md';
  private static readonly MAX_WIDTH_XS = 575;
  private static readonly MAX_WIDTH_SM = 767;

  private subscriptions: any[] = [];
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: StateProps & DispatchProps) {
    super(props);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.state = {screenSize: Container.SIZE_MD};
  }

  public componentDidMount(): void {
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
    window.parent.addEventListener('resize', debounce(this.onWindowResize, 200));
    this.onWindowResize();
  }

  public componentWillUnmount(): void {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render(): JSX.Element {
    return (
      <div id="container" className={this.containerClasses()} ref={this.containerRef}>
        <UnreadMessage/>
        <Chatbox/>
        <ChatButton/>
      </div>
    );
  }

  private containerClasses(): string {
    return `container-${this.state.screenSize}`;
  }

  private onWindowResize(): void {
    const width = window.parent.document.documentElement.clientWidth;
    if (width <= Container.MAX_WIDTH_XS) {
      this.setState({screenSize: Container.SIZE_XS});
    } else if (width <= Container.MAX_WIDTH_SM) {
      this.setState({screenSize: Container.SIZE_SM});
    } else {
      this.setState({screenSize: Container.SIZE_MD});
    }
  }

  private onChatMessageAdded(_type: string, action: AnyAction): void {
    const chatMessage: ChatMessage = action.extraProps.chatMessage;
    const expectedMessageType = chatMessage.direction === ChatMessage.DIRECTION_INCOMING && chatMessage.type === ChatMessage.TYPE_TEXT;
    if (expectedMessageType) {
      if (!this.props.showChat) {
        window.parent.postMessage({
          type: ApplicationConstants.EVENT_SIZE_CHANGED,
          size: ApplicationConstants.SIZE_UNREAD,
        }, '*');
        setTimeout(() => {
          this.props.setLastUnread(chatMessage);
        }, 100);
      }
      if (!this.props.showChat || !document.hasFocus()) {
        Sounds.playChatMessageSound();
      }
    }
  }
}

function mapStateToProps(state: StoreState): StateProps {
  return {
    showButton: state.showButton,
    showChat: state.showChat,
    lastUnread: state.lastUnread,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
  return bindActionCreators({
    setLastUnread: Actions.setLastUnread,
  }, dispatch);
}

export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Container);
