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
            list.push('\n' + ('' + node.parent.selector) + ' ' + (node.parent.selector.split('_')[0] + '__' + elem));
          });

          list[0] = list[0].substr(1);

          return list;
        }

        return '.' + node.parent.metadata.name + '__' + node.metadata.name;
      }

      if (node.metadata.type === modifier) {
        var isModVal = node.metadata.name.match(/(\w+)\[(\w+)\]/);

        if (!isModVal) {
          return node.parent.selector + '_' + node.metadata.name;
        }

        return node.parent.selector + '_' + isModVal[1] + '_' + isModVal[2];
      }

      return '.' + node.metadata.name;
    };

    var process = function process(node) {
      if (!node.nodes.length) {
        return node;
      }

      node.metadata = {
        type: node.name,
        name: node.params
      };

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
          return process(child);
        }

        if (child.type === 'atrule' && child.name === element) {
          return process(child);
        }
      });
    };

    root.walkAtRules(component, process);
  };
});
module.exports = exports['default'];