import {cp, rm, stat} from 'fs/promises';
import path from 'path';

const cwd = process.cwd();
const source = path.join(cwd, '.next', 'export');
const destination = path.join(cwd, 'out');

async function ensureSourceExists() {
  try {
    const stats = await stat(source);
    if (!stats.isDirectory()) {
      throw new Error('The export source exists but is not a directory.');
    }
  } catch (error) {
    throw new Error(
      "Static export artifacts were not found. Run 'npm run build' before exporting."
    );
  }
}

async function main() {
    await ensureSourceExists();
    await rm(destination, {recursive: true, force: true});
    await cp(source, destination, {recursive: true});
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
