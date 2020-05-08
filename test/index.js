const postcss = require('postcss');
const { readFileSync } = require('fs');
const path = require('path');
const postcssBike = require('../dist/index.cjs');

function compare (options) {
  const css = readFileSync(path.resolve(__dirname, 'cases/index.css'));

  return postcss([postcssBike(options)])
    .process(css)
    .then((result) => {
      console.log(result.css);
    });
}

(async () => {
  await compare({
    component: 'block',
  });
})();
