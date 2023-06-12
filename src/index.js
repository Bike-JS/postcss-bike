import postcss from 'postcss';
import { BEM } from './bem';

const DEFAULT_OPTIONS = {
  component: 'component',
  element: 'elem',
  modifier: 'mod',
  modifierRegExp: /([\w\-]+)(?:\[([\w\-| ]+)\])?/
};

export default postcss.plugin('postcss-bike', (options = DEFAULT_OPTIONS) => {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  return (root) => {
    const process = (node) => {
      if (node.nodes.length === 0) {
        return node;
      }

      if (node.name === options.component) {
        node.metadata = { bem: BEM(node.params), type: options.component };
      }

      let selectors = [];

      node.metadata.names = node.metadata.name ? node.metadata.name.split(',').map(val => val.trim()) : [''];
      node.metadata.names.forEach(metaName => {
        switch (node.metadata.type) {
          case options.component:
            selectors.push(node.metadata.bem());
            break;
          case options.modifier:
            let [, modName, modVals = true] = metaName.match(options.modifierRegExp);

            // Handle possible multiple comma-delimited modifier values.
            modVals = typeof modVals === 'string' ? modVals.split('|').map(val => val.trim()) : [modVals];
            modVals.forEach(modVal => {
              node.metadata.mods = { [modName]: modVal };

              if (node.parent.metadata.type === options.element) {
                selectors.push(node.metadata.bem(node.parent.metadata.name, { [modName]: modVal }));
              } else if (node.parent.metadata.type === options.modifier) {
                selectors.push(node.metadata.bem({ ...node.parent.metadata.mods, [modName]: modVal }));
              } else {
                selectors.push(node.metadata.bem({ [modName]: modVal }));
              }
            });
            break;
          case options.element:
            if (node.parent.metadata.type === options.modifier) {
              node.parent.selectors.forEach(parentSelector => {
                selectors.push([parentSelector, node.metadata.bem(metaName)].join(' '));
              });
            } else {
              selectors.push(node.metadata.bem(metaName));
            }
            break;
        }
      });

      const rule = postcss.rule({
        raws: { semicolon: true },
        selectors: selectors,
        source: node.source,
        metadata: node.metadata
      });

      node.walkDecls(decl => {
        const declClone = postcss.decl({
          raws: { before: '\n  ', between: ': ' },
          source: decl.source,
          prop: decl.prop,
          value: decl.value
        });

        decl.replaceWith(declClone);
      });

      rule.append(node.nodes);
      node.remove();
      root.append(rule);

      rule.walkAtRules(child => {
        if (![options.element, options.modifier].includes(child.name)) {
          return;
        }

        child.metadata = {
          type: child.name,
          name: child.params,
          bem: rule.metadata.bem,
        };

        return process(child);
      });
    };

    root.walkAtRules(options.component, process);
  };
})
