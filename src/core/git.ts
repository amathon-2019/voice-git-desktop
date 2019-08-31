import { User } from './user';

export enum GitFileChangeStatusTypes {
  NEW = 'NEW',
  MODIFIED = 'MODIFIED',
  RENAMED = 'RENAMED',
  REMOVED = 'REMOVED',
  CONFLICTED = 'CONFLICTED',
  IGNORED = 'IGNORED',
}

export interface GitFileChange {
  /** File path relative with working directory. */
  readonly filePath: string;

  /** Working directory path. */
  readonly workingDirectoryPath: string;

  /** Absolute file path. */
  readonly absoluteFilePath: string;

  /** Vcs status of file. */
  readonly status: GitFileChangeStatusTypes;

  /** Diff for Head to index. */
  readonly headToIndexDiff?: {
    readonly oldFilePath: string;
    readonly newFilePath: string;
  };
}

export interface GitCommitOptions {
  /** Workspace directory path. */
  workspaceDirPath: string;

  /** Commit message raw string. */
  message: string;

  /** List of files to add. Path must be relative to workspace directory path. */
  fileChanges: GitFileChange[];

  /** Author of commit. Same account will be sign to committer. */
  author: User;

  /** When Commit is created. If not provided, current is default. */
  createdAt?: {
    time: number;
    offset: number;
  };
}

export interface GitGetHistoryOptions {
  /** Workspace directory path. */
  workspaceDirPath: string;

  /** The starting point to call up commits. If not provided, head commit is default. */
  startCommitId?: string;

  /** Size of history to call. Default is 100, and not required if date range is provided. */
  size?: number;
}

export interface GitCommitItem {
  /** Commit id. Same with SHA. */
  commitId: string;

  /** SHA */
  commitHash: string;

  authorName: string;
  authorEmail: string;
  committerName: string;
  committerEmail: string;

  /** Summary of commit message. */
  summary: string;

  /** Description of commit message. */
  description?: string;

  /** Unix timestamp. Unit is millisecond. */
  timestamp: number;
}

export interface GitGetHistoryResult {
  /** Result of commit items. */
  history: GitCommitItem[];

  /** Next request options. If all loaded, value will be null. */
  next: GitGetHistoryOptions | null;

  /** Previous request options. */
  previous: GitGetHistoryOptions;
}
