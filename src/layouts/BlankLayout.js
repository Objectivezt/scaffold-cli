import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

export default class BlankLayout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };

  static defaultProps = {
    history: {},
  };

  componentDidMount() {
    this.props.history.push({
      pathname: '/auth',
    });
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 50,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}
