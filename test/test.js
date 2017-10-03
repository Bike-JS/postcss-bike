const test = require('ava')
const plugin = require('.././lib/postcss.bike')
const {readFileSync} = require('fs')
const path = require('path')
const poscss = require('postcss')
const fixtures = path.join(__dirname, 'fixtures')

test('basic', (t) => {
  return compare(t, 'basic')
})

function compare (t, name) {
  const css = readFileSync(path.join(fixtures, `${name}.css`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.css`), 'utf8')

  return poscss([plugin()])
    .process(css)
    .then((res) => t.truthy(res.css === expected))
}