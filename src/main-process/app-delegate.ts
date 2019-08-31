import { app, session } from 'electron';
import { EventEmitter } from 'events';
import { IpcServer } from '../libs/ipc';
import { __DARWIN__ } from '../libs/platform';
import { Git } from './git';
import { Window, WindowEvents } from './interfaces/window';
import { AppWindow } from './windows/app-window';
import { StartWindow } from './windows/start-window';
import { Workspace } from './workspace';

enum AppDelegateEvents {
  OPEN_WINDOW = 'app.openWindow',
}

class AppDelegate extends EventEmitter {
  // Windows
  readonly windows: Window[] = [];

  // Services
  readonly git = new Git();
  readonly workspace = new Workspace(this.git);

  // Ipc
  readonly gitIpc = new IpcServer('git');
  readonly workspaceIpc = new IpcServer('workspace');

  currentOpenWindow: Window | null = null;
  preventQuit: boolean = false;


  async run(): Promise<void> {
    this.handleEvents();
    this.openDefaultWindow();
  }

  async openDefaultWindow() {
    if (await this.workspace.isWorkspaceExists()) {
      this.openWindow('app');
    } else {
      this.openWindow('start');
    }
  }

  openWindow(name: 'app' | 'start') {
    let win: Window;

    switch (name) {
      case 'app':
        win = new AppWindow();
        break;
      case 'start':
        win = new StartWindow();
        break;
      default:
        throw new Error('Cannot open window.');
    }

    win.on(WindowEvents.CLOSED, () => this.removeWindow(win));
    win.open();

    this.currentOpenWindow = win;
    this.windows.push(win);
  }

  closeCurrentWindow(): void {
    if (this.currentOpenWindow) {
      this.currentOpenWindow.close();
    }
  }

  private removeWindow(win: Window) {
    const idx = this.windows.findIndex(w => w === win);

    if (win === this.currentOpenWindow) {
      this.currentOpenWindow = null;
    }

    if (idx !== -1) {
      this.windows.splice(idx, 1);
    }
  }

  private handleEvents(): void {
    this.on(AppDelegateEvents.OPEN_WINDOW, () => {
      this.openDefaultWindow();
    });

    app.on('activate', (event, hasVisibleWindows) => {
      if (!hasVisibleWindows) {
        this.emit(AppDelegateEvents.OPEN_WINDOW);
      }
    });

    app.on('window-all-closed', () => {
      if (!__DARWIN__ && !this.preventQuit) {
        app.quit();
      }
    });

    /** Prevent links or window.open from opening new windows. */
    app.on('web-contents-created', (_, contents) => {
      contents.on('new-window', (event) => {
        event.preventDefault();
      });
    });

    /**
     * Handle workspace 'CREATED' event.
     *
     * It will be handle for once because workspace is initialized
     * only at first time.
     * */
    // this.workspace.once(WorkspaceEvents.CREATED, async () => {
    //   // Since current window is 'WizardWindow', close it
    //   // and open 'AppWindow'.
    //   this.closeCurrentWindow();
    //   this.openWindow('app');
    // });

    // Handle session
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      // Set user agent.
      details.requestHeaders['User-Agent'] = 'voice-git';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
  }
}

export const appDelegate = new AppDelegate();
