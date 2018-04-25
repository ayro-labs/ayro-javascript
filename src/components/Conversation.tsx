import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';

import IncomingMessage from 'components/IncomingMessage';
import OutgoingMessage from 'components/OutgoingMessage';

import {AyroService} from 'services/AyroService';
import {UserStatus} from 'enums/UserStatus';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';
import {IStoreState} from 'stores/Store';

interface IStateProps {
  userStatus: UserStatus;
  user: User;
  apiToken: string;
  chatMessages: ChatMessage[];
}

interface IDispatchProps {
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

class Conversation extends React.Component<IStateProps & IDispatchProps, any> {

  private subscriptions: any[] = [];
  private conversationElement: HTMLDivElement;

  constructor(props: IStateProps & IDispatchProps) {
    super(props);
    this.setConversationElement = this.setConversationElement.bind(this);
    this.onChatOpened = this.onChatOpened.bind(this);
    this.onChatMessageAdded = this.onChatMessageAdded.bind(this);
  }

  public componentDidMount() {
    this.subscriptions.push(PubSub.subscribe(Actions.OPEN_CHAT, this.onChatOpened));
    this.subscriptions.push(PubSub.subscribe(Actions.ADD_CHAT_MESSAGE, this.onChatMessageAdded));
  }

  public componentWillUnmount() {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  public render() {
    const messages = this.props.chatMessages.map((chatMessage, index) => {
      const previousChatMessage = this.props.chatMessages[index - 1];
      const continuation = previousChatMessage && previousChatMessage.agent.id === chatMessage.agent.id;
      if (chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
        return <IncomingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
      }
      return <OutgoingMessage key={chatMessage.id} chatMessage={chatMessage} continuation={continuation}/>;
    });
    return (
      <div className="ayro-chatbox-conversation" ref={this.setConversationElement}>
        <div className="ayro-messages">
          {messages}
        </div>
      </div>
    );
  }

  private setConversationElement(div: HTMLDivElement) {
    this.conversationElement = div;
  }

  private onChatOpened() {
    this.loadMessages();
  }

  private onChatMessageAdded() {
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
  }

  private async loadMessages(): Promise<void> {
    const chatMessages = await AyroService.listMessages(this.props.apiToken);
    this.props.setChatMessages(chatMessages);
    this.conversationElement.scrollTop = this.conversationElement.scrollHeight;
  }
}

function mapStateToProps(state: IStoreState): IStateProps {
  return {
    userStatus: state.userStatus,
    user: state.user,
    apiToken: state.apiToken,
    chatMessages: state.chatMessages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>): IDispatchProps {
  return bindActionCreators({
    setChatMessages: Actions.setChatMessages,
  }, dispatch);
}

export default connect<IStateProps, IDispatchProps, any, IStoreState>(mapStateToProps, mapDispatchToProps)(Conversation);
