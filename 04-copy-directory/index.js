const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = function fn(pathToDir, pathToDest) {
  fsPromises
    .readdir(pathToDir, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isDirectory()) {
          fsPromises
            .mkdir(path.join(pathToDest, file.name), { recursive: true })
            .then(() => {
              fn(
                path.join(pathToDir, file.name),
                path.join(pathToDest, file.name),
              );
            });
        } else if (file.isFile()) {
          fsPromises
            .copyFile(
              path.join(pathToDir, file.name),
              path.join(pathToDest, file.name),
            )
            .catch((err) => console.log(err));
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

fsPromises
  .rm(path.join(__dirname, 'files-copy'), { force: true, recursive: true })
  .then(() => {
    fsPromises
      .mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
      .then(() => {
        copyDir(
          path.join(__dirname, 'files'),
          path.join(__dirname, 'files-copy'),
        );
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

module.exports = copyDir;
