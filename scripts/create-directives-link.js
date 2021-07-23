const { mkdirSync, existsSync, copyFileSync } = require('fs');
const { resolve, dirname, basename } = require('path');
const glob = require('glob');

const dirc = resolve(__dirname, '../directives');

if (!existsSync(dirc)) mkdirSync(dirc);

glob.sync(`${dirname(require.resolve('lit'))}/directives/*`).forEach(file => {
  copyFileSync(file, resolve(dirc, basename(file)));
});
