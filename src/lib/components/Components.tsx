import {Ayro} from 'lib/interfaces/Ayro';
import {Html} from 'utils/Html';
import {Constants} from 'utils/Constants';

export class Components {

  public static async init(): Promise<void> {
    await Html.whenReady(document);

    const css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', process.env.LIB_CSS_URL);
    document.body.appendChild(css);

    const div = document.createElement('div');
    div.setAttribute('id', Components.ID_DIV);
    document.body.appendChild(div);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', Components.ID_FRAME);
    iframe.setAttribute('allowFullScreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.className = Components.CLASS_BUTTON;
    div.appendChild(iframe);

    const iframeDocument = iframe.contentDocument;
    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="${process.env.FRAME_CSS_URL}">
          <script src="${process.env.FRAME_URL}"></script>
        </head>
        <body/>
      </html>
    `);
    iframeDocument.close();

    await Html.whenReady(iframeDocument);
    this.registerEvents();
  }

  public static getLibrary(): Ayro {
    const iframe = Components.getFrame();
    if (!iframe) {
      throw new Error('App not initialized, please make sure you call init function first.');
    }
    return iframe.contentWindow[Components.LIB_NAME];
  }

  private static readonly LIB_NAME = 'Ayro';
  private static readonly ID_DIV = 'ayro';
  private static readonly ID_FRAME = 'ayro-frame';
  private static readonly CLASS_BUTTON = 'ayro-button';
  private static readonly CLASS_BOX = 'ayro-box';
  private static readonly CLASS_UNREAD = 'ayro-unread';

  private static getFrame(): HTMLIFrameElement {
    return document.getElementById(Components.ID_FRAME) as HTMLIFrameElement;
  }

  private static registerEvents(): void {
    window.addEventListener('message', (event) => {
      if (event.data.type === Constants.EVENT_SIZE_CHANGED) {
        const iframe = Components.getFrame();
        switch (event.data.size) {
          case Constants.SIZE_BUTTON:
            iframe.className = Components.CLASS_BUTTON;
            break;
          case Constants.SIZE_BOX:
            iframe.className = Components.CLASS_BOX;
            break;
          case Constants.SIZE_UNREAD:
            iframe.className = Components.CLASS_UNREAD;
            break;
          default:
            break;
        }
      }
    });
  }
}
