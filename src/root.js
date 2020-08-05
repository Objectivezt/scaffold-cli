import React from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory as createHistory } from 'history';
import 'antd/dist/antd.less';
// import './styles/App.module.css';
import '@styles/index.module.less';

const App = ({ history }) => {
  const app = dva({
    history: history || createHistory(),
  });

  app.use(createLoading());

  // eslint-disable-next-line global-require
  app.model(require('./models/globalModel').default);

  // eslint-disable-next-line global-require
  app.router(require('./routerConfig').default);

  const DvaApp = app.start();

  return (
    <>
      <DvaApp />
    </>
  );
};

export default App;
