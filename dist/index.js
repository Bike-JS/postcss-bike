'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS = {
  component: 'component',
  element: 'elem',
  modifier: 'mod',
  modValSeparator: /(\w+)\[(\w+)\]/
};

exports.default = _postcss2.default.plugin('postcss-bike', function postcssBike() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_OPTIONS;


  options = _extends({}, DEFAULT_OPTIONS, options);

  return function (root) {
    var selector = function selector(node) {
      if (node.metadata.type === options.element) {
        if (node.parent.metadata.type === options.modifier) {
          var list = [];

          _postcss2.default.list.comma(node.metadata.name).forEach(function (elem) {
            list.push('\n' + ('' + node.parent.selector) + ' ' + ('.' + node.metadata.component + '__' + elem));
          });

          list[0] = list[0].substr(1);

          return list;
        }

        return '.' + node.metadata.component + '__' + node.metadata.name;
      }

      if (node.metadata.type === options.modifier) {
        var isModVal = node.params.match(options.modValSeparator);

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

      if (node.name === options.component) {
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
        if (child.type === 'atrule' && child.name === options.modifier) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          };

          return process(child);
        }

        if (child.type === 'atrule' && child.name === options.element) {
          child.metadata = {
            component: rule.metadata.component,
            type: child.name,
            name: child.params
          };

          return process(child);
        }
      });
    };

    root.walkAtRules(options.component, process);
  };
});
module.exports = exports['default'];