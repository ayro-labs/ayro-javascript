import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Container from 'components/Container';
import Store from 'stores/Store';
import Html from 'utils/Html';

export default class Components {

  public static init() {
    Html.whenReady().then(() => {
      const chatzDiv = document.createElement('div');
      chatzDiv.setAttribute('id', 'chatz');
      ReactDOM.render(
        <Provider store={Store.get()}>
          <Container/>
        </Provider>,
        chatzDiv
      );
      document.body.appendChild(chatzDiv);
    });
  }
}
