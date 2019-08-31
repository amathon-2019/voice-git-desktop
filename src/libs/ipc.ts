import { makePropDecorator } from './decorators';

type IpcActionHandler<Payload, Result> = (payload?: Payload) => Promise<Result>;

export interface IpcAction<Payload> {
  name: string;
  payload?: Payload;
}

export interface IpcActionResponse<Result = any> {
  result?: Result;
  error?: any;
}

/**
 * Decorator for registering action handler in specific class.
 *
 * @example
 * class SomeService {
 *     ...
 *
 *     @IpcActionHandler('create')
 *     async createSomething(data?: RequestData): Promise<ResponseData> {
 *         ...
 *     }
 * }
 */
export const IpcActionHandler: {
  (actionName: string): any;
  new(actionName: string): any;
} = makePropDecorator('IpcActionHandler', (actionName: string) => ({ actionName }));

function makeResponseChannelName(namespace: string, actionName: string): string {
  return `${namespace}-${actionName}-response`;
}

let _ipcMain;
let _ipcRenderer;

function getIpcMain() {
  if (!_ipcMain) {
    _ipcMain = require('electron').ipcMain;
  }

  return _ipcMain;
}

function getIpcRenderer() {
  if (!_ipcRenderer) {
    _ipcRenderer = require('electron').ipcRenderer;
  }

  return _ipcRenderer;
}


export class IpcServer {
  readonly _ipc = getIpcMain();

  private readonly actionHandlers = new Map<string, IpcActionHandler<any, any>>();
  private actionErrorHandler: (error: any) => any;
  private readonly actionListener: any;

  constructor(public readonly namespace: string) {
    this.actionListener = (event: any, action: IpcAction<any>) => this.handleIpcEvent(
      event,
      action,
    );
    this._ipc.on(this.namespace, this.actionListener);
  }

  setActionHandler<P, R>(actionName: string, handler: IpcActionHandler<P, R>): this {
    this.actionHandlers.set(actionName, handler);
    return this;
  }

  setActionErrorHandler(handler: (error: any) => any): this {
    this.actionErrorHandler = handler;
    return this;
  }

  private async handleIpcEvent(event: any, action: IpcAction<any>): Promise<void> {
    if (!this.actionHandlers.has(action.name)) {
      return;
    }

    const handler = this.actionHandlers.get(action.name);

    let result = null;
    let error = null;

    try {
      result = await handler(action.payload);
    } catch (err) {
      error = this.actionErrorHandler ? this.actionErrorHandler(err) : err;
    }

    event.sender.send(
      makeResponseChannelName(this.namespace, action.name),
      { result, error } as IpcActionResponse,
    );
  }
}

export class IpcClient {
  readonly _ipc = getIpcRenderer();

  constructor(public readonly namespace: string) {
  }

  performAction<Result, Payload = any>(
    actionName: string,
    payload?: Payload,
  ): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
      const channelName = makeResponseChannelName(this.namespace, actionName);
      const action: IpcAction<Payload> = { name: actionName, payload };

      // Listen for response event for once.
      this._ipc.once(channelName, (event: any, response: IpcActionResponse<Result>) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });

      this._ipc.send(this.namespace, action);
    });
  }
}
