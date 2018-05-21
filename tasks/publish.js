/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const project = require('../package');
const helpers = require('../utils/helpers');
const {publishTask, commands} = require('@ayro/commons');
const GitHubApi = require('@octokit/rest');
const path = require('path')
const Promise = require('bluebird');

const WORKING_DIR = helpers.root();
const GITHUB_REPOSITORY_NAME = 'ayro-javascript';
const GITHUB_REPOSITORY_OWNER = 'ayrolabs';
const GITHUB_TEMP_DIR = '/tmp';
const GITHUB_REPOSITORY_DIR = path.join(GITHUB_TEMP_DIR, GITHUB_REPOSITORY_NAME);

const S3_BUCKET = 's3://ayro/sdks';

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
}

async function prepareGithubRepository() {
  commands.log('Preparing Github repository...');
  await commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}`, GITHUB_TEMP_DIR);
  await commands.exec(`git clone git@github.com:${GITHUB_REPOSITORY_OWNER}/${GITHUB_REPOSITORY_NAME}.git ${GITHUB_REPOSITORY_NAME}`, GITHUB_TEMP_DIR);
  await commands.exec(`rm -rf ${GITHUB_REPOSITORY_NAME}/*`, GITHUB_TEMP_DIR);
}

async function copyFilesToGithubRepository() {
  commands.log('Copying files to Github repository...');
  await commands.exec(`cp dist/ayro.min.js ${GITHUB_REPOSITORY_DIR}/ayro-${project.version}.min.js`);
}

async function pushFilesToGithubRepository() {
  commands.log('Committing, tagging and pushing files to Github repository...');
  await commands.exec('git add --all', GITHUB_REPOSITORY_DIR);
  await commands.exec(`git commit -am 'Release ${project.version}'`, GITHUB_REPOSITORY_DIR);
  await commands.exec('git push origin master', GITHUB_REPOSITORY_DIR);
  await commands.exec(`git tag ${project.version}`, GITHUB_REPOSITORY_DIR);
  await commands.exec('git push --tags', GITHUB_REPOSITORY_DIR);
}

async function createGithubRelease() {
  commands.log('Creating Github release...');
  await createReleaseAsync({
    owner: GITHUB_REPOSITORY_OWNER,
    repo: GITHUB_REPOSITORY_NAME,
    tag_name: project.version,
    name: `Release ${project.version}`,
  });
}

async function beforePublish() {
  await prepareGithubRepository();
  await copyFilesToGithubRepository();
  await pushFilesToGithubRepository();
  await createGithubRelease();
  await commands.exec('rm -Rf lib', WORKING_DIR);
  await commands.exec('mkdir lib', WORKING_DIR);
  await commands.exec('cp dist/ayro.min.js lib/ayro.js', WORKING_DIR);
}

async function publish() {
  commands.log('Uploading library to Amazon S3...');
  await commands.exec(`aws s3 cp dist/ayro.min.js ${S3_BUCKET}/ayro-${project.version}.min.js --acl public-read`, WORKING_DIR);
  await commands.exec(`aws s3 cp dist/ayro.min.css ${S3_BUCKET}/ayro-${project.version}.min.css --acl public-read`, WORKING_DIR);
  await commands.exec(`aws s3 cp dist/ayro-frame.min.js ${S3_BUCKET}/ayro-frame-${project.version}.min.js --acl public-read`, WORKING_DIR);
  await commands.exec(`aws s3 cp dist/ayro-frame.min.css ${S3_BUCKET}/ayro-frame-${project.version}.min.css --acl public-read`, WORKING_DIR);
}

// Run this if call directly from command line
if (require.main === module) {
  publishTask.withWorkingDir(WORKING_DIR);
  publishTask.withLintTask(lintLibrary);
  publishTask.withBuildTask(buildLibrary);
  publishTask.withBeforePublishTask(beforePublish);
  publishTask.withPublishTask(publish);
  publishTask.isNpmProject(true);
  publishTask.run();
}
