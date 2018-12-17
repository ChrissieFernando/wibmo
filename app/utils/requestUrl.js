/**
 * @summary Base Urls
 */
import {
  UAT_DSDEMO_URL_BASE,
  UAT_ACSDEMO_URL_BASE,
  SAS_ADMIN_URL_BASE,
} from './config';

export const LOGIN_API = {
  url: `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/login`,
  method: 'post',
};

export const TRANSACTION_REPORT_API = {
  url: `${UAT_DSDEMO_URL_BASE}/admin/report/v1/fetchACSTXNDetails`,
  method: 'POST',
};

export const TRANSACTION_DETAIL_API = {
  url: `${SAS_ADMIN_URL_BASE}/v1/detailed-transaction-Data/fetchRreqRresByTxnId`,
  method: 'POST',
};

export const TRANSACTION_API = `${UAT_DSDEMO_URL_BASE}/admin/report/v1/fetchACSTXNDetails`;
export const AREQ_API = `${UAT_ACSDEMO_URL_BASE}/admin/report/v1/fetchAreqAresByTxnId`;
export const CREQ_API = `${UAT_ACSDEMO_URL_BASE}/admin/report/v1/fetchCreqCresByTxnId`;
export const RREQ_API = `${UAT_ACSDEMO_URL_BASE}/admin/report/v1/fetchRreqRresByTxnId`;
export const BANK_LIST_API = `${UAT_ACSDEMO_URL_BASE}/admin/report/v1/fetch_bank_list`;

export const RBA_CONFIG = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/report/v1/issuer_config/${id}/RBA/DEFAULT`;

export const RBA_API = `${SAS_ADMIN_URL_BASE}/admin/report/v1/update-rba-script/doUpdateRBAScript`;

export const GET_BANK_PRODUCTS = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/banks/${id}/products`;

export const GET_BANK_SCREENS = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/banks/${id}/screens`;

export const ASSIGN_GROUP_USERS_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/groups/${id}/assigngroupusers`;

export const EDIT_ASSIGN_GROUP_USERS_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/groups/${id}/assigngroupusers`;

export const ASSIGN_SCREENS_BANK_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/${id}/assignScreensToBank`;

export const EDIT_ASSIGN_SCREENS_BANK_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/${id}/assignScreensToBank`;

export const CREATE_USER_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/admin/users/${id}/createbankuser`;

export const EDIT_USER_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/admin/users/${id}/update`;

export const BANK_CREATE_URL = `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/createBank`;

export const BANK_EDIT_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/${id}/updateBank`;

export const CREATE_GROUP_URL = `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/groups/creategroup`;

export const EDIT_GROUP_URL = id =>
  `${UAT_ACSDEMO_URL_BASE}/admin/uam/v1/groups/${id}/updategroup`;
