'use strict';

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

const createReleaseAsync = Promise.promisify(gitHubApi.repos.createRelease);

async function lintLibrary() {
  commands.log('Linting library...');
  await commands.exec('npm run lint', WORKING_DIR);
}

async function buildLibrary() {
  commands.log('Building library...');
  await commands.exec('npm run build-prod', WORKING_DIR);
  commands.log('Building browser library...');
  await commands.exec('npm run build-browser-prod', WORKING_DIR);
  commands.log('Building WordPress browser library...');
  await commands.exec('npm run build-browser-wordpress-prod', WORKING_DIR);
}

async function prepareGithubRepository() {
  commands.log('Preparing Github repository...');
  await commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}`, TEMP_DIR);
  await commands.exec(`git clone git@github.com:${GITHUB_REPOSITORY_OWNER}/${GITHUB_REPOSITORY_NAME}.git ${GITHUB_REPOSITORY_NAME}`, TEMP_DIR);
  await commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}/*`, TEMP_DIR);
}

async function copyFilesToGithubRepository() {
  commands.log('Copying files to Github repository...');
  await commands.exec(`cp dist/browser/ayro.min.js ${TEMP_GITHUB_REPOSITORY_DIR}`);
  await commands.exec(`cp dist/wordpress/ayro-wordpress.min.js ${TEMP_GITHUB_REPOSITORY_DIR}`);
}

async function pushFilesToGithubRepository() {
  commands.log('Committing, tagging and pushing files to Github repository...');
  await commands.exec('git add --all', TEMP_GITHUB_REPOSITORY_DIR);
  await commands.exec(`git commit -am 'Release ${packageJson.version}'`, TEMP_GITHUB_REPOSITORY_DIR);
  await commands.exec('git push origin master', TEMP_GITHUB_REPOSITORY_DIR);
  await commands.exec(`git tag ${packageJson.version}`, TEMP_GITHUB_REPOSITORY_DIR);
  await commands.exec('git push --tags', TEMP_GITHUB_REPOSITORY_DIR);
}

async function createGithubRelease() {
  commands.log('Creating Github release...');
  await createReleaseAsync({
    owner: GITHUB_REPOSITORY_OWNER,
    repo: GITHUB_REPOSITORY_NAME,
    tag_name: packageJson.version,
    name: `Release ${packageJson.version}`,
  });
}

async function beforePublish() {
  await prepareGithubRepository();
  await copyFilesToGithubRepository();
  await pushFilesToGithubRepository();
  await createGithubRelease();
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
