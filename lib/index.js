import postcss from 'postcss';

const DEFAULT_OPTIONS = {
  component: 'component',
  element: 'elem',
  modifier: 'mod',
  modValSeparator: /(\w+)\[(\w+)\]/
};

export default postcss.plugin('postcss-bike', function postcssBike(options = DEFAULT_OPTIONS) {

  options = { ...DEFAULT_OPTIONS, ...options };

  return root => {
    const selector = (node) => {
      if (node.metadata.type === options.element) {
        if (node.parent.metadata.type === options.modifier) {
          let list = [];

          postcss.list.comma(node.metadata.name).forEach(elem => {
            list.push('\n' + `${node.parent.selector}` + ' ' + `.${node.metadata.component}__${elem}`);
          })

          list[0] = list[0].substr(1);

          return list;
        }

        return `.${node.metadata.component}__${node.metadata.name}`;
      }

      if (node.metadata.type === options.modifier) {
        let isModVal = node.params.match(options.modValSeparator);

        if (!isModVal) {
          return `${node.parent.selector}_${node.metadata.name}`;
        }

        node.metadata.name = isModVal[1];
        node.metadata.value = isModVal[2];

        return `${node.parent.selector}_${node.metadata.name}_${node.metadata.value}`;
      }

      return `.${node.metadata.component}`;
    }

    const process = (node) => {
      if (!node.nodes.length) {
        return node;
      }

      if (node.name === options.component) {
        node.metadata = { component: node.params };
      }

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
        if (child.type === 'atrule' && child.name === options.modifier) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          }

          return process(child);
        }

        if (child.type === 'atrule' && child.name === options.element) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          }

          return process(child);
        }
      });
    }

    root.walkAtRules(options.component, process);
  }
});