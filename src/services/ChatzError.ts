export default class ChatzError extends Error {

  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    Object.setPrototypeOf(this, ChatzError.prototype);
    this.response = response;
  }
}
