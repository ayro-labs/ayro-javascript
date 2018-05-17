interface ErrorData {
  status?: string;
  code?: string;
  message?: string;
}

export class AyroError extends Error {

  public status: string;
  public code: string;
  public message: string;

  constructor(data: ErrorData) {
    super(data.message);
    this.status = data.status;
    this.code = data.code;
    this.message = data.message;
  }
}
