import { GitFileChange, GitGetHistoryOptions, GitGetHistoryResult } from '../../../core/git';
import { IpcClient } from '../../../libs/ipc';

const ipc = new IpcClient('git');

export async function fetchGitCommitHistory(options: GitGetHistoryOptions) {
  return await ipc.performAction<GitGetHistoryResult, GitGetHistoryOptions>(
    'getCommitHistory',
    options,
  );
}

export async function fetchFileChanges(workspaceDir: string) {
  return await ipc.performAction<GitFileChange[], string>(
    'getFileChanges',
    workspaceDir,
  );
}
