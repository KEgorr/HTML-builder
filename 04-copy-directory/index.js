const path = require('path');
const fs = require('fs');
const { mkdir, rm } = require('fs/promises');


const dirPath = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

async function copyDir(dirName, newDirName) {
  await rm(newDirName,   {recursive: true, force: true});
  await mkdir(newDirName, {recursive: true});
  fs.readdir(dirName, 
    { withFileTypes: true },
    (err, files) => {
      console.log('\nКопирование файлов');
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          if (file.isDirectory()) {
            let dirInDirPath = path.join(dirName, file.name);
            let newDirInDirPath = path.join(newDirName, file.name);
            copyDir(dirInDirPath, newDirInDirPath);
          }
          else {
            fs.copyFile(path.join(dirName, file.name), path.join(newDirName, file.name), err => {
              if(err) throw err;
              console.log('Файл успешно скопирован');
            });
          }
        });
      }
    });
}

copyDir(dirPath, newDir);
