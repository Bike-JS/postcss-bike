# Bike plugin

[![Build](https://travis-ci.org/Satanpit/posthtml-bike.svg?branch=master)](https://travis-ci.org/Satanpit/posthtml-bike)

This [PostCSS] plugin based on the idea of [postthtml-bike] by [Alex Khyrenko] and implements transformation of custom At-rules to BEM-like rules

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.svg">

[PostCSS]: https://github.com/postcss/postcss
[postthtml-bike]: https://github.com/Satanpit/posthtml-bike
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

```css
@component example {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  @mod theme[dark] {
    background-color: #333;
    color: #f5f5f5;
  }

  @elem header {
    flex: 0 0 50px;
    background-color: #333;
    color: #fff;
  }

  @elem main {
    flex: 1 1 auto;

    @mod hidden {
      display: none;
    }
  }

  @elem footer {
    flex: 0 0 50px;
    background-color: #333;
    color: #fff;
  }
}
```

Transformed to:

```css
.example {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}
.example_theme_dark {
  background-color: #333;
  color: #f5f5f5;
}
.example__header {
  flex: 0 0 50px;
  background-color: #333;
  color: #fff;
}
.example__main {
  flex: 1 1 auto;
}
.example__main_hidden {
  display: none;
}
.example__footer {
  flex: 0 0 50px;
  background-color: #333;
  color: #fff;
}
```
### License [MIT](LICENSE)