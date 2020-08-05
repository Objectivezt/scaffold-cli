/* eslint-disable func-names */
import React, { Component, Fragment } from 'react';
import Login from '@components/Login';
import { JSEncrypt } from 'jsencrypt';
import { Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.module.less';

const { Tab, UserName, Password, Submit } = Login;
const CaptchaCode = UserName;
const publicKeyHead = '-----BEGIN PUBLIC KEY-----';
const publicKeyFooter = '-----END PUBLIC KEY-----';

@connect(({ loginModel, loading }) => ({
  loginModel,
  logining: loading.effects['loginModel/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    // this.getPublicKey();
  }

  onTabChange = type => {
    this.setState({ type });
  };

  getPublicKey = () => {
    this.props.dispatch({
      type: 'loginModel/getPublicKey',
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeCaptcha = () => {
    const { loginModel } = this.props;
    const { requestId } = loginModel;
    this.props.dispatch({
      type: 'loginModel/changeCaptcha',
      payloadRequestId: {
        requestId,
      },
    });
  };

  renderLoginFooter = () => {
    const forgetPwd = function() {};
    const changePwd = function() {};
    const getHelp = function() {};
    const forgetAccount = function() {};
    return (
      <Fragment>
        <Row>
          <Col span={12}>
            <span
              className={`${styles.black} ${styles.left} ${styles.point}`}
              onClick={e => forgetPwd(e)}
            >
              <Icon type="key" className={styles.iconRight} />
              忘记密码
            </span>
          </Col>
          <Col span={12}>
            <span
              className={`${styles.black} ${styles.left} ${styles.point}`}
              onClick={e => changePwd(e)}
            >
              <Icon type="tool" className={styles.iconRight} />
              修改密码
            </span>
          </Col>
          <Col span={12}>
            <span
              className={`${styles.black} ${styles.left} ${styles.point}`}
              onClick={e => getHelp(e)}
            >
              <Icon type="user" className={styles.iconRight} />
              忘记账号
            </span>
          </Col>
          <Col span={12}>
            <span
              className={`${styles.black} ${styles.left} ${styles.point}`}
              onClick={e => forgetAccount(e)}
            >
              <Icon type="hdd" className={styles.iconRight} />
              自助服务
            </span>
          </Col>
        </Row>
      </Fragment>
    );
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { loginModel, dispatch } = this.props;
    const { requestId, loginKey, validCode = '' } = loginModel;
    if (err) {
      return false;
    }
    if (this.state.type === 'account') {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKeyHead + loginKey + publicKeyFooter);
      const encryptPwd = encrypt.encrypt(values.password);
      const tempPayload = {
        userName: values.userName ? values.userName.replace(/\s+/g, '') : null,
        password: encryptPwd,
      };
      if (requestId) {
        tempPayload.requestId = requestId;
      }
      if (validCode) {
        tempPayload.validCode = values.captchaCode;
      }
      dispatch({
        type: 'loginModel/login',
        payloadLogin: tempPayload,
      });
    }
    return true;
  };

  render() {
    const { type } = this.state;
    const { logining, loginModel } = this.props;
    const { validCode = '' } = loginModel;
    const changeCap = (
      <img
        alt="img"
        src={validCode}
        onClick={() => this.changeCaptcha()}
        style={{
          width: '105px',
          height: '40px',
        }}
      />
    );
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab={<span>登录123123</span>}>
            <UserName name="userName" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
            {validCode ? (
              <Row>
                <Col span={16}>
                  <CaptchaCode
                    name="captchaCode"
                    placeholder="验证码"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码',
                      },
                    ]}
                  />
                </Col>
                <Col span={8}>{changeCap}</Col>
              </Row>
            ) : null}
            {this.renderLoginFooter()}
          </Tab>
          <Fragment>
            <Submit loading={logining}>登录</Submit>
          </Fragment>
        </Login>
      </div>
    );
  }
}
