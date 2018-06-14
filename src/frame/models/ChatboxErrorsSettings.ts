/* tslint:disable:variable-name */

export class ChatboxErrorsSettings {

  private static readonly DEFAULT_FILE_SIZE_LIMIT_EXCEEDED = 'Arquivo deve possuir no máximo 5 MB';

  public file_size_limit_exceeded: string;

  constructor(data?: any) {
    const attrs = data || {};
    this.file_size_limit_exceeded = attrs.file_size_limit_exceeded || ChatboxErrorsSettings.DEFAULT_FILE_SIZE_LIMIT_EXCEEDED;
  }
}
