import { PROD } from '../../core/environment';
import { Window, WindowEvents } from '../interfaces/window';

export class StartWindow extends Window {
  constructor() {
    super(PROD ? 'browser/start/index.html' : 'http://localhost:1235', {
      width: 600,
      height: 480,
      resizable: false,
      maximizable: false,
      show: false,
      fullscreenable: false,
      title: 'Voice Git',
      webPreferences: {
        nodeIntegration: true
      },
    });
  }

  handleEvents() {
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
