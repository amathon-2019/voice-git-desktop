export class Exception extends Error {
  constructor(
    public readonly code: string,
    message: string = code,
  ) {
    super(message);
  }
}

export function workspacePathNotExistsException() {
  return new Exception('workspace.pathNotExists');
}

export function workspaceInvalidRepository() {
  return new Exception('workspace.invalidRepository');
}
