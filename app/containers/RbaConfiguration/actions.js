import {
  POST_RBA_CONFIGURATION,
  POST_RBA_CONFIGURATION_SUCCESS,
  POST_RBA_CONFIGURATION_FAILURE,
} from './constants';

export const fetchRbaConfiguration = payload => ({
  type: POST_RBA_CONFIGURATION,
  payload,
});

export const fetchRbaConfigurationSuccess = payload => ({
  type: POST_RBA_CONFIGURATION_SUCCESS,
  payload,
});

export const fetchRbaConfigurationFailure = payload => ({
  type: POST_RBA_CONFIGURATION_FAILURE,
  payload,
});
