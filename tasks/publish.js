const packageJson = require('../package');
const {publishTask, commands} = require('@ayro/commons');
const path = require('path');
const GitHubApi = require('@octokit/rest');
const Promise = require('bluebird');

const WORKING_DIR = path.resolve(__dirname, '../');
const GITHUB_REPOSITORY_NAME = 'ayro-javascript';
const GITHUB_REPOSITORY_OWNER = 'ayrolabs';
const TEMP_DIR = '/tmp';
const TEMP_GITHUB_REPOSITORY_DIR = path.join(TEMP_DIR, GITHUB_REPOSITORY_NAME);

const gitHubApi = new GitHubApi();
gitHubApi.authenticate({
  type: 'token',
  token: process.env.GITHUB_ACCESS_TOKEN,
});

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

function prepareGithubRepository() {
  return Promise.coroutine(function* () {
    commands.log('Preparing Github repository...');
    yield commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}`, TEMP_DIR);
    yield commands.exec(`git clone git@github.com:${GITHUB_REPOSITORY_OWNER}/${GITHUB_REPOSITORY_NAME}.git ${GITHUB_REPOSITORY_NAME}`, TEMP_DIR);
    yield commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}/*`, TEMP_DIR);
  })();
}

function copyGithubFiles() {
  return Promise.coroutine(function* () {
    commands.log('Copying files to Github repository...');
    yield commands.exec(`cp dist/browser/ayro.min.js ${TEMP_GITHUB_REPOSITORY_DIR}`);
    yield commands.exec(`cp dist/wordpress/ayro-wordpress.min.js ${TEMP_GITHUB_REPOSITORY_DIR}`);
  })();
}

function pushGithubFiles() {
  return Promise.coroutine(function* () {
    commands.log('Committing, tagging and pushing files to Github repository...');
    yield commands.exec('git add .', TEMP_GITHUB_REPOSITORY_DIR);
    yield commands.exec(`git commit -am 'Release ${packageJson.version}'`, TEMP_GITHUB_REPOSITORY_DIR);
    yield commands.exec('git push origin master', TEMP_GITHUB_REPOSITORY_DIR);
    yield commands.exec(`git tag ${packageJson.version}`, TEMP_GITHUB_REPOSITORY_DIR);
    yield commands.exec('git push --tags', TEMP_GITHUB_REPOSITORY_DIR);
  })();
}

function createGithubRelease() {
  return Promise.coroutine(function* () {
    commands.log('Creating Github release...');
    const createRelease = Promise.promisify(gitHubApi.repos.createRelease);
    yield createRelease({
      owner: GITHUB_REPOSITORY_OWNER,
      repo: GITHUB_REPOSITORY_NAME,
      tag_name: packageJson.version,
      name: `Release ${packageJson.version}`,
    });
  })();
}

function beforePublish() {
  return Promise.coroutine(function* () {
    yield prepareGithubRepository();
    yield copyGithubFiles();
    yield pushGithubFiles();
    yield createGithubRelease();
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  publishTask.withWorkingDir(WORKING_DIR);
  publishTask.withLintTask(lintLibrary);
  publishTask.withBuildTask(buildLibrary);
  publishTask.withBeforePublishTask(beforePublish);
  publishTask.isNpmProject(true);
  publishTask.run();
}
