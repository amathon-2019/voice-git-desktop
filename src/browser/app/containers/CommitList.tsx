import { List } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { GitCommitItem, GitGetHistoryOptions } from '../../../core/git';
import { API_URL } from '../../core/api';
import { httpClient } from '../../core/http';
import CommitItem from '../components/CommitItem';
import InfiniteScroll from '../components/InfiniteScroll';
import { fetchGitCommitHistory } from '../remotes/git';
import { fetchWorkspacePath } from '../remotes/workspace';

let next: GitGetHistoryOptions;

async function getCommitList() {
  const workspaceDir = await fetchWorkspacePath();
  const { data } = await httpClient.get(`${API_URL}/commit/list/1/4?start=0&end=20`);
  console.log(data);

  const v = data.response.commitList as Array<{ hashCode: string; voiceSrc: string }>;
  const result = await fetchGitCommitHistory(next ? next : {
    workspaceDirPath: workspaceDir,
    size: 20,
  });

  result.history.forEach(c => {
    const i = v.findIndex(a => a.hashCode === c.commitId);

    if (i > -1) {
      (c as any).voice =  `http://www.amathon-voice-git.ga/file${v[i].voiceSrc}`;
    }
  });

  return result;
}

export default function CommitList() {
  const [commitItems, setCommitItems] = useState<Array<GitCommitItem & { voice?: string }>>([]);
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
            voice={(commit as any).voice}
          />
        ))}
      </List>
    </InfiniteScroll>
  );
}
