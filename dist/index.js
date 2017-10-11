'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('postcss-bike', function postcssBike(options) {

  options = options || {};

  var component = options.component || 'component';
  var element = options.element || 'elem';
  var modifier = options.modifier || 'mod';

  return function (root) {
    var selector = function selector(node) {
      if (node.metadata.type === element) {
        if (node.parent.metadata.type === modifier) {
          var list = [];

          _postcss2.default.list.comma(node.metadata.name).forEach(function (elem) {
            list.push('\n' + ('' + node.parent.selector) + ' ' + ('.' + node.metadata.component + '__' + elem));
          });

          list[0] = list[0].substr(1);

          return list;
        }

        return '.' + node.metadata.component + '__' + node.metadata.name;
      }

      if (node.metadata.type === modifier) {
        var isModVal = node.params.match(/(\w+)\[(\w+)\]/);

        if (!isModVal) {
          return node.parent.selector + '_' + node.metadata.name;
        }

        node.metadata.name = isModVal[1];
        node.metadata.value = isModVal[2];

        return node.parent.selector + '_' + node.metadata.name + '_' + node.metadata.value;
      }

      return '.' + node.metadata.component;
    };

    var process = function process(node) {
      if (!node.nodes.length) {
        return node;
      }

      if (node.name === component) {
        node.metadata = { component: node.params };
      }

      var rule = _postcss2.default.rule({
        raws: { semicolon: true },
        selector: selector(node),
        source: node.source,
        metadata: node.metadata
      });

      node.walkDecls(function (decl) {
        var declClone = _postcss2.default.decl({
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

      rule.each(function (child) {
        if (child.type === 'atrule' && child.name === modifier) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          };

          return process(child);
        }

        if (child.type === 'atrule' && child.name === element) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          };

          return process(child);
        }
      });
    };

    root.walkAtRules(component, process);
  };
});
module.exports = exports['default'];