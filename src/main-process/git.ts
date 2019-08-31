import * as nodeGit from 'nodegit';
import { DiffDelta, DiffFile, Repository, StatusFile } from 'nodegit';
import * as path from 'path';
import { GitFileChange, GitFileChangeStatusTypes } from '../core/git';
import { IpcActionHandler } from '../libs/ipc';
import { IpcService } from './interfaces/ipc-service';

export class Git extends IpcService {
  private git = nodeGit;

  constructor() {
    super('git');
  }

  async isRepositoryExists(dirPath: string): Promise<boolean> {
    try {
      const repository = await this.openRepository(dirPath);
      repository.free();

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
    const fileChanges = statues.map(status => this.parseFileChange(dirPath, status));

    repository.free();

    return fileChanges;
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
}
