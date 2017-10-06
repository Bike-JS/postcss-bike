'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('postcss-bike', function postcssBike() {

  return function (root) {
    var setSelector = function setSelector(node) {
      if (node.name === 'elem') {
        return node.parent.selector + '__' + node.params;
      }

      if (node.name === 'mod') {
        var modVal = node.params.match(/(\w+)\[(\w+)\]/);

        if (!modVal) {
          return node.parent.selector + '_' + node.params;
        }

        return node.parent.selector + '_' + modVal[1] + '_' + modVal[2];
      }

      return '.' + node.params;
    };

    var process = function process(node) {
      if (node.params === undefined) {
        return node;
      }

      if (!node.nodes.length) {
        return node;
      }

      var rule = _postcss2.default.rule({
        raws: { semicolon: true },
        selector: setSelector(node),
        source: node.source
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
        if (child.type === 'atrule' && child.name === 'mod') {
          return process(child);
        }

        if (child.type === 'atrule' && child.name === 'elem') {
          return process(child);
        }
      });
    };

    root.walkAtRules('component', process);
  };
});
module.exports = exports['default'];