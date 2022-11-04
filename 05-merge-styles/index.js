const path = require('path');
const fs = require('fs');


const dirPath = path.join(__dirname, 'styles');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

function mergeStyles (dirPath, output) {
  fs.readdir(dirPath, 
    { withFileTypes: true },
    (err, files) => {
      console.log('\nСоздание bundler.css');
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          if (file.isDirectory()){
            return true;
          }
          else {
            if (path.extname(file.name) === '.css') {
              const input = fs.createReadStream(path.join(dirPath, file.name), 'utf-8');
              input.pipe(output);
              console.log(`Содержимое ${file.name} скопировано и помещено в bundle.css`);
            }
            else {console.log(`${file.name} не является таблицей стилей`);}
          }
        }
        );
      }
    });
}

mergeStyles(dirPath, output);
