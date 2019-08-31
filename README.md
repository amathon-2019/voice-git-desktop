# Voice Git Desktop

## IpcClient API

Main Process와 Render Process 간에 IPC로 통신하는 고수준 API 입니다.

### Git
#### 파일 변경사항 가져오기
```typescript
const client = new IpcClient('git');

async function getFileChanges() {
  return await client.performAction('getFileChanges');
}
```

### Workspace
#### 작업 경로 가져오기
```typescript
const client = new IpcClient('workspace');

async function getWorkspacePath() {
  return await client.performAction('getPath');
}
```

#### 작업 경로 설정
```typescript
const client = new IpcClient('workspace');

async function getWorkspacePath() {
  return await client.performAction('setPath', '/usr/local/some/directory');
}
```
