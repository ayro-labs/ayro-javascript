'use strict';

import User from '../models/User';
import Device from '../models/Device';

import 'whatwg-fetch';

const BASE_URL = 'http://api.chatz.io';
const HEADERS = {
  'Content-Type': 'application/json'
};

class ApiError extends Error {

  response: any;

  constructor(response: any) {
    super(response.statusText);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.response = response;
  }
}

function getUrl(url: string) {
  return BASE_URL + url;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new ApiError(response);
  }
}

function parseJSON(response) {
  return response.json();
}

function login(appToken: string, user: User, device: Device): Promise<string> {
  return fetch(getUrl('/auth/users'), {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      app_token: appToken,
      user: user,
      device: device
    })
  }).then(function(response) {
    return checkStatus(response)
  }).then(function(response) {
    return parseJSON(response);
  });
};

function postMessage(apiToken: string, message: string): Promise<void> {
  return fetch(getUrl('/chat/web'), {
    method: 'POST',
    headers: Object.assign({'X-Token': apiToken}, HEADERS),
    body: JSON.stringify({
      text: message
    })
  }).then(function(response) {
    return checkStatus(response)
  }).then(function(response) {
    return parseJSON(response);
  });
};

export const apiService = {login, postMessage, ApiError};