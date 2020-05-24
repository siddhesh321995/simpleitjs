# simpleitjs
> Simple light frontend framework

## Usage:

```
npm install simpleitjs --save
```

```
const SimpleJS = require('simpleitjs');
```

Register new module-
```
new SimpleJS.Module('HomePage', 'Ajax', 'Router', function(HomePage, Ajax, Router) {
    HomePage.title = 'Hello world!! :)';
    return HomePage;
});
```

Use registered module-
```
console.log(SimpleJS.get('HomePage').title);
// Prints- Hello world
```
