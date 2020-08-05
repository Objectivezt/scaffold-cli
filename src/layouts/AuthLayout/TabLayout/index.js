import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, message, Menu, Dropdown } from 'antd';
import { isInArray } from '@utils/utils';
import { routerRedux } from 'dva/router';
import { CreateMenuItem } from '@utils/utils.stateless';
import styles from './index.module.less';

const { TabPane } = Tabs;

export default class TabLayout extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    name: PropTypes.string,
    keys: PropTypes.string,
    component: PropTypes.any,
    location: PropTypes.object,
    whiteRouter: PropTypes.array,
    noPermission: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
  };

  static defaultProps = {
    history: {},
    name: '',
    keys: '',
    component: <div>loading</div>,
    location: {},
    whiteRouter: [],
    noPermission: {},
    dispatch: () => {},
    match: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      panes: [],
      tabMenuData: [
        {
          name: '关闭当前',
          iconType: 'close',
          key: 'close',
        },
        {
          name: '关闭其他',
          iconType: 'close-circle',
          key: 'closeOther',
        },
        // {
        //   name: '刷新页面',
        //   iconType: 'reload',
        //   key: 'reload'
        // },
        // {
        //   name: '收藏页面',
        //   iconType: 'star',
        //   key: 'star'
        // }
      ],
    };
  }

  componentWillMount() {
    const { name, keys, component } = this.props;
    if (keys === '/' || !name) {
      return;
    }
    const { panes } = this.state;
    const activeKey = keys;
    panes.push({ name, key: activeKey, component });
    this.setState({ panes, activeKey });
  }

  componentWillReceiveProps(nextProps) {
    const { location, whiteRouter, noPermission, name, keys, component } = nextProps;
    if (!isInArray(whiteRouter, location.pathname)) {
      // eslint-disable-next-line no-shadow
      const { keys = '/auth/exception/403', component } = noPermission;
      // eslint-disable-next-line react/no-access-state-in-setstate
      const { panes } = this.state;
      if (panes.length > 0) {
        panes[panes.length - 1].component = component;
        panes[panes.length - 1].name = name;
        panes[panes.length - 1].key = keys;
      }
      this.setState({ panes, activeKey: keys });
      return;
    }
    if (keys === '/' || !name) {
      return;
    }
    const { panes } = this.state;
    const activeKey = keys;
    let isExist = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < panes.length; i++) {
      if (panes[i].key === activeKey) {
        isExist = true;
        break;
      }
    }

    if (isExist) {
      this.setState({
        activeKey,
      });
    } else {
      panes.push({ name, key: activeKey, component });
      this.setState({ panes, activeKey });
    }
  }

  onChange = activeKey => {
    this.props.dispatch(
      routerRedux.push({
        pathname: activeKey,
      }),
    );
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  // 关闭当前窗口
  remove = targetKey => {
    if (this.state.panes.length === 1) {
      message.warning('窗口不能全部关闭');
      return;
    }
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    // eslint-disable-next-line react/no-access-state-in-setstate
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  };

  // 关闭其他窗口
  removeOther = targetKey => {
    if (this.state.panes.length === 1) {
      message.warning('窗口不能全部关闭');
      return;
    }
    // eslint-disable-next-line react/no-access-state-in-setstate
    const panes = this.state.panes.filter(pane => pane.key === targetKey);
    this.setState({ panes });
  };

  onMenuClick = ({ key }, pathname) => {
    if (key === 'close') {
      this.remove(pathname);
    } else if (key === 'closeOther') {
      this.removeOther(pathname);
    }
  };

  render() {
    const { location, match, history } = this.props;
    const { panes, activeKey, tabMenuData } = this.state;
    const TabMenu = pathname => (
      <Menu className={styles.menu} onClick={item => this.onMenuClick(item, pathname)}>
        {tabMenuData.map(({ name, iconType, key }) => CreateMenuItem(name, key, iconType))}
      </Menu>
    );

    const TabMenuDropDown = (name, pathname) => (
      <Dropdown overlay={TabMenu(pathname)}>
        <div
          className="ant-dropdown-link"
          style={{ width: '100%', height: '26px', textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {name}
        </div>
      </Dropdown>
    );

    return (
      <Tabs
        activeKey={activeKey}
        hideAdd
        style={{ marginTop: 20 }}
        onChange={this.onChange}
        onEdit={this.onEdit}
        type="editable-card"
      >
        {panes.map(({ name, key, component: Pane }) => (
          <TabPane tab={TabMenuDropDown(name, key)} key={key} closable>
            <Pane
              history={history}
              location={location}
              match={match}
              onCloseCurrentTab={(pathname, action) => this.onEdit(pathname, action)}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
