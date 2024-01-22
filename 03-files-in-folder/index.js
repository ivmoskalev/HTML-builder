const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    stdout.write(err.message);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExt = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExt}`);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          stdout.write(err.message);
          return;
        }

        const fileSizeKb = stats.size / 1024;
        stdout.write(`${fileName} - ${fileExt} - ${fileSizeKb}kb\n`);
      });
    }
  });
});
