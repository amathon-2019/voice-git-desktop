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
