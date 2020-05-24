/**
 * SimpleJS simple lightweight library.
 * @type {{Module: Module;Common:{Ticker:Ticker}}}
 */
var SimpleJS;

(function () {
  var Module;
  var Ticker;

  if (typeof window === "undefined") {
    SimpleJS = {};
    Module = require('./module');
    Ticker = require('./ticker');
    require('./ajax');
    require('./router');
    SimpleJS.Module = Module;
    SimpleJS.Ticker = Ticker;
  }
})();


if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = SimpleJS;
}