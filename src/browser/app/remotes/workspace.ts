import { IpcClient } from '../../../libs/ipc';

const ipc = new IpcClient('workspace');

export async function fetchWorkspacePath() {
  return await ipc.performAction<string>('getPath');
}
