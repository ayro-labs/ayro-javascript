'use strict';

import 'whatwg-fetch';

const BASE_URL = 'http://api.chatz.io';
const HEADERS = {
  'Content-Type': 'application/json'
};

class HttpError extends Error {

  response: any;

  constructor(response: any) {
    super(response.statusText);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.response = response;
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new HttpError(response);
  }
}

function parseJSON(response) {
  return response.json();
}

function get(url) {
  return fetch(BASE_URL + url, {method: 'GET', headers: HEADERS}).then(function(response) {
    return checkStatus(response)
  }).then(function(response) {
    return parseJSON(response);
  });
};

function post(url, body) {
  return fetch(BASE_URL + url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body)
  }).then(function(response) {
    return checkStatus(response)
  }).then(function(response) {
    return parseJSON(response);
  });
};

export const http = {get, post, HttpError};