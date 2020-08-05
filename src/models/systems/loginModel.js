import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  login,
  queryPublicKey,
  queryCaptchaImage
} from '@services/systems/loginService';

export default {
  namespace: 'loginModel',
  state: {
    status: false,
    validCode: '',
    requestId: '',
    loginKey: '',
    forgetUrl: '',
    changeUrl: '',
    helpUrl: '',
    forgetAccountUrl: ''
  },
  effects: {
    *getPublicKey(_, { call, put }) {
      const res = yield call(queryPublicKey);
      if (res) {
        const { code, data, msg } = res;
        if (code === '0000') {
          yield put({
            type: 'savaKey',
            payloadPublicKey: {
              loginKey: data.publicKey,
              forgetUrl: data.forgetUrl,
              changeUrl: data.changeUrl,
              helpUrl: data.helpUrl,
              forgetAccountUrl: data.forgetAccountUrl
            }
          });
        } else {
          message.error(msg);
        }
      }
    },
    *login({ payloadLogin }, { call, put }) {
      const res = yield call(login, payloadLogin);
      if (res) {
        const { code, data, msg } = res;
        if (code === '0000') {
          yield put({
            type: 'saveLogin',
            payloadLogin: {
              status: true
            }
          });
          yield put(routerRedux.push('/auth/app'));
        } else {
          yield put({
            type: 'saveLogin',
            payloadLogin: {
              validCode: data.validCode,
              requestId: data.requestId
            }
          });
          message.error(msg);
        }
      }
    },
    *changeCaptchaImage(_, { call, put }) {
      const res = yield call(queryCaptchaImage);
      if (res) {
        const { code, data, msg } = res;
        if (code === '0000') {
          yield put({
            type: 'saveImage',
            payloadImage: {
              validCode: data.validCode,
              requestId: data.requestId
            }
          });
        } else {
          message.error(msg);
        }
      }
    }
  },
  reducers: {
    savaKey(state, { payloadPublicKey }) {
      return {
        ...state,
        ...payloadPublicKey
      };
    },
    saveLogin(state, { payloadLogin }) {
      return {
        ...state,
        ...payloadLogin
      };
    },
    changeCaptchaImage(state, { payloadImage }) {
      return {
        ...state,
        ...payloadImage
      };
    }
  }
};
