const test = require('ava');
const postcssBike = require('.././dist/index');
const {readFileSync} = require('fs');
const path = require('path');
const postcss = require('postcss');
const fixtures = path.join(__dirname, 'fixtures');

test('block', (t) => {
  return compare(t, 'block');
})

test('block-modifier', (t) => {
  return compare(t, 'block-modifier');
})

test('element', (t) => {
  return compare(t, 'element');
})

test('element-modifier', (t) => {
  return compare(t, 'element-modifier');
})

test('modifier-elements', (t) => {
  return compare(t, 'modifier-elements');
})

test('options', (t) => {
  return compare(t, 'options', { component: 'b', element: 'e', modifier: 'm', modifierRegExp: /(\w+)\((\w+)\)/});
})

function compare (t, name, options) {
  const css = readFileSync(path.join(fixtures, `${name}.css`), 'utf8');
  const expected = readFileSync(path.join(fixtures, `${name}.expected.css`), 'utf8');

  return postcss([postcssBike(options)])
    .process(css)
    .then((res) => t.truthy(res.css === expected));
}