import * as React from 'react';
import { Button } from 'antd';

const { Component, Fragment } = React;

interface Props {
  name: string;
  firstName?: string;
  lastName?: string;
}
interface State {
  count: number
}

export default class Hi extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  sum = () => {
    const { count } = this.state;
    this.setState({ count: count + 1 })
    return true;
  }

  render() {
    return (
      <Fragment>
        <p>你点击了 {this.state.count} 1111次</p>
        <Button onClick={() => this.sum()}>
          Hi {this.props.name}
        </Button>
      </Fragment>
    )
  }
}
