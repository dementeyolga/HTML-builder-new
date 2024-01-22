const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

function logDirFiles(pathToDir) {
  fsPromises
    .readdir(pathToDir, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(path.join(pathToDir, file.name), (err, stats) => {
            if (err) console.log(err);
            let name = file.name;
            console.log(
              `${name.slice(0, file.name.lastIndexOf('.'))} ${name.slice(
                file.name.lastIndexOf('.'),
              )} ${Math.trunc((stats.size / 1024) * 1000) / 1000}kb`,
            );
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

logDirFiles(path.join(__dirname, 'secret-folder'));
