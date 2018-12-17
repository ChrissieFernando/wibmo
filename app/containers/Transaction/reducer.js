import * as actions from './constants';
const initialState = {
  transaction: [],
  lastFetched: '',
  error: null,
  empty: false,
  transactionDetails: {},
};
export default function logonReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_TRANSACTION_REPORT_SUCCESS:
      return {
        ...state,
        transaction: action.payload.data,
        error: null,
        empty: false,
        lastFetched: new Date(),
      };
    case actions.FETCH_TRANSACTION_REPORT_FAILURE:
      return {
        ...state,
        transaction: [],
        error: action.payload.error,
        empty: false,
        lastFetched: new Date(),
      };
    case actions.TRANSACTION_EMPTY:
      return {
        ...state,
        transaction: [],
        error: null,
        empty: true,
        lastFetched: new Date(),
      };
    case actions.FETCH_TRANSACTION_DETAIL_SUCCESS:
      return {
        ...state,
        transactionDetails: action.payload,
        lastFetched: new Date(),
      };
    case actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
