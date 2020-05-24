

/**
 * Ajax module
 * Usful to create Ajax XHR requests.
 * @param {Ajax} Ajax this module
 * @returns {Ajax}
 */
var Ajax = function Ajax(Ajax) {
  /**
   * Creates an XHR Put request.
   * @static
   * @param {String} url string URL
   * @param {any} data Any type of data, mostly json object
   * @param {Function} onSuccess Optional, success callback function
   * @param {Function} onFail Optional, fail callback function
   * @returns {Promise<T>} Promise with data
   */
  this.put = function put(url, data, onSuccess, onFail) {
    return new Promise(function (res, rej) {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onload = function () {
        var data = xhr.responseText;
        if (xhr.readyState == 4 && xhr.status == "200") {
          typeof onSuccess == "function" && onSuccess(data);
          res(data);
        } else {
          typeof onFail == "function" && onFail(data);
          rej(data);
        }
      }
      xhr.send(JSON.stringify(data));
    });
  };

  /**
   * Creates an XHR Get request.
   * @static
   * @param {String} url string URL
   * @param {Function} onSuccess Optional, success callback function
   * @param {Function} onFail Optional, fail callback function
   * @returns {Promise<T>} Promise with data
   */
  this.get = function get(url, onSuccess, onFail) {
    return new Promise(function (res, rej) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true);
      xhr.onload = function () {
        var data = xhr.responseText;
        if (xhr.readyState == 4 && xhr.status == "200") {
          typeof onSuccess == "function" && onSuccess(data);
          res(data);
        } else {
          typeof onFail == "function" && onFail(data);
          rej(data);
        }
      }
      xhr.send(null);
    });
  }

  /**
   * Creates an XHR Post request.
   * @static
   * @param {String} url string URL
   * @param {any} data Any type of data, mostly json object
   * @param {Function} onSuccess Optional, success callback function
   * @param {Function} onFail Optional, fail callback function
   * @returns {Promise<T>} Promise with data
   */
  this.post = function post(url, data, onSuccess, onFail) {
    return new Promise(function (res, rej) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onload = function () {
        var data2 = xhr.responseText;
        if (xhr.readyState == 4 && xhr.status == "200") {
          typeof onSuccess == "function" && onSuccess(data2);
          res(data2);
        } else {
          typeof onFail == "function" && onFail(data2);
          rej(data2);
        }
      }
      xhr.send(JSON.stringify(data));
    });
  };

  return this;
};

(function () {
  var Module;
  if (typeof window === "undefined") {
    Module = require('./module');
  } else {
    window.SimpleJS = window.SimpleJS || {};
    Module = window.SimpleJS.Module;
  }
  new Module('Ajax', Ajax);
})();
