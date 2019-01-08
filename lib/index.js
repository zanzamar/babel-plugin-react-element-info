'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  var defaultPrefix = 'data-qa';
  var prefix = void 0;
  var filenameAttr = void 0;
  var nodeNameAttr = void 0;

  var visitor = {
    Program: function Program(path, state) {
      if (state.opts.prefix) {
        prefix = 'data-' + state.opts.prefix;
      } else {
        prefix = defaultPrefix;
      }
      filenameAttr = prefix + '-file';
      nodeNameAttr = prefix + '-node';
    },
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      var attributes = path.container.openingElement.attributes;

      // ignore if we are a react fragment
      var isFragment = path.container && path.container.openingElement && path.container.openingElement.name && path.container.openingElement.name.object && path.container.openingElement.name.object.name === 'React' && path.container.openingElement.name.property && path.container.openingElement.name.property.name === 'Fragment';

      var newAttributes = [];

      if (path.container && path.container.openingElement && path.container.openingElement.name && path.container.openingElement.name.name) {
        newAttributes.push(t.jSXAttribute(t.jSXIdentifier(nodeNameAttr), t.stringLiteral(path.container.openingElement.name.name)));
      }

      if (state.file && state.file.opts && state.file.opts.basename) {
        newAttributes.push(t.jSXAttribute(t.jSXIdentifier(filenameAttr), t.stringLiteral(state.file.opts.basename)));
      }

      if (!isFragment) {
        attributes.push.apply(attributes, newAttributes);
      }
    }
  };

  return {
    visitor: visitor
  };
};