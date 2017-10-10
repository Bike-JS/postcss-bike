import postcss from 'postcss';

export default postcss.plugin('postcss-bike', function postcssBike(options) {

  options = options || {};

  const component = options.component || 'component';
  const element = options.element || 'elem';
  const modifier = options.modifier || 'mod';

  return root => {
    const selector = (node) => {
      if (node.metadata.type === element) {
        if (node.parent.metadata.type === modifier) {
          let list = [];

          postcss.list.comma(node.metadata.name).forEach(elem => {
            list.push('\n' + `${node.parent.selector}` + ' ' + `${node.parent.selector.split('_')[0]}__${elem}`);
          })

          list[0] = list[0].substr(1);

          return list;
        }

        return `.${node.parent.metadata.name}__${node.metadata.name}`;
      }

      if (node.metadata.type === modifier) {
        let isModVal = node.metadata.name.match(/(\w+)\[(\w+)\]/);

        if (!isModVal) {
          return `${node.parent.selector}_${node.metadata.name}`;
        }

        return `${node.parent.selector}_${isModVal[1]}_${isModVal[2]}`;
      }

      return `.${node.metadata.name}`;
    }

    const process = (node) => {
      if (!node.nodes.length) {
        return node;
      }

      node.metadata = {
        type: node.name,
        name: node.params
      };

      const rule = postcss.rule({
        raws: { semicolon: true },
        selector: selector(node),
        source: node.source,
        metadata: node.metadata
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
        if (child.type === 'atrule' && child.name === modifier) {
          return process(child);
        }

        if (child.type === 'atrule' && child.name === element) {
          return process(child);
        }
      });
    }

    root.walkAtRules(component, process);
  }
});