# Bike plugin [![npm version][npm-image]][npm-url] [![Deps][deps-image]][deps-url]

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

> This [PostCSS] plugin for implements transformation of custom At-rules to BEM-like rules

[PostCSS]: https://github.com/postcss/postcss
[posthtml-bike]: https://github.com/Satanpit/posthtml-bike

## Install

```
npm install -S @bikejs/postcss-bem
```

## Usage

```javascript
const { readFileSync } = require('fs');
const postcss = require('postcss');
const bike = require('postcss-bike');

const css = readFileSync('input.css');

postcss([bike()]).process(css).then((res) => console.log(output.css));
```

## Example

### Default

```css
@component example {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;

  @mod theme[dark] {
    background-color: #333;
    color: #f5f5f5;

    @elem header, footer {
      background-color: #1b1b1b;
      color: #fff;
    }
  }

  @mod theme[foo|bar] {
    @elem header {
      position: absolute;
    }
  }
  
  @elem header {
    flex: 0 0 50px;
    background-color: #fff;
    color: #000;
  }

  @elem main {
    flex: 1 1 auto;

    @mod hidden {
      display: none;
    }
  }

  @elem footer {
    flex: 0 0 50px;
    background-color: #fff;
    color: #000;
  }
}
```

Transformed to:

```css
.example {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: #f5f5f5;
  color: #333;
}
.example_theme_dark {
  background-color: #333;
  color: #f5f5f5;
}
.example_theme_dark .example__header,
.example_theme_dark .example__footer {
  background-color: #1b1b1b;
  color: #fff;
}
.example_theme_foo .example__header,
.example_theme_bar .example__header {
  position: absolute;
}
.example__header {
  flex: 0 0 50px;
  background-color: #fff;
  color: #000;
}
.example__main {
  flex: 1 1 auto;
}
.example__main_hidden {
  display: none;
}
.example__footer {
  flex: 0 0 50px;
  background-color: #fff;
  color: #000;
}
```

## Options

### `component`

type: `String`  
default: `{component: 'component'}`

Allows to set custom name for component `@rule`.

### `element`

type: `String`  
default: `{element: 'elem'}`

Allows to set custom name for element `@rule`.

### `modifier`

type: `String`  
default: `{modifier: 'mod'}`

Allows to set custom name for modifier `@rule`.

### `modifierRegExp`

type: `RegExp`  
default: `{modifierRegExp: /(\w+)\[(\w+)| \]/}`

Allows to set custom regular expressions for modifier params. Where `$1` is Modifier Name and `$2` is Modifier Value. For 
changing Modifier Value Separator, change default separator `\[$2\]`, which goes before and after `$2` (only this `[ ]` symbols).
Multiple values (used as 'OR') can be separated with a vertical pipe (`|`).


### License [MIT](LICENSE)

[travis-url]: https://travis-ci.org/Bike-JS/postcss-bike
[travis-image]: http://img.shields.io/travis/Bike-JS/postcss-bike.svg?style=flat-square

[npm-url]: https://www.npmjs.org/package/postcss-bike
[npm-image]: http://img.shields.io/npm/v/postcss-bike.svg?style=flat-square

[deps-url]: https://david-dm.org/artem-tolstykh/postcss-bike
[deps-image]: https://david-dm.org/artem-tolstykh/postcss-bike.svg?style=flat-square
