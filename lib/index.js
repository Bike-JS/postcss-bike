import postcss from 'postcss';

export default postcss.plugin('postcss-bike', function postcssBike() {

  return root => {
    const setSelector = (node) => {
      if (node.name === 'elem') {
        let isComponentMod = node.parent.selector.match(/^\.(\w+)\_(\w+)$/);
        let isComponentModVal = node.parent.selector.match(/^\.(\w+)\_(\w+)\_(\w+)$/);
        let isElemMod = node.parent.selector.match(/^\.(\w+)\_\_(\w+)\_(\w+)$/);
        let isElemModVal = node.parent.selector.match(/^\.(\w+)\_\_(\w+)\_(\w+)\_(\w+)$/);

        if (isComponentMod || isComponentModVal || isElemMod || isElemModVal) {
          let list = [];

          postcss.list.comma(node.params).forEach(elem => {
            list.push('\n' + `${node.parent.selector}` + ' ' + `${node.parent.selector.split('_')[0]}__${elem}`);
          })

          list[0] = list[0].substr(1);

          return list;
        }

        return `${node.parent.selector}__${node.params}`;
      }

      if (node.name === 'mod') {
        let isModVal = node.params.match(/(\w+)\[(\w+)\]/);

        if (!isModVal) {
          return `${node.parent.selector}_${node.params}`;
        }

        return `${node.parent.selector}_${isModVal[1]}_${isModVal[2]}`;
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