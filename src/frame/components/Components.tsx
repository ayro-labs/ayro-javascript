import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Container from 'frame/components/Container';

import {Store} from 'frame/stores/Store';
import {Html} from 'utils/Html';

export class Components {

  public static async init(): Promise<void> {
    await Html.whenReady(document);
    const div = document.createElement('div');
    div.setAttribute('id', Components.ID_DIV);
    ReactDOM.render(
      <Provider store={Store.get()}>
        <Container/>
      </Provider>,
      div
    );
    document.body.appendChild(div);
  }

  private static readonly ID_DIV = 'ayro';

}
