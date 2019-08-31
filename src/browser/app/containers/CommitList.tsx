import { List } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { GitCommitItem, GitGetHistoryOptions } from '../../../core/git';
import CommitItem from '../components/CommitItem';
import InfiniteScroll from '../components/InfiniteScroll';
import { fetchGitCommitHistory } from '../remotes/git';
import { fetchWorkspacePath } from '../remotes/workspace';

let next: GitGetHistoryOptions;

async function getCommitList() {
  const workspaceDir = await fetchWorkspacePath();
  return await fetchGitCommitHistory(next ? next : {
    workspaceDirPath: workspaceDir,
    size: 20,
  });
}

export default function CommitList() {
  const [commitItems, setCommitItems] = useState<GitCommitItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetchMore = useCallback(async () => {
    if (isFetching || next === null) {
      return;
    }

    setIsFetching(true);
    const result = await getCommitList();

    setCommitItems(items => {
      return [...items, ...result.history];
    });

    next = result.next;
    setIsFetching(false);
  }, [isFetching]);

  useEffect(() => {
    next = undefined;
    fetchMore();
  }, []);

  return (
    <InfiniteScroll threshold={10} onScroll={fetchMore}>
      <List>
        {commitItems.map(commit => (
          <CommitItem
            key={commit.commitId}
            item={commit}
          />
        ))}
      </List>
    </InfiniteScroll>
  );
}
