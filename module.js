var Module = (function () {
  /**
   * @type {Module[]}
   */
  var moduleCollection = [];

  /**
   * Holds list of ready modules.
   * @type {{[id:string]:boolean}}
   */
  var readyModules = {};

  /**
   * @type {{[id:string]: Module}}
   */
  var modules = {};

  /**
   * Returns list of unresolved modules.
   * @param {string[]} mods modules names
   */
  var getUnResolvedModules = function getResolvedModules(mods) {
    var unreadyMods = [];
    for (var i = 0; i < mods.length; i++) {
      if (!readyModules[mods[i]]) {
        unreadyMods.push(mods[i]);
      }
    }
    return unreadyMods;
  };

  /**
   * Returns module by name
   * @param {string} name module name
   * @returns {Module}
   */
  var getModuleByName = function getModuleByName(name) {
    for (var i = 0; i < moduleCollection.length; i++) {
      if (moduleCollection[i].name == name) {
        return moduleCollection[i];
      }
    }
  };

  /**
   * 
   * @param {Module} module to check interdependency
   * @param {{[id:string]:boolean}} overTimeReady already registered module
   */
  var checkInterDependency = function checkInterDependency(module, overTimeReady) {
    if (overTimeReady === void 0) { overTimeReady = {}; }
    var unReadyMods = getUnResolvedModules(module.dependencies);
    var registered;
    for (var i = 0; i < unReadyMods.length; i++) {
      registered = false;
      for (var j = 0; j < moduleCollection.length; j++) {
        if (moduleCollection[j].name == unReadyMods[i]) {
          registered = true;
          break;
        }
      }
      if (!registered) {
        break;
      }
    }


    if (registered) {
      overTimeReady[module.name] = true;
      var resArr = [module.name];
      var allReady = true;
      for (var i = 0; i < unReadyMods.length; i++) {
        if (!overTimeReady[unReadyMods[i]]) {
          allReady = false;
          var res = checkInterDependency(getModuleByName(unReadyMods[i]), overTimeReady);
          if (res) {
            for (var j = 0; j < res.length; j++) {
              if (resArr.indexOf(res[i]) == -1) {
                resArr.push(res[i]);
              }
            }
          } else {
            return false;
          }
        } else {
          if (resArr.indexOf(unReadyMods[i]) == -1) {
            resArr.push(unReadyMods[i]);
          }
        }
      }
      return resArr;
    } else {
      return false;
    }
  };

  /**
   * Releases all modules with support to interdependency on each other.
   * @param {string[]} moduleNames module names in string list.
   */
  var releaseModules = function releaseModules(moduleNames) {
    for (var i = 0; i < moduleNames.length; i++) {
      var module = getModuleByName(moduleNames[i]);
      readyModules[moduleNames[i]] = true;
      module.scope = {};
      modules[module.name] = module.scope;
    }

    for (var i = 0; i < moduleNames.length; i++) {
      var module = getModuleByName(moduleNames[i]);
      var resolvedDeps = [module.scope];
      for (var j = 0; j < module.dependencies.length; j++) {
        resolvedDeps.push(modules[module.dependencies[j]]);
      }
      module.moduleHolder = module.readyFnc.apply(module.scope, resolvedDeps);
      // SimpleJS.Common.Ticker.removeTick(module.tickId);
    }
  };

  /**
   * Checks and releases modules from main collection
   */
  var checkNReleaseMods = function checkNReleaseMods() {
    for (var i = 0; i < moduleCollection.length; i++) {
      var currMod = moduleCollection[i];
      if (!readyModules[currMod.name] && areDepLoaded(currMod)) {
        releaseModule(currMod);
      }
    }
  };

  /**
   * Checks if dependencies are loaded or not.
   * @param {Module} module Module to check
   * @returns {boolean}
   */
  var areDepLoaded = function areDepLoaded(module) {
    for (var i = 0; i < module.dependencies.length; i++) {
      if (!readyModules[module.dependencies[i]]) {
        return false;
      }
    }
    return true;
  };

  /**
   * Releases module, calls its ready function.
   * @param {Module} module Module to release.
   */
  var releaseModule = function releaseModule(module) {
    readyModules[module.name] = true;
    module.scope = {};
    var resolvedDeps = [module.scope];
    for (var j = 0; j < module.dependencies.length; j++) {
      resolvedDeps.push(modules[module.dependencies[j]]);
    }
    module.moduleHolder = module.readyFnc.apply(module.scope, resolvedDeps);
    if (module.moduleHolder) {
      modules[module.name] = module.moduleHolder;
    } else {
      modules[module.name] = module.scope;
    }
  };

  /**
   * Creates a new Module, attaches dependencies
   * @param {string} Name 1st aargument, name of module to be registed.
   * @param {string[]} Dependencies 2nd to 2nd last argument, dependencies of the module.
   * @param {Function} ReadyFnc Last argument, resolved ready function.
   * @returns {{name:string;dependencies:string[];readyFnc:Function;scope:Object}}
   */
  var Module = function Module() {
    var dependencies = [];
    var allReady = true;

    for (var i = 1; i < arguments.length - 1; i++) {
      dependencies.push(arguments[i]);
      if (!readyModules[arguments[i]]) {
        allReady = false;
      }
    }

    /**
     * @type {string}
     */
    this.name = arguments[0];

    /**
     * @type {string[]}
     */
    this.dependencies = dependencies;

    /**
     * @type {Function}
     */
    this.readyFnc = arguments[arguments.length - 1];

    moduleCollection.push(this);

    if (dependencies.length == 0 || allReady) {
      releaseModule(this);
      checkNReleaseMods();
    } else {
      var res = checkInterDependency(this);
      if (res) {
        releaseModules(res);
      }
    }
  };

  /**
   * Returns module by name
   * @param {string} name name of module to get.
   */
  Module.get = function get(name) {
    return modules[name];
  };

  /**
   * Extends module by calling given function, module score is provided as arg and expected new updated scope.
   * Use this to extend functionality
   * @param {string} name name of module to get.
   * @param {Function} fnc extnding callback function.
   */
  Module.extend = function extend(name, fnc) {
    var scope = Module.get(name);
    var out = fnc.call(scope, scope);

    if (out) {
      modules[name] = out;
      getModuleByName(name).scope = out;
    }
  };

  return Module;
})();

(function () {
  if (typeof window !== "undefined") {
    window.SimpleJS = window.SimpleJS || {};
    window.SimpleJS.Module = Module;
  }
})();

if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = Module;
}
