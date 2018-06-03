/* tslint:disable:variable-name */

export class ConnectChannelsMessageSettings {

  private static readonly DEFAULT_ASK_FOR_EMAIL = 'Deixe seu email:';
  private static readonly DEFAULT_EMAIL_PROVIDED = 'Agora também podemos trocar mensagens por e-mail.';
  private static readonly DEFAULT_EMAIL_INPUT_PLACEHOLDER = 'Digite seu email...';
  private static readonly DEFAULT_SEND_EMAIL_BUTTON = 'Enviar';
  private static readonly DEFAULT_EDIT_EMAIL_BUTTON = 'Editar';

  public ask_for_email: string;
  public email_provided: string;
  public email_input_placeholder: string;
  public send_email_button: string;
  public edit_email_button: string;

  constructor(data?: any) {
    const attrs = data || {};
    this.ask_for_email = attrs.ask_for_email || ConnectChannelsMessageSettings.DEFAULT_ASK_FOR_EMAIL;
    this.email_provided = attrs.email_provided || ConnectChannelsMessageSettings.DEFAULT_EMAIL_PROVIDED;
    this.email_input_placeholder = attrs.email_input_placeholder || ConnectChannelsMessageSettings.DEFAULT_EMAIL_INPUT_PLACEHOLDER;
    this.send_email_button = attrs.send_email_button || ConnectChannelsMessageSettings.DEFAULT_SEND_EMAIL_BUTTON;
    this.edit_email_button = attrs.edit_email_button || ConnectChannelsMessageSettings.DEFAULT_EDIT_EMAIL_BUTTON;
  }
}
