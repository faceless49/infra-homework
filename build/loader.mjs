import yaml from 'yaml';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from "node:url";

export async function load(url, context, nextLoad) {
  const ext = path.extname(url);

  if (ext === '.yml' || ext === '.yaml') {
    try {
      const pathNameFile = fileURLToPath(url);

      const contentFile = await fs.readFile(pathNameFile, 'utf8');

      return {
        format: 'json',
        shortCircuit: true,
        source: JSON.stringify(yaml.parse(contentFile))
      };
    } catch (err) {
      throw err.message;
    }
  }

  return nextLoad(url);
}