// @flow weak

export default function({types: t}) {
  const defaultPrefix = 'data-qa';
  let prefix;
  let filenameAttr;
  let nodeNameAttr;

  const visitor = {
    Program(path, state) {
      if (state.opts.prefix) {
        prefix = `data-${state.opts.prefix}`;
      } else {
        prefix = defaultPrefix;
      }
      filenameAttr = `${prefix}-file`;
      nodeNameAttr = `${prefix}-node`;
    },
    JSXOpeningElement(path, state) {
      const attributes = path.container.openingElement.attributes;

      // ignore if we are a react fragment
      const isFragment = path.container && path.container.openingElement &&
        path.container.openingElement.name &&
        path.container.openingElement.name.object &&
        path.container.openingElement.name.object.name === 'React' &&
        path.container.openingElement.name.property &&
        path.container.openingElement.name.property.name === 'Fragment'
      ;

      const newAttributes = [];

      if (path.container && path.container.openingElement &&
        path.container.openingElement.name &&
        path.container.openingElement.name.name) {
        newAttributes.push(t.jSXAttribute(
          t.jSXIdentifier(nodeNameAttr),
          t.stringLiteral(path.container.openingElement.name.name))
        );
      }

      if (state.file && state.file.opts && state.file.opts.basename) {
        newAttributes.push(t.jSXAttribute(
          t.jSXIdentifier(filenameAttr),
          t.stringLiteral(state.file.opts.basename))
        );
      }

      if (!isFragment) {
        attributes.push(...newAttributes);
      }
    },
  };

  return {
    visitor,
  };
}
