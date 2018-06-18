import * as React from 'react';

import {QuickReply} from 'frame/models/QuickReply';

interface OwnProps {
  quickReply: QuickReply;
  onButtonClick: (quickReply: QuickReply) => void;
}

class QuickReplyButton extends React.Component<OwnProps> {

  constructor(props: OwnProps) {
    super(props);
    this.executeClickCallback = this.executeClickCallback.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div onClick={this.executeClickCallback} className="quick-reply">
        {this.props.quickReply.title}
      </div>
    );
  }

  private executeClickCallback(): void {
    this.props.onButtonClick(this.props.quickReply);
  }
}

export default QuickReplyButton;
