import {DOMParser} from "xmldom";
var domParser = new DOMParser();

function xhr() {
  try {
    const request = new window.XMLHttpRequest();
    if ('withCredentials' in request) {
      // check CORS support
      return request;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function supported() {
  return !!xhr();
}

function get(url, options, cb) {
  try {
    const request = xhr();

    request.open('GET', url);
    request.timeout = options.timeout || 0;
    request.withCredentials = options.withCredentials || false;
    request.overrideMimeType && request.overrideMimeType('text/xml');
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          const xml = domParser.parseFromString(request.responseText);
          cb(null, xml);
        } else {
          cb(new Error(`XHRURLHandler: ${request.statusText}`));
        }
      }
    };
    request.send();
  } catch (error) {
    cb(new Error('XHRURLHandler: Unexpected error'));
  }
}

export const XHRURLHandler = {
  get,
  supported
};
