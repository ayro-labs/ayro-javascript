export class ChatzError extends Error {

  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}
