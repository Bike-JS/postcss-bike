import postcss from 'postcss';

export default postcss.plugin('postcss-bike', function postcssBike(options) {

  return root => {

    options = options || {};

    const selector = (block, elem, modName, modVal) => (
      `.${block}${elem ? `__${elem}` : ''}${modName ? (modVal ? `_${modName}_${modVal}` : `_${modName}`) : ''}`
    );

    const addMod = (className, block, elem, modName, modVal) => (
      `${className} ${selector(block, elem, modName, modVal).substr(1)}`
    );

    const process = (rule) => {
      if (rule.params === undefined) {
        return rule;
      }

      if (!rule.nodes.length) {
        return rule;
      }

      rule.raws.semicolon = true;
      rule.type = 'rule';

      if (rule.name === 'component') {
        rule.selector = selector(rule.params);
      }

      if (rule.name === 'mod') {
        let modVal = rule.params.match(/(\w+)\[(\w+)\]/);

        if (modVal) {
          if (rule.selector) {
            rule.selector = addMod(rule.selector, rule.parent.params, modVal[1], modVal[2]);
          } else {
            rule.selector = selector(rule.parent.params, modVal[1], modVal[2]);
          }
        } else {
          rule.selector = selector(rule.parent.params, '', rule.params);
        }
      }

      if (rule.name === 'elem') {
        rule.selector = selector(rule.parent.params, rule.params);
      }

      root.append(rule);

      rule.each(child => {
        if (child.type === 'atrule' && child.name === 'mod') {
          return process(child);
        }

        if (child.type === 'atrule' && child.name === 'elem') {
          return process(child);
        }
      });
    }
    root.walkAtRules('component', process);
  }
});