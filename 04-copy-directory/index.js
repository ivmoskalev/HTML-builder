const fsPromises = require('fs').promises;
const path = require('path');
const srcDirectory = path.join(__dirname, 'files');
const destDirectory = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  try {
    await fsPromises.rm(dest, { recursive: true, force: true });
    await fsPromises.mkdir(dest, { recursive: true });

    const entries = await fsPromises.readdir(
      src,
      { withFileTypes: true },
      (err, entries) => {
        if (err) {
          console.error('Error occurred:', err);
        }
        return entries;
      },
    );
    entries.forEach((entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      fsPromises.copyFile(srcPath, destPath);
    });
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

copyDir(srcDirectory, destDirectory);
