const rules = {
  STRICT: 'strict',
  SOFT: 'soft'
}

if (PROJECT === 'target') {
  const someCamelVariable = globalThis.ENVIRONMENT;
  console.log(`target code ${someCamelVariable} with ${rules.STRICT}`);
}

if (globalThis.IS_STAGE) {
  const a = 1;
  const b = 5;
  console.log(add(a ,b));
  console.log(`Running ${PROJECT} into stage environment`);
}

function add(a, b) {
  return a + b;
}
