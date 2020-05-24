/// <reference path="./module.ts" />
/// <reference path="./ajax.ts" />

class RouterLoaderAttributes {
  public basePath?: string = "";
  public rootElemSelector?: string = "";
}

class Router extends ModuleScope {
  private Ajax!: Ajax;

  public configs: any = [];
  public basePath = '';
  public rootElemSelector = '.router-main';

  /**
   * Loads state by state object
   * @param {Object} state State object to load.
   * @param {boolean} updateURL Optional, should update URL after loading the state. Default false
   */
  public loadState(state: any, updateURL: boolean) {
    var exeResolvers = function () {
      if (state.resolvers && state.resolvers.length) {
        Promise.all(state.resolvers).then(function () {
          // $('a.nav-item').removeClass('active');
          // $('a[href="' + state.path.replace('/', '') + '"]').addClass('active');
          state.module.invoke.apply(window, arguments);
          return arguments;
        });
      } else {
        // $('a.nav-item').removeClass('active');
        // $('a[href="' + state.path.replace('/', '') + '"]').addClass('active');
        state.module.invoke();
      }
    };

    var authUser = function (out: boolean) {
      if (typeof out == 'boolean' && out) {
        exeResolvers();
      } else if (typeof out == 'boolean' && out == false) {
        state.onAuthFail();
      }
    };

    if (updateURL) {
      var url = location.protocol + '//' + location.host + this.basePath + state.path;
      window.history.pushState(JSON.parse(JSON.stringify(state)), state.title, url);
    }

    this.Ajax.get(state.template, (templateHTML: string) => {
      const elem = document.querySelector(this.rootElemSelector);
      if (elem != null) {
        elem.innerHTML = templateHTML;
      }

      if (state.authGaurds && state.authGaurds.length && typeof state.authGaurdCb == 'function') {
        Promise.all(state.authGaurds).then(function () {
          var out = state.authGaurdCb.apply(window, arguments);
          authUser(out);
          if (typeof out == 'object' && out.then) {
            out.then(authUser);
          }
          return arguments;
        });
      }

    });
  }

  public loadProperState() {
    var currState = this.getCurrentState();
    if (currState) {
      this.loadState(currState, false);
    } else {
      var defState = this.getDefaultState();
      if (defState) {
        this.loadState(defState, true);
      }
    }
  }

  public getCurrentState() {
    for (var i = 0; i < this.configs.length; i++) {
      var currConfig = this.configs[i];
      var path = location.protocol + '//' + location.host + this.basePath + currConfig.path;
      if (path == location.href) {
        return currConfig;
      }
    }
  }

  /**
   * Loads configs and starts routing.
   */
  public load(config: any, attr: RouterLoaderAttributes) {
    if (attr == void 0) { attr = {}; }
    if (attr.basePath == void 0) { attr.basePath = ''; }
    if (attr.rootElemSelector == void 0) { attr.rootElemSelector = '.router-main'; }

    window.addEventListener('popstate', (event) => {
      this.loadProperState();
    });
    window.addEventListener('pushstate', (event) => {
      this.loadProperState();
    });
    this.configs = config;
    this.basePath = attr.basePath;
    this.rootElemSelector = attr.rootElemSelector;

    this.loadProperState();
  }

  public getDefaultState() {
    for (var i = 0; i < this.configs.length; i++) {
      var currConfig = this.configs[i];
      if (currConfig.isDefault) {
        return currConfig;
      }
    }
  }

  /**
   * Loads given state.
   * @param {string} stateName Name of state to load.
   * @param {boolean} updateURL Optional, should update URL after loading the state. Default false
   */
  public goTo(stateName: string, updateURL: boolean) {
    for (var i = 0; i < this.configs.length; i++) {
      var currConfig = this.configs[i];
      if (currConfig.stateName == stateName) {
        return this.loadState(currConfig, updateURL);
      }
    }
  }

  public static invoke(model: Router, Ajax: Ajax): Router {
    model.Ajax = Ajax;
    return model;
  }
}


declare var require: (...args: any[]) => any;

(function () {
  let ModuleClass: typeof Module;
  if (typeof window === "undefined") {
    ModuleClass = require('./module');
  } else {
    var win: any = window;
    win.SimpleJS = win.SimpleJS || {};
    ModuleClass = win.SimpleJS.Module;
  }
  new ModuleClass('Router', 'Ajax', Router);
})();
