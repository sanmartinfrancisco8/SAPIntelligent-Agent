import {cp, mkdir, readdir, rm, stat, writeFile} from 'fs/promises';
import path from 'path';

const cwd = process.cwd();
const serverAppDir = path.join(cwd, '.next', 'server', 'app');
const nextStaticDir = path.join(cwd, '.next', 'static');
const destination = path.join(cwd, 'out');
const fallback404 = path.join(cwd, '404.html');

async function ensureBuildArtifacts() {
  try {
    const stats = await stat(serverAppDir);
    if (!stats.isDirectory()) {
      throw new Error('Server app build artifacts were not found.');
    }
  } catch {
    throw new Error("Static build artifacts were not found. Run 'npm run build' before exporting.");
  }
}

async function copyFile(source, target) {
  await mkdir(path.dirname(target), {recursive: true});
  await cp(source, target, {force: true, recursive: true});
}

async function copyPreRenderedPages() {
  async function walk(currentDir) {
    const entries = await readdir(currentDir, {withFileTypes: true});

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile()) {
        if (entry.name.endsWith('.html')) {
          const relativePath = path.relative(serverAppDir, fullPath);
          let destinationRelative;

          if (entry.name === '_not-found.html') {
            destinationRelative = '404.html';
          } else if (entry.name === 'index.html') {
            destinationRelative = relativePath;
          } else {
            const withoutExtension = entry.name.slice(0, -'.html'.length);
            const dirName = path.dirname(relativePath);
            destinationRelative = path.join(dirName === '.' ? '' : dirName, withoutExtension, 'index.html');
          }

          const destinationPath = path.join(destination, destinationRelative);
          await copyFile(fullPath, destinationPath);
        } else if (entry.name === 'favicon.ico') {
          await copyFile(fullPath, path.join(destination, 'favicon.ico'));
        }
      }
    }
  }

  await walk(serverAppDir);
}

async function copyNextStaticAssets() {
  try {
    const stats = await stat(nextStaticDir);
    if (!stats.isDirectory()) {
      return;
    }
  } catch {
    return;
  }

  await copyFile(nextStaticDir, path.join(destination, '_next', 'static'));
}

async function ensureFallbackFiles() {
  const indexPath = path.join(destination, 'index.html');
  try {
    await stat(indexPath);
  } catch {
    await writeFile(
      indexPath,
      `<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="utf-8" />\n  <title>SAP Intelligent Agent</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <style>body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;color:#f8fafc;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:2rem;text-align:center}a{color:#38bdf8}.card{background:rgba(15,23,42,0.6);border-radius:1rem;border:1px solid rgba(148,163,184,0.4);padding:2.5rem;max-width:32rem;box-shadow:0 20px 45px rgba(15,23,42,0.55);}h1{font-size:2rem;margin-bottom:1rem}p{line-height:1.6;margin-bottom:1.5rem}</style>\n</head>\n<body>\n  <div class="card">\n    <h1>Aplicación en preparación</h1>\n    <p>El paquete exportado no contiene páginas estáticas generadas automáticamente por Next.js. Sube la carpeta <code>out</code> tras ejecutar <code>npm run build</code> y <code>npm run export</code>, o despliega el proyecto como una aplicación Node.js para disfrutar de todas las funcionalidades.</p>\n    <p>Consulta la documentación del proyecto para ver las opciones de despliegue.</p>\n  </div>\n</body>\n</html>\n`,
      'utf8'
    );
  }

  const notFoundPath = path.join(destination, '404.html');
  try {
    await stat(notFoundPath);
  } catch {
    try {
      await copyFile(fallback404, notFoundPath);
    } catch {
      // Ignore if there is no custom 404 page to copy.
    }
  }
}

async function main() {
  await ensureBuildArtifacts();
  await rm(destination, {recursive: true, force: true});
  await mkdir(destination, {recursive: true});
  await copyPreRenderedPages();
  await copyNextStaticAssets();
  await ensureFallbackFiles();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
