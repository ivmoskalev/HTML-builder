const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

function createProjectDist() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const stylesPath = path.join(__dirname, 'styles');
  const assetsPath = path.join(__dirname, 'assets');

  fs.mkdir(projectDistPath, { recursive: true }, (err) => {
    if (err) return console.error(err);

    processTemplate(templatePath, componentsPath, projectDistPath);
    compileStyles(stylesPath, projectDistPath);
    copyDir(assetsPath, path.join(projectDistPath, 'assets'));
  });
}

function processTemplate(templatePath, componentsPath, projectDistPath) {
  fs.readFile(templatePath, 'utf-8', (err, data) => {
    if (err) return console.error(err);

    let templateContent = data;

    const tagNames = data.match(/{{\w+}}/g) || [];
    let componentsProcessed = 0;

    tagNames.forEach((tag) => {
      const tagName = tag.slice(2, -2);
      const componentPath = path.join(componentsPath, `${tagName}.html`);

      fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
        if (err) {
          console.error(`Error reading component ${tagName}: ${err}`);
        } else {
          templateContent = templateContent.replace(
            new RegExp(tag, 'g'),
            componentContent,
          );
        }

        componentsProcessed++;
        if (componentsProcessed === tagNames.length) {
          fs.writeFile(
            path.join(projectDistPath, 'index.html'),
            templateContent,
            (err) => {
              if (err) console.error(err);
            },
          );
        }
      });
    });
  });
}

function compileStyles(stylesPath, projectDistPath) {
  const outputFile = path.join(projectDistPath, 'style.css');

  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading styles directory:', err);
      return;
    }
    if (files.length === 0) {
      console.error('No styles found in styles directory.');
      return;
    }
    const writeStream = fs.createWriteStream(outputFile);

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf8');
        readStream.pipe(writeStream);
      }
    });
  });
}

async function copyDir(src, dest) {
  try {
    await fsPromises.rm(dest, { recursive: true, force: true });
    await fsPromises.mkdir(dest, { recursive: true });

    const entries = await fsPromises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('An error occurred while copying the directory:', err);
  }
}

createProjectDist();
