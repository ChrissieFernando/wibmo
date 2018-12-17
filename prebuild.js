/* eslint-disable no-console */

const fs = require('fs');

// console.log(process.argv[2].slice(2));

if (
  process.argv[2] &&
  (process.argv[2] === '--dev' ||
    process.argv[2] === '--prod' ||
    process.argv[2] === '--stage')
) {
  fs.writeFile('./app/utils/config.js', '', () => {
    fs.copyFile(
      `./env/${process.argv[2].slice(2)}.env.js`,
      './app/utils/config.js',
      err => {
        if (err) throw err;
        // console.log("source.txt was copied to destination.txt");
      },
    );
  });
} else {
  console.log('Invalid arguments.');
}
