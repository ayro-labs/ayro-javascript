import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Container from 'components/Container';

import {Store} from 'stores/Store';
import {Html} from 'utils/Html';

export class Components {

  public static async init(): Promise<void> {
    await Html.whenReady();
    const div = document.createElement('div');
    div.setAttribute('id', 'ayro');
    ReactDOM.render(
      <Provider store={Store.get()}>
        <Container/>
      </Provider>,
      div
    );
    document.body.appendChild(div);
  }
}
