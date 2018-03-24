const {publishTask, commands} = require('@ayro/commons');
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

function buildLibrary() {
  return Promise.coroutine(function* () {
    commands.log('Linting library...');
    yield commands.exec('npm run lint', WORKING_DIR);
    commands.log('Building library...');
    yield commands.exec('npm run build-prod', WORKING_DIR);
    commands.log('Building browser library...');
    yield commands.exec('npm run build-browser-prod', WORKING_DIR);
    commands.log('Building WordPress browser library...');
    yield commands.exec('npm run build-browser-wordpress-prod', WORKING_DIR);
  })();
}

function prepareRepository() {
  return Promise.coroutine(function* () {
    utils.log('Preparing Github repository...');
    yield exec(`rm -rf ${TEMP_REPOSITORY_DIR}`);
    yield exec(`git clone https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}.git ${REPOSITORY_NAME}`, TEMP_DIR);
    yield exec('rm -rf *', TEMP_REPOSITORY_DIR);
  })();
}

function copyFiles() {
  return Promise.coroutine(function* () {
    utils.log('Copying files...');
    yield exec(`cp dist/${projectPackage.name}.min.js ${TEMP_REPOSITORY_DIR}/${projectPackage.name}-${projectPackage.version}.min.js`);
    yield exec(`cp dist/${projectPackage.name}-wordpress.min.js ${TEMP_REPOSITORY_DIR}/${projectPackage.name}-wordpress-${projectPackage.version}.min.js`);
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

function beforePublishTask() {
  return Promise.coroutine(function* () {
    yield prepareRepository();
    yield copyFiles();
    yield pushFiles(version);
    yield createRelease(version);
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  publishTask.withWorkingDir(WORKING_DIR);
  publishTask.withBuildTask(buildLibrary);
  publishTask.withBeforePublishTask(beforePublishTask);
  publishTask.isNpmProject(true);
  publishTask.run();
}
