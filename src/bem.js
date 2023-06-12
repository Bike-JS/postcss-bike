export const BEM = (block) => (elem, mods) => {
  let base = `.${block}`;

  if (!elem) {
    return base;
  }

  // Handle multiple bases e.g. comma-separated elements.
  let bases = [base];

  if (typeof elem === 'object') {
    mods = elem;
    elem = '';
  }

  if (elem !== '') {
    bases = elem.split(',').map(elem => {
      return `.${block}__${elem.trim()}`;
    });
  }

  return bases.map(base => {
    return mods ? Object.entries(mods).reduce((target, [key, value]) => {
      if (!value) {
        return target;
      }

      target += `${value === true ? (`${base}_${key}`) : (`${base}_${key}_${value}`)}`;

      return target;
    }, '') : base;
  }).join(', ');
};
