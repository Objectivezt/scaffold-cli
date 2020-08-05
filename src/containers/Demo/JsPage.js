import React from 'react';
import { Alert } from 'antd';
import Button from 'antd/es/button';
import { sum } from '@utils/utils';
import { greeter } from '@utils/utils.ts';
import styles from './index.less';

const user = { firstName: 'jack', lastName: 'kong' };

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: 123,
    };
  }

  render() {
    const { temp } = this.state;
    return (
      <div className={styles.main}>
        {sum(temp, 2) + 123 + greeter(user)}
        <Alert />
        <Button>button</Button>
      </div>
    );
  }
}
