/* eslint-disable */
export default function getQueryVariable(querystring) {
  var params = {};
  var pair;
  var d = decodeURIComponent;
  querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');
    if (d(pair[0])) params[d(pair[0])] = d(pair[1]);
  }
  return params;
}
