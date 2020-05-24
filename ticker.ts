class Ticker {
  public static initDate = new Date();
  public static currId = 0;

  public static ticks: Ticker[] = [];

  public id: number;
  public interval: number;
  callback: Function;
  nxtTick: number;

  constructor(attr: any) {
    this.id = attr.id;
    this.interval = attr.interval;
    this.callback = attr.callback;
    this.nxtTick = attr.nxtTick;
  }

  /**
   * Registers a tick, callbacks given function per interval.
   * @param {number} interval in miliseconds
   * @param {Function} callback function to execute
   */
  public static getTick(interval: number, callback: Function) {
    var id = Ticker.currId;
    Ticker.currId++;

    Ticker.ticks.push(new Ticker({
      id: id,
      interval: interval,
      callback: callback,
      nxtTick: new Date().getTime() + interval
    }));

    return id;
  }

  /**
   * Removes a registered tick.
   * @param {number} interval in miliseconds
   * @param {Function} callback function to execute
   */
  public static removeTick(id: number) {
    var index = -1;
    for (var i = 0; i < Ticker.ticks.length; i++) {
      if (Ticker.ticks[i].id == id) {
        index = i;
        break;
      }
    }

    if (index != -1) {
      Ticker.ticks.splice(index, 1);
    }
  }
}


(function () {
  setInterval(() => {
    var currTime = new Date().getTime();
    for (var i = 0; i < Ticker.ticks.length; i++) {
      if (Ticker.ticks[i].nxtTick < currTime) {
        Ticker.ticks[i].nxtTick = currTime + Ticker.ticks[i].interval;
        Ticker.ticks[i].callback();
      }
    }
  }, 100);

  if (typeof window !== "undefined") {
    var win: any = window;
    win.SimpleJS = win.SimpleJS || {};
    win.SimpleJS.Ticker = Ticker;
  }
})();

if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = Ticker;
}
