/**
 * 
 * @param {Router} Router this module
 * @param {Ajax} Ajax Ajax module
 */
var Router = function Router(Router, Ajax) {
  /**
   * Loads state by state object
   * @param {Object} state State object to load.
   * @param {boolean} updateURL Optional, should update URL after loading the state. Default false
   */
  this.loadState = function (state, updateURL) {
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

    var authUser = function (out) {
      if (typeof out == 'boolean' && out) {
        exeResolvers();
      } else if (typeof out == 'boolean' && out == false) {
        state.onAuthFail();
      }
    };

    if (updateURL) {
      var url = location.protocol + '//' + location.host + Router.basePath + state.path;
      window.history.pushState(JSON.parse(JSON.stringify(state)), state.title, url);
    }

    Ajax.get(state.template, function (templateHTML) {
      document.querySelector(Router.rootElemSelector).innerHTML = templateHTML;

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
  };

  this.loadProperState = function () {
    var currState = Router.getCurrentState();
    if (currState) {
      Router.loadState(currState, false);
    } else {
      var defState = Router.getDefaultState();
      if (defState) {
        Router.loadState(defState, true);
      }
    }
  };

  /**
   * Loads configs and starts routing.
   */
  this.load = function (config, attr) {
    if (attr == void 0) { attr = {}; }
    if (attr.basePath == void 0) { attr.basePath = ''; }
    if (attr.rootElemSelector == void 0) { attr.rootElemSelector = '.router-main'; }

    window.addEventListener('popstate', function (event) {
      Router.loadProperState();
    });
    window.addEventListener('pushstate', function (event) {
      Router.loadProperState();
    });
    Router.configs = config;
    Router.basePath = attr.basePath;
    Router.rootElemSelector = attr.rootElemSelector;

    Router.loadProperState();
  };

  this.getCurrentState = function () {
    for (var i = 0; i < Router.configs.length; i++) {
      var currConfig = Router.configs[i];
      var path = location.protocol + '//' + location.host + Router.basePath + currConfig.path;
      if (path == location.href) {
        return currConfig;
      }
    }
  };

  this.getDefaultState = function () {
    for (var i = 0; i < Router.configs.length; i++) {
      var currConfig = Router.configs[i];
      if (currConfig.isDefault) {
        return currConfig;
      }
    }
  };

  /**
   * Loads given state.
   * @param {string} stateName Name of state to load.
   * @param {boolean} updateURL Optional, should update URL after loading the state. Default false
   */
  this.goTo = function (stateName, updateURL) {
    for (var i = 0; i < Router.configs.length; i++) {
      var currConfig = Router.configs[i];
      if (currConfig.stateName == stateName) {
        return Router.loadState(currConfig, updateURL);
      }
    }
  };

  this.configs = {};
  this.basePath = '';
  this.rootElemSelector = '.router-main';

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
  new Module('Router', 'Ajax', Router);
})();
