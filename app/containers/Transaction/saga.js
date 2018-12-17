/* eslint-disable eqeqeq */
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  TRANSACTION_REPORT_API,
  TRANSACTION_DETAIL_API,
} from '../../utils/requestUrl';
import {
  FETCH_TRANSACTION_REPORT,
  FETCH_TRANSACTION_DETAIL,
} from './constants';
import {
  fetchTransactionReportSuccess,
  fetchTransactionReportFailure,
  fetchTransactionDetailSuccess,
  fetchTransactionDetailFailure,
} from './actions';

export function* transactionReportGenerator(payload) {
  const data = JSON.stringify(payload);
  try {
    const res = yield call(request, { ...TRANSACTION_REPORT_API, data });
    if (
      res.data['Response-Code'] == '200' &&
      typeof res.data.Result !== 'string'
    )
      yield put(
        fetchTransactionReportSuccess({
          data: res.data.Result,
        }),
      );
    yield put(
      fetchTransactionReportFailure({
        error: res.data.Result,
      }),
    );
  } catch (err) {
    yield put(
      fetchTransactionReportFailure({
        error: 'Internal Server Error',
      }),
    );
  }
}
export function* transactionDetailGenerator(payload) {
  const data = JSON.stringify(payload);
  try {
    const res = yield call(request, { ...TRANSACTION_DETAIL_API, data });
    if (
      res.data['Response-Code'] == '200' &&
      typeof res.data.Result !== 'string'
    )
      yield put(fetchTransactionDetailSuccess(res.data.Result));
    // yield put(fetchTransactionDetailFailure(res.data.Result));
  } catch (err) {
    yield put(
      fetchTransactionDetailFailure({
        error: 'Internal Server Error',
      }),
    );
  }
}

export default function* defaultSaga() {
  yield takeLatest(FETCH_TRANSACTION_REPORT, transactionReportGenerator);
  yield takeLatest(FETCH_TRANSACTION_DETAIL, transactionDetailGenerator);
}
