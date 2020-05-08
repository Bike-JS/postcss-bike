export const BEM = (block) => (elem, mods) => {
  let base = `.${block}`;

  if (!elem) {
    return base;
  }

  if (typeof elem === 'object') {
    mods = elem;
    elem = '';
  }

  if (elem !== '') {
    base = `.${block}__${elem}`;
  }

  return (mods ? Object.entries(mods).reduce((target, [key, value]) => {
    if (!value) {
      return target;
    }

    target += `${value === true ? (`${base}_${key}`) : (`${base}_${key}_${value}`)}`;

    return target;
  }, '') : base);
};
