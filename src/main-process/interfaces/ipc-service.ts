import { EventEmitter } from 'events';
import { PROP_METADATA } from '../../libs/decorators';
import { IpcServer } from '../../libs/ipc';

export abstract class IpcService extends EventEmitter {
  protected ipc: IpcServer;

  protected constructor(public readonly name: string) {
    super();

    this.ipc = new IpcServer(name);
    this.ipc.setActionErrorHandler(error => this.handleError ? this.handleError(error) : error);

    // Assign actions handlers
    const actionHandlers = this.constructor[PROP_METADATA];

    if (actionHandlers) {
      for (const actionName of Object.keys(actionHandlers)) {
        const action = actionHandlers[actionName][0].actionName;
        const method = this[actionName];

        this.ipc.setActionHandler(action, method.bind(this));
      }
    }
  }

  handleError?<E = any, T = any>(error: E): T;
}
