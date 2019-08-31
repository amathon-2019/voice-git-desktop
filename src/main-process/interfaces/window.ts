import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import { PROD } from '../../core/environment';
import { encodePathAsUrl } from '../../libs/path';

export enum WindowEvents {
  CLOSED = 'window.closed',
}

/**
 * Window wrapper abstraction.
 */
export abstract class Window extends EventEmitter {
  readonly win: BrowserWindow;
  readonly options: BrowserWindowConstructorOptions;
  readonly url: string;

  protected constructor(
    htmlPathOrUrl: string,
    options: BrowserWindowConstructorOptions,
  ) {

    super();

    this.url = PROD ? encodePathAsUrl(__dirname, htmlPathOrUrl) : htmlPathOrUrl;
    this.options = { ...options };
    this.win = new BrowserWindow(this.options);

    this.handleEvents();
  }

  abstract handleEvents(): void;

  open(): void {
    this.win.loadURL(this.url);
  }

  close(): void {
    this.win.close();
  }
}
