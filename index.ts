/// <reference path="./module.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./ticker.ts" />
/// <reference path="./ticker.ts" />

/**
 * SimpleJS simple lightweight library.
 */
export let SimpleJS: { Module: Module; Ticker: Ticker };

(function () {
  var Module;
  var Ticker;

  if (typeof window === "undefined") {
    Module: Module = require('./module');
    Ticker: Ticker = require('./ticker');
    require('./ajax');
    require('./router');
    SimpleJS = {
      Module,
      Ticker
    };

  }
})();
