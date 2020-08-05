import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { ConfigProvider, Spin } from 'antd';
import { getRouterData } from '@common/router';
import dynamic from 'dva/dynamic';
import zhCN from 'antd/es/locale/zh_CN';
import styles from '@styles/index.module.less';
import NoFound from './containers/Exception/404';

dynamic.setDefaultLoadingComponent(() => <Spin size="large" className={styles.globalSpin} />);

export default params => {
  const { history, app } = params;
  const routerData = getRouterData(app);
  const AuthLayout = routerData['/auth'].component;
  const UserLayout = routerData['/user'].component;

  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} />} strict />
          <Route path="/auth" render={props => <AuthLayout {...props} />} strict />
          <Redirect from="/" to="/auth/app" />
          <Route render={() => <NoFound />} />
        </Switch>
      </Router>
    </ConfigProvider>
  );
};
