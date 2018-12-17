import * as Actions from './constants';

export const login = payload => ({
  type: Actions.LOGIN,
  payload,
});

export const globals = payload => ({
  type: Actions.GLOBALS,
  payload,
});

export const logout = () => ({
  type: Actions.LOGOUT,
});
