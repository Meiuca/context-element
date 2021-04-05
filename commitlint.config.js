const glob = require('glob');
const { promisify } = require('util');
const path = require('path');

const globPromise = promisify(glob);

async function getFiles(pattern) {
  const globResult = await globPromise(pattern);

  return globResult.map(item => path.basename(item));
}

module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'scope-enum': async () => [
      2,
      'always',
      [
        'eslint',
        'prettier',
        'babel',
        'commitlint',
        'snowpack',
        'web-test-runner',
        'husky',
        'package-json',
        'vscode',
        // 'proposal',
        ...(await getFiles('./src/**/*.js')),
        ...(await getFiles('./test/**/*.js')),
      ],
    ],
  },
};
