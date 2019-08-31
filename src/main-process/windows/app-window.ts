import { PROD } from '../../core/environment';
import { Window, WindowEvents } from '../interfaces/window';

export class AppWindow extends Window {
  constructor() {
    super(PROD ? 'browser/app/index.html' : 'http://localhost:1234', {
      minWidth: 300,
      minHeight: 500,
      width: 420,
      height: 768,
      show: false,
      title: 'Voice Git',
    });
  }

  handleEvents(): void {
    this.win.once('ready-to-show', () => {
      this.win.show();
    });

    this.win.on('closed', () => {
      this.emit(WindowEvents.CLOSED);
    });

    this.win.webContents.on('did-finish-load', () => {
      // Disable zooming.
      if (PROD) {
        this.win.webContents.setVisualZoomLevelLimits(1, 1);
      }
    });
  }
}
