import fs from 'node:fs/promises';
import path from 'node:path';
const INDEX_FILE = 'index.js'
const root = path.normalize('src/components'); // src\components
const dirs = await fs.readdir(root); // [ 'button', 'footer', 'header', 'list' ]
const checkFile = (files, fileName) => {
  const res = files.find((file) => file == fileName);

  if (!res) {
    return fileName;
  }
}


const checkDir = async (component) => {
  let fileName;

  const files = await fs.readdir(path.join(root, component)); // dirs[0] = button = [ 'button.js', 'index.js' ]
  fileName = checkFile(files, `${component}.js`);

  if (fileName) {
    console.log(`Structure of component ${component} is broken! Missing ${fileName}`);
  }
  fileName = checkFile(files, `${INDEX_FILE}`);

  if (fileName) {
    console.log( `Structure of component ${component} is broken! Missing ${fileName}`);
  }
}



const result = await Promise.allSettled(dirs.map(dir => checkDir(dir)));

const errors = result.filter(res => (res.value != null)).map(res => res.value);

if (errors.length > 0) {
  console.dir(errors)
  process.exit(1);
}
process.exit(0);