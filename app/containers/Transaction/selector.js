import { createSelector } from 'reselect';

const selectRouter = state => state.toJS().router;
const selectTransaction = state => state.toJS().transaction;

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState => routerState.location);

const makeSelectTransaction = () =>
  createSelector(selectTransaction, transaction => transaction);

const makeSelectTransactionDetail = () =>
  createSelector(
    selectTransaction,
    transaction => transaction.transactionDetails,
  );

export {
  makeSelectLocation,
  makeSelectTransaction,
  makeSelectTransactionDetail,
};
