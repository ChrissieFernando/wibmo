import { createSelector } from 'reselect';

const selectRouter = state => state.toJS().router;
const selectLogin = state => state.toJS().login;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState && routerState.location,
  );

const makeSelectLogin = () => createSelector(selectLogin, login => login);
const makeSelectLoginProfile = () =>
  createSelector(selectLogin, login => login.profile);
const makeSelectGlobals = () =>
  createSelector(selectLogin, login => login.globals);
const makeSelectLoginStatus = () =>
  createSelector(selectLogin, login => login && login.success);

export {
  makeSelectLocation,
  makeSelectLogin,
  makeSelectLoginStatus,
  makeSelectLoginProfile,
  makeSelectGlobals,
};
