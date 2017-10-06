const test = require('ava');
const plugin = require('.././dist/index');
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

test('basic', (t) => {
  return compare(t, 'basic');
})

function compare (t, name) {
  const css = readFileSync(path.join(fixtures, `${name}.css`), 'utf8');
  const expected = readFileSync(path.join(fixtures, `${name}.expected.css`), 'utf8');

  return postcss([plugin()])
    .process(css)
    .then((res) => t.truthy(res.css === expected));
}