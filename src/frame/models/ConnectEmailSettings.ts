/* tslint:disable:variable-name */

export class ConnectEmailSettings {

  private static readonly DEFAULT_DESCRIPTION = 'Conecte seu email e seja notificado quando receber uma resposta.';
  private static readonly DEFAULT_INPUT_PLACEHOLDER = 'Digite seu email...';
  private static readonly DEFAULT_SEND_BUTTON = 'Enviar';
  private static readonly DEFAULT_SUCCESS_MESSAGE = 'Email conectado com sucesso!';

  public description: string;
  public input_placeholder: string;
  public send_button: string;
  public success_message: string;

  constructor(data?: any) {
    const attrs = data || {};
    this.description = attrs.description || ConnectEmailSettings.DEFAULT_DESCRIPTION;
    this.input_placeholder = attrs.input_placeholder || ConnectEmailSettings.DEFAULT_INPUT_PLACEHOLDER;
    this.send_button = attrs.send_button || ConnectEmailSettings.DEFAULT_SEND_BUTTON;
    this.success_message = attrs.success_message || ConnectEmailSettings.DEFAULT_SUCCESS_MESSAGE;
  }
}
