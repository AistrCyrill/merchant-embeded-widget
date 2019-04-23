import qs from 'qs'

/**
 * @param {String} obj The Object of config, to parse queiry
 * 
 */
export const stringify = obj => {
  const stringifyedQS = qs.stringify(obj, { skipNulls: true });
  return stringifyedQS;
};

/**
 * Takes a URL and returns the origin
 * @param  {String} url The full URL being requested
 * @return {String}     The URLs origin
 */
export const resolveOrigin = (url) => {
  const a = document.createElement('a')
  a.href = url
  const protocol = a.protocol.length > 4 ? a.protocol : window.location.protocol
  const host = a.host.length ? ((a.port === '80' || a.port === '443') ? a.hostname : a.host) : window.location.host
  return a.origin || `${protocol}//${host}`
}

