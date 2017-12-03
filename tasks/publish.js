const projectPackage = require('../package');
const utils = require('./utils');
const path = require('path');
const GitHubApi = require('github');
const Promise = require('bluebird');

const REPOSITORY_NAME = 'ayro-javascript';
const REPOSITORY_OWNER = 'ayrolabs';
const WORKING_DIR = path.resolve(__dirname, '../');
const TEMP_DIR = '/tmp';
const TEMP_REPOSITORY_DIR = `${TEMP_DIR}/${REPOSITORY_NAME}`;

const gitHubApi = new GitHubApi();
gitHubApi.authenticate({
  type: 'token',
  token: process.env.GITHUB_ACCESS_TOKEN,
});

function exec(command, dir) {
  return utils.exec(command, dir || WORKING_DIR);
}

function checkoutTag(version) {
  return Promise.coroutine(function* () {
    utils.log(`Checking out the tag ${version}...`);
    yield exec(`git checkout ${version}`);
  })();
}

function buildLibrary() {
  return Promise.coroutine(function* () {
    utils.log('Linting library...');
    yield exec('npm run lint');
    utils.log('Building library...');
    yield exec('npm run build-prod');
    utils.log('Building browser library...');
    yield exec('npm run build-browser-prod');
  })();
}

function prepareRepository() {
  return Promise.coroutine(function* () {
    utils.log('Preparing Github repository...');
    yield exec(`rm -rf ${TEMP_REPOSITORY_DIR}`);
    yield exec(`git clone https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}.git ${REPOSITORY_NAME}`, {cwd: TEMP_DIR});
    yield exec('rm -rf *', TEMP_REPOSITORY_DIR);
  })();
}

function copyFiles() {
  return Promise.coroutine(function* () {
    utils.log('Copying files...');
    yield exec(`cp dist/${projectPackage.name}.min.js ${TEMP_REPOSITORY_DIR}/${projectPackage.name}-${projectPackage.version}.min.js`);
  })();
}

function pushFiles(version) {
  return Promise.coroutine(function* () {
    utils.log('Committing, tagging and pushing files to Github repository...');
    yield exec('git add .', TEMP_REPOSITORY_DIR);
    yield exec(`git commit -am 'Release ${version}'`, TEMP_REPOSITORY_DIR);
    yield exec('git push origin master', TEMP_REPOSITORY_DIR);
    yield exec(`git tag ${version}`, TEMP_REPOSITORY_DIR);
    yield exec('git push --tags', TEMP_REPOSITORY_DIR);
  })();
}

function createRelease(version) {
  return Promise.coroutine(function* () {
    utils.log('Creating Github release...');
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
  return Promise.coroutine(function* () {
    utils.log('Publishing to Npm...');
    yield exec('npm publish');
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  Promise.coroutine(function* () {
    try {
      const {version} = projectPackage;
      utils.log(`Publishing version ${version} to Github and Npm...`);
      yield checkoutTag(version);
      yield buildLibrary();
      yield prepareRepository();
      yield copyFiles();
      yield pushFiles(version);
      yield createRelease(version);
      yield publishToNpm();
      yield checkoutTag('master');
      utils.log(`Version ${version} published with success!`);
    } catch (err) {
      utils.logError(err);
      process.exit(1);
    }
  })();
}
