/* eslint-disable eqeqeq */
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { RBA_API } from '../../utils/requestUrl';

import { POST_RBA_CONFIGURATION } from './constants';

import {
  fetchRbaConfigurationSuccess,
  fetchRbaConfigurationFailure,
} from './actions';

export function* fetchRbaConfiguration(payload) {
  const data = payload.payload;
  try {
    const res = yield call(request, { ...RBA_API, data });
    if (res.data['Response-Code'] == '200')
      yield put(fetchRbaConfigurationSuccess(res.data));
    else
      fetchRbaConfigurationFailure({
        message: 'Successfully Updated',
        error: res.data.Result,
      });
  } catch (err) {
    yield put(
      fetchRbaConfigurationFailure({
        error: 'Internal Server Error',
      }),
    );
  }
}

export default function* defaultSaga() {
  yield takeLatest(POST_RBA_CONFIGURATION, fetchRbaConfiguration);
}
