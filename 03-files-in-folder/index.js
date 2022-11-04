const path = require('path');
const fs = require('fs');


const dirPath = path.join(__dirname, 'secret-folder');


fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
    console.log('\nИнформация о файлах');
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isDirectory()){
          return true;
        }
        else {
          let fileInf = '';
          fileInf = path.parse(file.name).name + ' - ';
          fileInf += path.extname(file.name).split('.').pop() + ' - ';
          fs.stat(path.join(dirPath, file.name), (error, stats) => {
            if (error) {
              console.log(error);
            }
            else {
              fileInf += (stats.size/1024).toFixed(3) + ' kb';
              console.log(fileInf);
            }
          });
        }
      });
    }
  });