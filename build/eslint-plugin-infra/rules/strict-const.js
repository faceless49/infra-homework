export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Runtime constants have to be used with globalThis'
    },
    messages: {
      runtime: 'Wrong usage of runtime const, please use globalThis.{{name}}',
      buildtime: 'Wrong usage of buildtime const, please use {{name}} without globalThis'
    },
    schema: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            'buildTimeConstants': { type: 'array' }
          }
        }
      ]
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const filtered = (context.options[0] && context.options[0].buildTimeConstants) || [];
    return {
      Program: (node) => {
        if (!sourceCode.text) {
          return;
        }
        const scope = sourceCode.getScope(node);
        const implicit = scope.implicit.left || [];

        const upperCaseImplicit = implicit.filter(item => /^[A-Z_]+$/.test(item.identifier.name));

        upperCaseImplicit.forEach(item => {
          if (!filtered.includes(item.identifier.name)) {
            context.report({
              node: item.identifier,
              messageId: 'runtime',
              data: { name: item.identifier.name }
            });
          }
        });
        const globalThisVars = implicit.filter(item => item.identifier.name === 'globalThis')

        globalThisVars.forEach(item => {
          const parentNode = item.identifier.parent;

          if (parentNode && filtered.includes(parentNode.property.name)) {
            context.report({
              node: parentNode.property,
              messageId: 'buildtime',
              data: { name: parentNode.property.name}
            })
          }
        })
      }
    };
  }
};