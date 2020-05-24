class ModuleScope {
  public static invoke(module: ModuleScope, ...dependencies: ModuleScope[]): ModuleScope {
    return module;
  }

  constructor(...deps: any[]) {

  }
}

(function () {
  if (typeof window !== "undefined") {
    const win: any = window;
    win.SimpleJS = win.SimpleJS || {};
    win.SimpleJS.ModuleScope = ModuleScope;
  }
})();

declare var module: any;

if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = ModuleScope;
}
