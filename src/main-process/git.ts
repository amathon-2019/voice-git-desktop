import { Commit, DiffDelta, DiffFile, Oid, Repository, Revwalk, StatusFile } from 'nodegit';
import * as path from 'path';
import {
  GitCommitItem,
  GitCommitOptions,
  GitFileChange,
  GitFileChangeStatusTypes,
  GitGetHistoryOptions,
  GitGetHistoryResult,
} from '../core/git';
import { IpcActionHandler } from '../libs/ipc';
import { IpcService } from './interfaces/ipc-service';

export class Git extends IpcService {
  private readonly git = require('nodegit');

  constructor() {
    super('git');
  }

  async isRepositoryExists(dirPath: string): Promise<boolean> {
    try {
      await this.openRepository(dirPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async openRepository(dirPath: string): Promise<Repository> {
    return this.git.Repository.open(dirPath);
  }

  @IpcActionHandler('getFileChanges')
  async getFileChanges(dirPath: string): Promise<GitFileChange[]> {
    const repository = await this.openRepository(dirPath);
    const statues = await repository.getStatusExt({
      // This give us to track re-named files.
      //  See: https://github.com/libgit2/libgit2/issues/429
      flags: this.git.Status.OPT.INCLUDE_UNTRACKED,
    });

    return statues.map(status => this.parseFileChange(dirPath, status));
  }

  @IpcActionHandler('commit')
  async commit({
    workspaceDirPath,
    fileChanges,
    createdAt,
    author,
    message,
  }: GitCommitOptions): Promise<string> {
    const repository = await this.openRepository(workspaceDirPath);

    // First add all files to index. Un-tracked file.
    const index = await repository.refreshIndex();
    const allTasks: Promise<any>[] = [];

    fileChanges.forEach(({ status, filePath }) => {
      if (status === GitFileChangeStatusTypes.REMOVED) {
        allTasks.push(index.removeByPath(filePath));
      } else if (status === GitFileChangeStatusTypes.NEW
        || status === GitFileChangeStatusTypes.MODIFIED
        || status === GitFileChangeStatusTypes.RENAMED) {
        allTasks.push(index.addByPath(filePath));
      }
    });

    await Promise.all(allTasks);
    await index.write();

    const signature = createdAt
      ? this.git.Signature.create(
        author.displayName ? author.displayName : author.username,
        author.email,
        createdAt.time,
        createdAt.offset,
      )
      : this.git.Signature.now(
        author.displayName ? author.displayName : author.username,
        author.email,
      );

    const treeOId = await index.writeTree();
    let parentCommit: Commit;

    try {
      const head = await this.git.Reference.nameToId(repository, 'HEAD');
      parentCommit = await repository.getCommit(head);
    } catch (err) {
    }

    const commitId = await repository.createCommit(
      'HEAD',
      signature,
      signature,
      message,
      treeOId,
      parentCommit ? [parentCommit] : [],
    );

    return commitId.tostrS();
  }

  @IpcActionHandler('getCommitHistory')
  async getCommitHistory(options: GitGetHistoryOptions): Promise<GitGetHistoryResult> {
    const { workspaceDirPath, startCommitId, size } = options;
    const repository = await this.openRepository(workspaceDirPath);
    const walker = repository.createRevWalk();

    startCommitId
      ? walker.push(Oid.fromString(startCommitId))
      : walker.pushHead();

    walker.sorting(Revwalk.SORT.TIME);

    let history: GitCommitItem[];

    // If date range provided, find commits for period.
    const commits = await walker.getCommits(size);
    history = commits.map(commit => this.parseCommit(commit));

    if (startCommitId) {
      history.splice(0, 1);
    }

    const result = {
      history,
      next: null,
      previous: { ...options },
    };

    // Check for next request.
    try {
      const next = await walker.next();
      result.next = {
        workspaceDirPath: workspaceDirPath,
        startCommitId: next.tostrS(),
        size: size,
      };
    } catch (error) {
      // There is no next commit.
    }

    return result;
  }

  handleError(error: any): any {
    console.error(error);
    return error;
  }

  private parseFileChange(workingDir: string, status: StatusFile): GitFileChange {
    let fileChange = {
      filePath: status.path(),
      workingDirectoryPath: workingDir,
      absoluteFilePath: path.resolve(workingDir, status.path()),
    } as GitFileChange;

    if (status.isNew()) {
      fileChange = { ...fileChange, status: GitFileChangeStatusTypes.NEW };
    } else if (status.isRenamed()) {
      fileChange = {
        ...fileChange,
        status: GitFileChangeStatusTypes.RENAMED,
      };

      let diff: DiffDelta;

      if (status.inIndex()) {
        diff = status.headToIndex();
      } else if (status.inWorkingTree()) {
        diff = status.indexToWorkdir();
      }

      if (diff) {
        /** NOTE: '@types/nodegit' is incorrect. */
        const oldFile = (diff as any).oldFile() as DiffFile;
        const newFile = (diff as any).newFile() as DiffFile;

        fileChange = {
          ...fileChange,
          headToIndexDiff: {
            oldFilePath: oldFile.path(),
            newFilePath: newFile.path(),
          },
        };
      }
    } else if (status.isModified()) {
      fileChange = { ...fileChange, status: GitFileChangeStatusTypes.MODIFIED };
    } else if (status.isDeleted()) {
      fileChange = { ...fileChange, status: GitFileChangeStatusTypes.REMOVED };
    }

    // TODO: Handle ignored, conflicted file changes.

    return fileChange;
  }

  private parseCommit(commit: Commit): GitCommitItem {
    return {
      commitId: commit.id().tostrS(),
      commitHash: commit.sha(),
      authorName: commit.author().name(),
      authorEmail: commit.author().email(),
      committerName: commit.author().name(),
      committerEmail: commit.author().email(),
      summary: commit.summary(),
      description: commit.body(),
      timestamp: commit.timeMs(),
    };
  }
}
