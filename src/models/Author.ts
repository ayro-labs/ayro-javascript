'use strict';

export default class Author {

  id: string;
  name: string;
  photo_url: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.photo_url = data.photo_url;
    }
  }
}