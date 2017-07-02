'use strict';

export default class Author {

  id: string;
  name: string;
  photo: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.photo = data.photo;
    }
  }
}