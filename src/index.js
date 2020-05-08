import postcss from 'postcss';
import { BEM } from './bem';

const DEFAULT_OPTIONS = {
  component: 'component',
  element: 'elem',
  modifier: 'mod',
  modifierRegExp: /([\w\-]+)(?:\[([\w\-]+)\])?/
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

      let selector = '';

      switch (node.metadata.type) {
        case options.component:
          selector = node.metadata.bem();
          break;
        case options.modifier:
          let [, modName, modVal = true] = node.metadata.name.match(options.modifierRegExp);

          node.metadata.mods = { [modName]: modVal };

          if (node.parent.metadata.type === options.element) {
            selector = node.metadata.bem(node.parent.metadata.name, { [modName]: modVal });
          } else if (node.parent.metadata.type === options.modifier) {
            selector = node.metadata.bem({ ...node.parent.metadata.mods, [modName]: modVal });
          } else {
            selector = node.metadata.bem({ [modName]: modVal });
          }
          break;
        case options.element:
          if (node.parent.metadata.type === options.modifier) {
            selector = [node.parent.selector, node.metadata.bem(node.metadata.name)].join(' ');
          } else {
            selector = node.metadata.bem(node.metadata.name);
          }
          break;
      }

      const rule = postcss.rule({
        raws: { semicolon: true },
        selector: selector,
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
