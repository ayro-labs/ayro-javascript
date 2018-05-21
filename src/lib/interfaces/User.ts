export interface User {
  id: string;
  uid: string;
  identified: boolean;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  photo: string;
  sign_up_date: Date;
  properties: Map<string, string>;
}
