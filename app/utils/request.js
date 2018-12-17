/* eslint import/no-unresolved: 1 */
/* eslint import/extensions: 1 */
import axios from 'axios';
// import promise from 'promise';
import { toast } from 'react-toastify';

const request = axios;
// request.defaults.timeout = 10000;
// request.defaults.withCredential   s = true;
// request.interceptors.request.use(
//   config => {
//     if (!config.baseURL) {
//       request.defaults.baseURL = BASE_URL;
//       config.baseURL = BASE_URL; // eslint-disable-line no-param-reassign
//     }
//     return config;
//   },
//   error => promise.reject(error),
// );

request.interceptors.response.use(undefined, error => {
  if (error && error.message === 'Network Error') {
    toast.error(
      'We are facing some technical issues please try after some time',
      {
        autoClose: 10 * 5000,
      },
    );
  }
  return Promise.reject(error);
});

export default request;
