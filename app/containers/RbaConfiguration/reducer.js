import * as actions from './constants';
const initialState = {
  rba: null,
  lastFetched: '',
};
export default function logonReducer(state = initialState, action) {
  switch (action.type) {
    case actions.POST_RBA_CONFIGURATION_SUCCESS:
      return {
        ...state,
        rba: action.payload,
        lastFetched: new Date(),
      };
    case actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
