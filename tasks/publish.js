'use strict';

const projectPackage = require('../package');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const GitHubApi = require('github');
const Promise = require('bluebird');

const REPOSITORY_NAME = 'chatz-javascript';
const REPOSITORY_OWNER = 'chatz-io';
const WORKING_DIR = path.resolve(__dirname, '../');
const TEMP_DIR = '/tmp';
const TEMP_REPOSITORY_DIR = `${TEMP_DIR}/${REPOSITORY_NAME}`;

const execAsync = Promise.promisify(childProcess.exec);

const gitHubApi = new GitHubApi();
gitHubApi.authenticate({
  type: 'token',
  token: '49aa7a1e572c681a5f7773983359a57e71a15b30',
});

function exec(command, options) {
  return execAsync(command, options || {cwd: WORKING_DIR});
}

function checkoutTag(version) {
  return Promise.coroutine(function*() {
    console.log(`Checking out the tag ${version}...`);
    yield exec(`git checkout ${version}`);
  })();
}

function buildProduction() {
  return Promise.coroutine(function*() {
    console.log('Building lib...');
    yield exec('npm run build-prod');
    console.log('Building browser lib...');
    yield exec('npm run build-browser-prod');
  })();
}

function prepareRepository() {
  return Promise.coroutine(function*() {
    console.log('Preparing Github repository...');
    yield exec(`rm -rf ${TEMP_REPOSITORY_DIR}`);
    yield exec(`git clone https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}.git ${REPOSITORY_NAME}`, {cwd: TEMP_DIR});
    yield exec('rm -rf *', {cwd: TEMP_REPOSITORY_DIR});
  })();
}

function copyFiles(version) {
  return Promise.coroutine(function*() {
    console.log('Copying files...');
    yield exec(`cp dist/${projectPackage.name}.min.js ${TEMP_REPOSITORY_DIR}/${projectPackage.name}-${projectPackage.version}.min.js`)
  })();
}

function pushFiles(version) {
  return Promise.coroutine(function*() {
    console.log('Committing, tagging and pushing files to Github repository...');
    yield exec('git add .', {cwd: TEMP_REPOSITORY_DIR});
    yield exec(`git commit -am 'Release ${version}'`, {cwd: TEMP_REPOSITORY_DIR});
    yield exec(`git tag ${version}`, {cwd: TEMP_REPOSITORY_DIR});
    yield exec('git push origin master', {cwd: TEMP_REPOSITORY_DIR});
    yield exec('git push --tags', {cwd: TEMP_REPOSITORY_DIR});
  })();
}

function createRelease(version) {
  return Promise.coroutine(function*() {
    console.log('Creating Github release...');
    const createRelease = Promise.promisify(gitHubApi.repos.createRelease);
    yield createRelease({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
      tag_name: version,
      name: `Release ${version}`,
    });
  })();
}

function publishToNpm() {
  return Promise.coroutine(function*() {
    console.log('Publishing to npm...');
    yield exec('npm publish');
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  Promise.coroutine(function*() {
    try {
      const version = projectPackage.version;
      console.log(`Publishing version ${version} to Github and npm...`);
      yield checkoutTag(version);
      yield buildProduction();
      yield prepareRepository();
      yield copyFiles(version);
      yield pushFiles(version);
      yield createRelease(version);
      yield publishToNpm();
      console.log(`Version ${version} published with success!`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
