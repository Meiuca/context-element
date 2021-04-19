const { spawn } = require('child_process');
const { Writable } = require('stream');
const { Repository } = require('nodegit');
const {
  huskyController: { commands, mainFolders },
} = require('./package.json');

const mainFolderRegexp = RegExp(mainFolders);

const spawnOptions = {
  shell: process.env.OS && process.env.OS.includes('Windows'),
};

function runPreCommit() {
  const preCommit = commands.map(command => ({
    subprocess: spawn(command, spawnOptions),
    name: command,
  }));

  preCommit.forEach(command => {
    console.log('Running:', command.name);

    let logs = '';

    command.subprocess.stdio.forEach(std => {
      if (std instanceof Writable) {
        std.on('data', chunk => {
          logs += chunk;
        });
      }
    });

    command.subprocess.on('exit', code => {
      if (code !== 0) {
        console.log(`\n\n${logs}`);

        process.exit(code);
      }
    });
  });
}

(async () => {
  const repo = await Repository.open('.git');

  const importantFileWasCommitted = (await repo.getStatus()).some(
    file => !file.inWorkingTree() && mainFolderRegexp.test(file.path()),
  );

  if (importantFileWasCommitted) {
    runPreCommit();
  } else {
    console.log('husky-controller:', 'pre-commit is not required.', 'Skipping...\n');
  }
})();
