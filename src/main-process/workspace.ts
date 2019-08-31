import { app } from 'electron';
import { pathExists, readFile, writeJson } from 'fs-extra';
import * as path from 'path';
import { IpcActionHandler } from '../libs/ipc';
import { workspaceInvalidRepository, workspacePathNotExistsException } from './exceptions';
import { Git } from './git';
import { IpcService } from './interfaces/ipc-service';

interface WorkspaceData {
  path: string;
}

export class Workspace extends IpcService {
  private readonly dataFilePath: string;
  private data: WorkspaceData | null = null;

  constructor(private readonly git: Git) {
    super('workspace');
    this.dataFilePath = path.resolve(app.getPath('userData'), 'workspace-data.json');
  }

  async isWorkspaceExists() {
    const workspacePath = await this.getPath();
    return workspacePath !== null;
  }

  @IpcActionHandler('getPath')
  async getPath() {
    if (this.data !== null) {
      return this.data.path;
    }

    if (!await pathExists(this.dataFilePath)) {
      return null;
    }

    try {
      const data = await readFile(this.dataFilePath, 'utf8');
      this.data = JSON.parse(data) as WorkspaceData;

      return this.data.path;
    } catch {
      this.data = null;
      return null;
    }
  }

  @IpcActionHandler('setPath')
  async setPath(workspacePath: string) {
    if (!await pathExists(workspacePath)) {
      throw workspacePathNotExistsException();
    }

    if (!await this.git.isRepositoryExists(workspacePath)) {
      throw workspaceInvalidRepository();
    }

    if (this.data === null) {
      this.data = {} as any;
    }

    this.data.path = workspacePath;
    await writeJson(this.dataFilePath, this.data);
  }
}
