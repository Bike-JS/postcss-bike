'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('postcss-bike', function postcssBike() {

  return function (root) {
    var setSelector = function setSelector(node) {
      if (node.name === 'elem') {
        var isComponentMod = node.parent.selector.match(/^\.(\w+)\_(\w+)$/);
        var isComponentModVal = node.parent.selector.match(/^\.(\w+)\_(\w+)\_(\w+)$/);
        var isElemMod = node.parent.selector.match(/^\.(\w+)\_\_(\w+)\_(\w+)$/);
        var isElemModVal = node.parent.selector.match(/^\.(\w+)\_\_(\w+)\_(\w+)\_(\w+)$/);

        if (isComponentMod || isComponentModVal || isElemMod || isElemModVal) {

          var list = [];

          _postcss2.default.list.comma(node.params).forEach(function (elem) {
            list.push('\n' + ('' + node.parent.selector) + ' ' + (node.parent.selector.split('_')[0] + '__' + elem));
          });

          list[0] = list[0].substr(1);

          return list;
        }

        return node.parent.selector + '__' + node.params;
      }

      if (node.name === 'mod') {
        var isModVal = node.params.match(/(\w+)\[(\w+)\]/);

        if (!isModVal) {
          return node.parent.selector + '_' + node.params;
        }

        return node.parent.selector + '_' + isModVal[1] + '_' + isModVal[2];
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