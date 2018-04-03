const {releaseTask, commands} = require('@ayro/commons');
const path = require('path');
const Promise = require('bluebird');

const WORKING_DIR = path.resolve(__dirname, '../');

function lintLibrary() {
  return Promise.coroutine(function* () {
    commands.log('Linting library...');
    yield commands.exec('npm run lint', WORKING_DIR);
  })();
}

function buildLibrary() {
  return Promise.coroutine(function* () {
    commands.log('Building library...');
    yield commands.exec('npm run build-prod', WORKING_DIR);
    commands.log('Building browser library...');
    yield commands.exec('npm run build-browser-prod', WORKING_DIR);
    commands.log('Building WordPress browser library...');
    yield commands.exec('npm run build-browser-wordpress-prod', WORKING_DIR);
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  releaseTask.withWorkingDir(WORKING_DIR);
  releaseTask.withLintTask(lintLibrary);
  releaseTask.withBuildTask(buildLibrary);
  releaseTask.run(process.argv[2], process.argv[3]);
}
