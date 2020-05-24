/// <reference path="./module-scope.ts" />

const moduleCollection: Module[] = [];
const readyModules: { [id: string]: boolean } = {};
const modules: { [id: string]: ModuleScope } = {};

let ModuleScopeMain: typeof ModuleScope;
if (typeof window === "undefined") {
  ModuleScopeMain = require('./module-scope');
} else {
  const win: any = window;
  ModuleScopeMain = win.ModuleScope;
}

/**
 * Creates a new Module, attaches dependencies
 * @param {string} Name 1st aargument, name of module to be registed.
 * @param {string[]} Dependencies 2nd to 2nd last argument, dependencies of the module.
 * @param {Function} ReadyFnc Last argument, resolved ready function.
 * @returns {{name:string;dependencies:string[];readyFnc:Function;scope:Object}}
 */
class Module {
  name: string;
  dependencies: string[];
  readyFnc: typeof ModuleScopeMain;
  scope: ModuleScope;
  moduleHolder: ModuleScope;

  public constructor(...args: any[]) {
    const dependencies = [];
    let allReady = true;

    for (var i = 1; i < arguments.length - 1; i++) {
      dependencies.push(arguments[i]);
      if (!readyModules[arguments[i]]) {
        allReady = false;
      }
    }

    this.name = arguments[0];
    this.dependencies = dependencies;
    this.readyFnc = arguments[arguments.length - 1];
    this.scope = new ModuleScopeMain();
    this.moduleHolder = new ModuleScopeMain();

    moduleCollection.push(this);

    if (dependencies.length == 0 || allReady) {
      this.releaseModule(this);
      this.checkNReleaseMods();
    } else {
      var res = this.checkInterDependency(this);
      if (res) {
        this.releaseModules(res);
      }
    }
  }

  /**
   * Returns list of unresolved modules.
   * @param {string[]} mods modules names
   */
  private getUnResolvedModules(mods: string[]): string[] {
    const unreadyMods = [];
    for (let i = 0; i < mods.length; i++) {
      if (!readyModules[mods[i]]) {
        unreadyMods.push(mods[i]);
      }
    }
    return unreadyMods;
  }

  /**
   * Returns module by name
   * @param {string} name module name
   * @returns {Module}
   */
  private static getModuleByName(name: string) {
    for (var i = 0; i < moduleCollection.length; i++) {
      if (moduleCollection[i].name == name) {
        return moduleCollection[i];
      }
    }
    return null;
  }

  private checkInterDependency(module: Module, overTimeReady: { [id: string]: boolean } = {}) {
    const unReadyMods = this.getUnResolvedModules(module.dependencies);
    let registered: boolean = false;
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
          const mod = Module.getModuleByName(unReadyMods[i]);
          if (!mod) {
            return false;
          }
          var res = this.checkInterDependency(mod, overTimeReady);
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
  }

  /**
   * Releases all modules with support to interdependency on each other.
   * @param {string[]} moduleNames module names in string list.
   */
  private releaseModules(moduleNames: string[]) {
    for (var i = 0; i < moduleNames.length; i++) {
      var module = Module.getModuleByName(moduleNames[i]);
      if (!module) {
        continue;
      }
      readyModules[moduleNames[i]] = true;
      module.scope = new ModuleScopeMain();
      const inst = new module.readyFnc();
      modules[module.name] = inst;
    }

    for (var i = 0; i < moduleNames.length; i++) {
      var module = Module.getModuleByName(moduleNames[i]);
      if (!module) {
        continue;
      }
      var resolvedDeps = [];
      for (var j = 0; j < module.dependencies.length; j++) {
        resolvedDeps.push(modules[module.dependencies[j]]);
      }

      module.moduleHolder = module.readyFnc.invoke.apply(module.scope, [module.scope, ...resolvedDeps]);

      if (module.moduleHolder) {
        modules[module.name] = module.moduleHolder;
      } else {
        modules[module.name] = module.scope;
      }
    }
  }

  /**
   * Checks and releases modules from main collection
   */
  private checkNReleaseMods() {
    for (var i = 0; i < moduleCollection.length; i++) {
      var currMod = moduleCollection[i];
      if (!readyModules[currMod.name] && this.areDepLoaded(currMod)) {
        this.releaseModule(currMod);
      }
    }
  };

  /**
   * Checks if dependencies are loaded or not.
   * @param {Module} module Module to check
   * @returns {boolean}
   */
  private areDepLoaded(module: Module): boolean {
    for (var i = 0; i < module.dependencies.length; i++) {
      if (!readyModules[module.dependencies[i]]) {
        return false;
      }
    }
    return true;
  }


  /**
   * Releases module, calls its ready function.
   * @param {Module} module Module to release.
   */
  private releaseModule(module: Module) {
    readyModules[module.name] = true;
    const inst = new module.readyFnc();
    module.scope = inst;
    var resolvedDeps = [];
    for (var j = 0; j < module.dependencies.length; j++) {
      resolvedDeps.push(modules[module.dependencies[j]]);
    }
    
    module.moduleHolder = module.readyFnc.invoke.apply(module.scope, [module.scope, ...resolvedDeps]);

    if (module.moduleHolder) {
      modules[module.name] = module.moduleHolder;
    } else {
      modules[module.name] = module.scope;
    }
  };

  /**
   * Returns module by name
   * @param {string} name name of module to get.
   */
  public static get(name: string) {
    return modules[name];
  }

  /**
   * Extends module by calling given function, module score is provided as arg and expected new updated scope.
   * Use this to extend functionality
   * @param {string} name name of module to get.
   * @param {Function} fnc extnding callback function.
   */
  public static extend(name: string, fnc: (model: ModuleScope) => ModuleScope) {
    const scope = Module.get(name);
    const out = fnc.call(scope, scope);

    if (out) {
      modules[name] = out;
      const mod = Module.getModuleByName(name);
      if (mod) {
        mod.scope = out;
      }
    }
  }
}

(function () {
  if (typeof window !== "undefined") {
    const win: any = window;
    win.SimpleJS = win.SimpleJS || {};
    win.SimpleJS.Module = Module;
  }
})();

declare var module: any;

if (typeof module != "undefined" && typeof module.exports != "undefined") {
  module.exports = Module;
}
