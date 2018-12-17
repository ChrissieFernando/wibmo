import * as actions from './constants';
const sideMenu = [];
sideMenu[50] = true;
const initialState = {
  profile: {},
  code: null,
  lastFetched: '',
  success: false,
  globals: {
    bank_name: 'Select a bank',
    bank_id: '',
    menu: false,
    rbaglobals: {
      lastFetched: '',
    },
    sideMenu,
    sidebar: null,
    subMenu: [],
    showSidebar: false,
    sideBar: false,
    error: null,
    date: {},
  },
};
export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN:
      return {
        ...state,
        profile: action.payload.profile,
        code: action.payload.code,
        lastFetched: new Date(),
        error: action.payload.error,
        success: action.payload.success,
      };
    case actions.GLOBALS:
      return {
        ...state,
        lastFetched: new Date(),
        globals: { ...state.globals, ...action.payload },
      };
    case actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
