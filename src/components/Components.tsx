import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Container from 'components/Container';

import {Store} from 'stores/Store';
import {Html} from 'utils/Html';

export class Components {

  public static init() {
    Html.whenReady().then(() => {
      const ayroDiv = document.createElement('div');
      ayroDiv.setAttribute('id', 'ayro');
      ReactDOM.render(
        <Provider store={Store.get()}>
          <Container/>
        </Provider>,
        ayroDiv
      );
      document.body.appendChild(ayroDiv);
    });
  }
}
