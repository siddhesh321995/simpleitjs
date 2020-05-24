/// <reference path="./module.ts" />
/**
 * Ajax module
 * Usful to create Ajax XHR requests.
 * @param {Ajax} Ajax this module
 * @returns {Ajax}
 */
class Ajax extends ModuleScope {
  constructor() {
    super();
  }

  /**
   * Creates an XHR Put request.
   * @static
   * @param {string} url string URL
   * @param {any} data Any type of data, mostly json object
   * @param {Function} onSuccess Optional, success callback function
   * @param {Function} onFail Optional, fail callback function
   * @returns {Promise<T>} Promise with data
   */
  public put<T = any>(url: string, data: any, onSuccess: Function = () => { }, onFail: Function = () => { }): Promise<T> {
    return new Promise<T>(function (res, rej) {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onload = function () {
        var data: T = xhr.responseText as any;
        if (xhr.readyState == 4 && xhr.status == 200) {
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
   * @param {string} url string URL
   * @param {Function} onSuccess Optional, success callback function
   * @param {Function} onFail Optional, fail callback function
   * @returns {Promise<T>} Promise with data
   */
  public get<T = any>(url: string, onSuccess: Function = () => { }, onFail: Function = () => { }): Promise<T> {
    return new Promise<T>(function (res, rej) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true);
      xhr.onload = function () {
        var data: T = xhr.responseText as any;
        if (xhr.readyState == 4 && xhr.status == 200) {
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
  public post<T = any>(url: string, data: any, onSuccess: Function = () => { }, onFail: Function = () => { }): Promise<T> {
    return new Promise<T>(function (res, rej) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onload = function () {
        var data2: T = xhr.responseText as any;
        if (xhr.readyState == 4 && xhr.status == 200) {
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
}

declare var require: (...args: any[]) => any;

(function () {
  let ModuleClass: typeof Module;
  if (typeof window === "undefined") {
    ModuleClass = require('./module');
  } else {
    const win: any = window;
    ModuleClass = win.SimpleJS.Module;
  }
  new ModuleClass('Ajax', Ajax);
})();
