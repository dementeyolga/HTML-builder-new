const copyDir = require('../04-copy-directory/index.js');
const bundleCSS = require('../05-merge-styles/index.js');
const fsPromises = require('fs/promises');
const path = require('path');

console.log(
  '! Если используете VSCode, при пересборке отключайте Live Server, пожалуйста !',
);

const parseHTML = function fn(pathToDir, pathToTemplate, pathToDest) {
  const filesArr = [];

  fsPromises
    .readdir(pathToDir)
    .then((files) => {
      files.forEach((file) => filesArr.push(file));

      return filesArr;
    })
    .then((filesArr) => {
      fsPromises
        .readFile(pathToTemplate, { encoding: 'utf8' })
        .then((template) => {
          let fullHTML = template;

          const promiseChainFromArr = function fn(i) {
            fsPromises
              .readFile(path.join(pathToDir, filesArr[i]), { encoding: 'utf8' })
              .then((data) => {
                fullHTML = fullHTML.replaceAll(
                  `{{${filesArr[i].slice(0, filesArr[i].lastIndexOf('.'))}}}`,
                  data,
                );

                fsPromises
                  .writeFile(pathToDest, fullHTML)
                  .then(() => {
                    if (filesArr[i + 1]) {
                      fn(i + 1);
                    }
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          };

          promiseChainFromArr(0);
        });
    })
    .catch((err) => console.log(err));
};

fsPromises
  .rm(path.join(__dirname, 'project-dist'), { force: true, recursive: true })
  .then(() =>
    fsPromises
      .mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
      .then(() => {
        fsPromises
          .rm(path.join(__dirname, 'project-dist/assets'), {
            force: true,
            recursive: true,
          })
          .then(() => {
            fsPromises
              .mkdir(path.join(__dirname, 'project-dist/assets'), {
                recursive: true,
              })
              .then(() => {
                copyDir(
                  path.join(__dirname, 'assets'),
                  path.join(__dirname, 'project-dist/assets'),
                );
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .then(() => {
        fsPromises
          .rm(path.join(__dirname, 'project-dist/style.css'), { force: true })
          .then(() => {
            bundleCSS(
              path.join(__dirname, 'styles'),
              path.join(__dirname, 'project-dist/style.css'),
            );
          })
          .catch((err) => console.log(err));
      })
      .then(() => {
        fsPromises
          .rm(path.join(__dirname, 'project-dist/index.html'), { force: true })
          .then(() => {
            parseHTML(
              path.join(__dirname, 'components'),
              path.join(__dirname, 'template.html'),
              path.join(__dirname, 'project-dist/index.html'),
            );
          })
          .catch((err) => console.log(err));
      }),
  );
