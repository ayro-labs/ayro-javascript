'use strict';

const {releaseTask, commands} = require('@ayro/commons');
const path = require('path');

const WORKING_DIR = path.resolve(__dirname, '../');

async function lintLibrary() {
  commands.log('Linting library...');
  await commands.exec('npm run lint', WORKING_DIR);
}

async function buildLibrary() {
  commands.log('Building library...');
  await commands.exec('npm run build-prod', WORKING_DIR);
}

// Run this if call directly from command line
if (require.main === module) {
  releaseTask.withWorkingDir(WORKING_DIR);
  releaseTask.withLintTask(lintLibrary);
  releaseTask.withBuildTask(buildLibrary);
  releaseTask.run(process.argv[2], process.argv[3]);
}
