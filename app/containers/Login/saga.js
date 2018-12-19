import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import request from 'utils/request';
import { LOGIN_API } from '../../utils/requestUrl';

import * as loginConstants from './constants';

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
    if (options.data.success) {
      yield put({
        type: loginConstants.LOGINSUCCESS,
        payload: {
          code: 200,
          profile: options.data,
          error: null,
          success: true,
        },
      });
      yield put(push('/admin/dashboard'));
    }
    if (!options.data.success)
      yield put({
        type: loginConstants.LOGINSUCCESS,
        payload: {
          code: 305,
          profile: {},
          error: options.data.responseDesc,
          success: false,
        },
      });
  } catch (error) {
    // if (error && error.config) {
    //   console.log(error.response);
    // }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      yield put({
        type: loginConstants.LOGINSUCCESS,
        payload: {
          code: 305,
          profile: {},
          error: error.response.data,
          success: false,
        },
      });
      // console.log(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log("Error", error.message);
    }
    // console.log(error.config);
    yield put({
      type: loginConstants.LOGINSUCCESS,
      payload: {
        code: 404,
        profile: {},
        success: false,
      },
    });
  }
}

export default function* defaultSaga() {
  yield takeLatest(loginConstants.LOGIN, loginGenerator);
}
