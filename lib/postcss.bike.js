'use strict';

exports.__esModule = true;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _postcss2.default.plugin('postcss-bike', function postcssBike(options) {

  return function (root) {

    options = options || {};

    var selector = function selector(block, elem, modName, modVal) {
      return '.' + block + (elem ? '__' + elem : '') + (modName ? modVal ? '_' + modName + '_' + modVal : '_' + modName : '');
    };

    var addMod = function addMod(className, block, elem, modName, modVal) {
      return className + ' ' + selector(block, elem, modName, modVal).substr(1);
    };

    var process = function process(rule) {
      if (rule.params === undefined) {
        return rule;
      }

      if (!rule.nodes.length) {
        return rule;
      }

      rule.raws.semicolon = true;
      rule.type = 'rule';

      if (rule.name === 'component') {
        rule.selector = selector(rule.params);
      }

      if (rule.name === 'mod') {
        var modVal = rule.params.match(/(\w+)\[(\w+)\]/);

        if (modVal) {
          if (rule.selector) {
            rule.selector = addMod(rule.selector, rule.parent.params, modVal[1], modVal[2]);
          } else {
            rule.selector = selector(rule.parent.params, modVal[1], modVal[2]);
          }
        } else {
          rule.selector = selector(rule.parent.params, '', rule.params);
        }
      }

      if (rule.name === 'elem') {
        rule.selector = selector(rule.parent.params, rule.params);
      }

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