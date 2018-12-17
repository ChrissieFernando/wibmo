import { createSelector } from 'reselect';

const selectRouter = state => state.toJS().router;
const selectTransaction = state => state.toJS().rbaConfiguration;

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState => routerState.location);

const makeSelectRbaConfiguration = () =>
  createSelector(selectTransaction, rbaConfiguration => rbaConfiguration);

export { makeSelectLocation, makeSelectRbaConfiguration };
