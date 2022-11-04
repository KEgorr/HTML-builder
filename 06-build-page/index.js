const path = require('path');
const fs = require('fs');
const { mkdir, rm } = require('fs/promises');


const newDir = path.join(__dirname, 'project-dist');
const dirPathAssets = path.join(__dirname, 'assets');

fs.mkdir(newDir,
  {recursive: true},
  err => {
    if (err) throw err;
  });

const template= fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

let data = '';

template.on('data', chunk => {
  data += chunk;
  fs.readdir(componentsPath, 
    { withFileTypes: true },
    (err, files) => {
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          if (data.includes(path.parse(file.name).name)) {
            const input = fs.createReadStream(path.join(componentsPath, file.name), 'utf-8');
            input.on('data', chunk => {
              data = data.replace('{{'+ path.parse(file.name).name +'}}', chunk);
              fs.writeFile(
                path.join(__dirname, 'project-dist', 'index.html'),
                data,
                (err) => {
                  if (err) throw err;
                }
              );
            });
          }
        });
      }
    });
}
);

const componentsPath = path.join(__dirname, 'components');
const newDirAssets = path.join(newDir, 'assets');

async function copyDir(dirName, newDirName) {
  await rm(newDirName,   {recursive: true, force: true});
  await mkdir(newDirName, {recursive: true});
  fs.readdir(dirName, 
    { withFileTypes: true },
    (err, files) => {
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
            });
          }
        });
      }
    });
}

copyDir(dirPathAssets, newDirAssets);

const dirPathStyle = path.join(__dirname, 'styles');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

function mergeStyles (dirPath, output) {
  fs.readdir(dirPath, 
    { withFileTypes: true },
    (err, files) => {
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
            }
            else {console.log(`${file.name} не является таблицей стилей`);}
          }
        }
        );
      }
    });
}

mergeStyles(dirPathStyle, output);

console.log(`\n Актуальная сборка создана и помещена в "${newDir}" \n`);