const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
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
      const filePath = path.join(stylesDir, file.name);
      const readStream = fs.createReadStream(filePath, 'utf8');
      readStream.pipe(writeStream);
    }
  });
});
