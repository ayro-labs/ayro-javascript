/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const {commands, release} = require('release-n-publish');
const path = require('path');

const WORKING_DIR = path.resolve();

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
  release.setWorkingDir(WORKING_DIR);
  release.setLintTask(lintLibrary);
  release.setBuildTask(buildLibrary);
  release.run(process.argv[2]);
}
