/* eslint-disable eqeqeq */

import {
  FETCH_TRANSACTION_REPORT,
  FETCH_TRANSACTION_REPORT_SUCCESS,
  FETCH_TRANSACTION_REPORT_FAILURE,
  FETCH_TRANSACTION_DETAIL,
  FETCH_TRANSACTION_DETAIL_SUCCESS,
  FETCH_TRANSACTION_DETAIL_FAILURE,
  TRANSACTION_EMPTY,
} from './constants';

export const fetchTransactionReport = payload => ({
  type: FETCH_TRANSACTION_REPORT,
  payload,
});
export const fetchTransactionReportFailure = payload => ({
  type: FETCH_TRANSACTION_REPORT_FAILURE,
  payload,
});
export const fetchTransactionReportSuccess = payload => ({
  type: FETCH_TRANSACTION_REPORT_SUCCESS,
  payload,
});
export const fetchTransactionDetail = payload => ({
  type: FETCH_TRANSACTION_DETAIL,
  payload,
});
export const fetchTransactionDetailFailure = payload => ({
  type: FETCH_TRANSACTION_DETAIL_FAILURE,
  payload,
});
export const fetchTransactionDetailSuccess = payload => ({
  type: FETCH_TRANSACTION_DETAIL_SUCCESS,
  payload,
});
export const transactionEmpty = () => ({
  type: TRANSACTION_EMPTY,
  payload: {},
});
