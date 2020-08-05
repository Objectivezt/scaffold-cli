import request from '@utils/request';

export function queryMenus() {
  return request('user/queryCurrentMenus');
}

export function queryCurrentUser() {
  return request('user/queryCurrentUser');
}

export function queryUserList() {
  return request('user/queryUserList');
}
