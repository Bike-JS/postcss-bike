import postcss from 'postcss';

export default postcss.plugin('postcss-bike', function postcssBike() {

  return root => {
    const setSelector = (node) => {
      if (node.name === 'elem') {
        return `${node.parent.selector}__${node.params}`;
      }

      if (node.name === 'mod') {
        let modVal = node.params.match(/(\w+)\[(\w+)\]/);

        if (!modVal) {
          return `${node.parent.selector}_${node.params}`;
        }

        return `${node.parent.selector}_${modVal[1]}_${modVal[2]}`;
      }

      return `.${node.params}`;
    }

    const process = (node) => {
      if (node.params === undefined) {
        return node;
      }

      if (!node.nodes.length) {
        return node;
      }

      const rule = postcss.rule({
        raws: { semicolon: true },
        selector: setSelector(node),
        source: node.source
      });

      node.walkDecls(decl => {
        const declClone = postcss.decl({
          raws: { before: '\n  ', between: ': '},
          source: decl.source,
          prop: decl.prop,
          value: decl.value
        });

        decl.replaceWith(declClone);
      })

      rule.append(node.nodes);

      node.remove();

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