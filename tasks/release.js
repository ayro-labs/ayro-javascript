'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const semver = require('semver');
const Promise = require('bluebird');

const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);
const execAsync = Promise.promisify(childProcess.exec);

const WORKING_DIR = path.resolve(__dirname, '../');
const PACKAGE_FILE = path.join(WORKING_DIR, 'package.json');

function exec(command, options) {
  return execAsync(command, options || {cwd: WORKING_DIR});
}

function buildDevelopment() {
  return Promise.coroutine(function*() {
    console.log('Building project...');
    yield exec('npm run build');
  })();
}

function updateVersion(versionType) {
  return Promise.coroutine(function*() {
    console.log('Updating version...');
    const projectPackage = JSON.parse(yield readFileAsync(PACKAGE_FILE, 'utf8'));
    console.log(`  Current version is ${projectPackage.version}`);
    const nextVersion = semver.inc(projectPackage.version, versionType);
    console.log(`  Next version is ${nextVersion}`);
    projectPackage.version = nextVersion;
    yield writeFileAsync(PACKAGE_FILE, JSON.stringify(projectPackage, null, 2));
    return nextVersion;
  })();
}

function commitFiles(version) {
  return Promise.coroutine(function*() {
    console.log('Committing files...');
    yield exec('git checkout master');
    yield exec('git add --all');
    yield exec(`git commit -am "Release ${version}"`);
  })();
}

function pushFiles() {
  return Promise.coroutine(function*() {
    console.log('Pushing files to remote...');
    yield exec('git push origin master');
  })();
}

function createTag(version) {
  return Promise.coroutine(function*() {
    console.log(`Creating tag ${version}...`);
    yield exec(`git tag ${version}`);
  })();
}

function pushTag(version) {
  return Promise.coroutine(function*() {
    console.log('Pushing tag to remote...');
    yield exec(`git push origin ${version}`);
  })();
}

// Run this if call directly from command line
if (require.main === module) {
  const versionType = process.argv[2];
  if (!versionType || ['major', 'minor', 'patch'].indexOf(versionType) === -1) {
    console.log('Usage:');
    console.log('npm run release -- major|minor|patch');
    process.exit(1);
  }
  Promise.coroutine(function*() {
    try {
      const version = yield updateVersion(versionType);
      console.log(`Releasing version ${version} to remote...`);
      yield buildDevelopment();
      yield commitFiles(version);
      yield pushFiles();
      yield createTag(version);
      yield pushTag(version);
      console.log(`Version ${version} released with success!`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
