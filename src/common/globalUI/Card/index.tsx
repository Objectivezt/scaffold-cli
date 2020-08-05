
import * as React from 'react';
import { Card } from 'antd';

interface Props {
  title?: string,
  children?: React.ReactNode,
  extra?: React.ReactNode,
  height?: number,
  loading?: boolean,
  style?: object
}

export default class GlobalCard extends React.Component<Props>{
  render() {
    const { title, children, extra, height, loading = false } = this.props;
    const styles = {
      marginBottom: '20px',
      minHeight: '200px'
    };
    if (height) {
      styles.minHeight = `${height}px`;
    }
    return (
      <Card
        type='inner'
        hoverable={true}
        bordered={true}
        title={title}
        extra={extra}
        style={styles}
        loading={loading}
        {...this.props}
      >
        {children}
      </Card>
    );
  }
}
