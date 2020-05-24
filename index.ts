/// <reference path="./module.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./ticker.ts" />
/// <reference path="./router.ts" />

/**
 * SimpleJS simple lightweight library.
 */
let SimpleJS: { Module: Module; Ticker: Ticker; ModuleScope: ModuleScope };

declare var module: any;

(function () {
  var Module;
  var Ticker;
  var ModuleScope;

  if (typeof window === "undefined") {
    ModuleScope: ModuleScope = require('./module-scope');
    Module: Module = require('./module');
    Ticker: Ticker = require('./ticker');
    require('./ajax');
    require('./router');
    SimpleJS = {
      Module,
      Ticker,
      ModuleScope
    };


    if (typeof module != "undefined" && typeof module.exports != "undefined") {
      module.exports = SimpleJS;
    }
  }
})();

