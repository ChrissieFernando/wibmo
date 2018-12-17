/* eslint-disable no-console */

const fs = require('fs');

// console.log(process.argv[2].slice(2));

fs.writeFile('./app/utils/config.js', 0, () => {
  fs.copyFile(`./env/dev.env.js`, './app/utils/config.js', err => {
    if (err) throw err;
  });
});
