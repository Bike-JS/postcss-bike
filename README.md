# Bike plugin [![Build Status][travis-image]][travis-url] [![npm version][npm-image]][npm-url]

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

> This [PostCSS] plugin based on the idea of [posthtml-bike] by [Alex Khyrenko] and implements transformation of custom At-rules to BEM-like rules

[PostCSS]: https://github.com/postcss/postcss
[posthtml-bike]: https://github.com/Satanpit/posthtml-bike
[Alex Khyrenko]: https://github.com/Satanpit

## Install

```
npm install --save-dev postcss-bike
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
default: `{modifierRegExp: /(\w+)\[(\w+)\]/}`

Allows to set custom regular expressions for modifier params. Where `$1` is Modifier Name and `$2` is Modifier Value. For 
changing Modifier Value Separator, change default separator `\[$2\]`, which goes before and after $2 (only this `[ ]` symbols).

## Credits

* [Alex Khyrenko](https://github.com/Satanpit)

### License [MIT](LICENSE)

[travis-url]: https://travis-ci.org/artem-tolstykh/postcss-bike?branch=master
[travis-image]: http://img.shields.io/travis/artem-tolstykh/postcss-bike.svg?style=flat-square
[npm]: https://img.shields.io/npm/v/postcss-bike.svg?style=flat-square
[npm-url]: https://npmjs.com/package/postcss-bike
