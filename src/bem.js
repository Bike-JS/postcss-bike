export const BEM = (block) => (elem, mods, options) => {
  const template = require('lodash.template');
  let data = { block };
  let formatter = template(options.blockFormat);
  let base = formatter(data);

  if (!elem) {
    return base;
  }

  if (typeof elem === 'object') {
    mods = elem;
    elem = '';
  }

  if (elem !== '') {
    data = { block, elem };
    formatter = template(options.elementFormat);
    base = formatter(data);
  }

  return (mods ? Object.entries(mods).reduce((target, [key, value]) => {
    if (!value) {
      return target;
    }

    data = { base, key, value };
    formatter = value === true ? template(options.modifierFormatTrue) : template(options.modifierFormat);
    target += formatter(data);

    return target;
  }, '') : base);
};
