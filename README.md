# simpleitjs
> Simple light frontend framework, inspired from AngularJS

## Usage:

```
npm install simpleitjs --save
```

```
const SimpleJS = require('simpleitjs');
```

Register new module
```
class HomePage extends SimpleJS.ModuleScope {
    static invoke(model, Ajax, Router) {
        model.title = 'Hello world!! :)';
        return model;
    }
}
new SimpleJS.Module('HomePage', 'Ajax', 'Router', HomePage);
```

Or classic vanilla js way
```
var HomePage = function HomePage() {};
HomePage.invoke = function(model, Ajax, Router) {
    model.title = 'Hello world!! :)';
    return model;
};
new SimpleJS.Module('HomePage', 'Ajax', 'Router', HomePage);
```

Use registered module
```
console.log(SimpleJS.get('HomePage').title);
// Hello world!! :)
```

## Features:
- Works with both browser based frontend setup or npm setup
- Easy modularity
- Dependency injection
- Supports interdependency injection
- Comes with Router, Ajax etc out of the box modules.
