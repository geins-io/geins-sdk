const { execSync } = require('child_process');
const { join } = require('path');
const fs = require('fs');

// Function to recursively find and delete directories
function deleteDirsRecursively(baseDir, dirName) {
  const dirs = [];

  function findDirs(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const fullPath = join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file === dirName) {
          dirs.push(fullPath);
        } else {
          findDirs(fullPath);
        }
      }
    });
  }

  findDirs(baseDir);

  dirs.forEach((dir) => {
    console.log(`Deleting: ${dir}`);
    fs.rmdirSync(dir, { recursive: true });
  });
}

// Remove node_modules directories
console.log('Removing all node_modules directories...');
deleteDirsRecursively(__dirname, 'node_modules');

// Remove dist/build directories
console.log('Removing all dist/build directories...');
deleteDirsRecursively(__dirname, 'dist');
deleteDirsRecursively(__dirname, 'build');

console.log('Nuking complete!');
