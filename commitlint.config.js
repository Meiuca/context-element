const glob = require('glob');
const { promisify } = require('util');
const path = require('path');

const globPromise = promisify(glob);

async function getFiles(pattern, prefix) {
  const globResult = await globPromise(pattern);

  return globResult.map(item => prefix + path.basename(item));
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
        'server',
        'vscode',
        'husky-controller',
        // 'proposal',
        ...(await getFiles('./src/*.js', 'src#')),
        ...(await getFiles('./test/*.js', 'test#')),
      ],
    ],
  },
};
