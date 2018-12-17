import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { LOGIN_API } from '../../utils/requestUrl';

import * as loginConstants from './constants';
// import * as loginActions from './actions';

export function* loginGenerator(payload) {
  const { loginId, password } = payload.payload;
  const data = {
    loginID: loginId,
    password,
  };
  try {
    const options = yield call(request, {
      ...LOGIN_API,
      data,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    yield put({
      type: loginConstants.LOGIN,
      payload: {
        profile: options.data,
      },
    });
  } catch (err) {
    // yield put(playersActions.fetchPlayersListFailure(err));
  }
}

export default function* defaultSaga() {
  yield takeLatest(loginConstants.LOGIN, loginGenerator);
}
