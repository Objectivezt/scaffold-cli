import * as React from 'react';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import { ContainerQuery } from 'react-container-query';
import { Layout, Spin, Breadcrumb, message } from 'antd';
import { connect } from 'dva';
import { queryLayout, baseRouterUrl, projectName } from '@common/config';
import { Route, Switch, Redirect, Link } from 'dva/router';
import { isUrl, getRoutes, formatterMenu } from '@utils/utils';
import request from '@utils/request';
import logo from '@assets/favicon.ico';
import TabLayout from './TabLayout';
import GlobalHeader from './GlobalHeader';
import SliderMenu from './SliderMenu';
// import GlobalFooter from './GlobalFooter';
import styles from './index.module.less';

const { Fragment } = React;
const { Content } = Layout;
const redirectData = [];
const tempMenuArr = baseRouterUrl;
@connect(({ globalModel, userModel }) => ({
  collapsed: globalModel.collapsed,
  globalModel,
  userModel,
}))
class AuthLayout extends React.PureComponent {
  componentDidMount() {
    this.getMenuData();
    request('api/topics').then(({ success, data }) => {
      if (success) {
        message.info(`获取到cNode topics:${data.length}`);
      }
    });
  }

  getRedirect = item => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          this.getRedirect(children);
        });
      }
    }
  };

  getMenuData = () => {
    this.props
      .dispatch({
        type: 'userModel/getMenuData',
      })
      .then(() => {
        const { menuData } = this.props.userModel;
        this.getRouterWhiteList(menuData);
      });
  };

  getRouterWhiteList = (data, parentPath = '') =>
    // eslint-disable-next-line array-callback-return
    data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      if (item.children) {
        this.getRouterWhiteList(item.children, `${parentPath}${item.path}/`);
      }
      tempMenuArr.push(`/${path}`);
    });

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'globalModel/changeLayoutCollapsed',
      payloadCollapsed: collapsed,
    });
  };

  handleMultiPage = isMultiPage => {
    this.props.dispatch({
      type: 'globalModel/changeMultiPage',
      payloadMultiPage: isMultiPage,
    });
  };

  handleMenuClick = ({ key }) => {
    if (key === 'setting') {
      // this.handleDrawer(true);
    } else if (key === 'news') {
      // this.props.history.push({ pathname: '/tourist/' });
    }
  };

  render() {
    const {
      routerData,
      match,
      dispatch,
      location,
      userModel,
      globalModel,
      collapsed,
      history,
    } = this.props;
    const { isMultiPage } = globalModel;
    const { loadingLayoutMenu = true, menuData = [] } = userModel;
    const tasParams = {
      ...routerData[location.pathname],
      keys: location.pathname,
      location,
      dispatch,
      match,
      history,
      noPermission: routerData['/auth/exception/403'],
      whiteRouter: tempMenuArr,
    };
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <React.Fragment key={url}>
          {routerData[url] && routerData[url].hasOwnProperty('name') ? (
            <Breadcrumb.Item key={url}>
              <Link to={url}>{routerData[url].name}</Link>
            </Breadcrumb.Item>
          ) : null}
        </React.Fragment>
      );
    });
    const breadcrumbItems = [].concat(extraBreadcrumbItems);
    const layout = (
      <Layout>
        <GlobalHeader
          collapsed={collapsed}
          currentUser={{ name: projectName }}
          onCollapse={this.handleMenuCollapse}
          onMenuClick={this.handleMenuClick}
        />
        <Layout style={collapsed ? { marginLeft: 48 } : { marginLeft: 176 }}>
          <Content className={styles.context}>
            <SliderMenu
              collapsed={collapsed}
              location={location}
              logo={logo}
              menuData={formatterMenu(menuData)}
              onCollapse={this.handleMenuCollapse}
            />
            {isMultiPage ? (
              <TabLayout {...tasParams} />
            ) : (
              <Fragment>
                <Breadcrumb className={styles.breadcrumb}>{breadcrumbItems}</Breadcrumb>
                <Switch>
                  {redirectData.map(item => (
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  ))}
                  {getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      redirectPath="/auth/exception/403"
                    />
                  ))}
                  <Redirect exact from="/" to="/auth" />
                  <Redirect exact from="/auth" to="/auth/ts/page" />
                  {/* <Route render={NotFound} /> */}
                </Switch>
              </Fragment>
            )}
          </Content>
          {/* <GlobalFooter links={[]} copyright={null} /> */}
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={projectName}>
        <ContainerQuery query={queryLayout}>
          {params => (
            <div className={classNames(params)}>
              {loadingLayoutMenu ? (
                <div className={styles.loadingSpin}>
                  <Spin size="large" />
                </div>
              ) : (
                layout
              )}
            </div>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default AuthLayout;
