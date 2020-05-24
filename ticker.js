/**
 * SimpleJS simple lightweight library.
 * @type {{Module: Module;Common:{Ticker:Ticker}}}
 */
var SimpleJS = window.SimpleJS || {};
SimpleJS.Common = SimpleJS.Common || {};

var Ticker = (function () {
  var initDate = new Date();
  var currId = 0;

  /**
   * @type {{id:number,interval:number,callback:Function,nxtTick:number}[]}
   */
  var ticks = [];

  setInterval(function () {
    var currTime = new Date().getTime();
    for (var i = 0; i < ticks.length; i++) {
      if (ticks[i].nxtTick < currTime) {
        ticks[i].nxtTick = currTime + ticks[i].interval;
        ticks[i].callback();
      }
    }
  }, 100);
  var Ticker = function Ticker() { };

  /**
   * Registers a tick, callbacks given function per interval.
   * @param {number} interval in miliseconds
   * @param {Function} callback function to execute
   */
  Ticker.getTick = function getTick(interval, callback) {
    var id = currId;
    currId++;

    ticks.push({
      id: id,
      interval: interval,
      callback: callback,
      nxtTick: new Date().getTime() + interval
    });

    return id;
  };

  /**
   * Removes a registered tick.
   * @param {number} interval in miliseconds
   * @param {Function} callback function to execute
   */
  Ticker.removeTick = function (id) {
    var index = -1;
    for (var i = 0; i < ticks.length; i++) {
      if (ticks[i].id == id) {
        index = i;
        break;
      }
    }

    if (index != -1) {
      ticks.splice(index, 1);
    }
  };

  return Ticker;
})();

if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = Ticker;
}

SimpleJS.Common.Ticker = Ticker;