'use strict';

import * as React from 'react';

interface HelloWorldProps {
  name: string;
}

class HelloWorld extends React.Component<HelloWorldProps, {}> {
  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}

export default HelloWorld;