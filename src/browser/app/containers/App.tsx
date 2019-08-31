import { makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { TabId } from '../models/tab';
import Header from './Header';
import History from './History';
import PerformCommit from './PerformCommit';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  body: {
    flex: '1 1 auto',
    minHeight: '1px',
  },
}));

export default function App() {
  const classes = useStyles([]);
  const [tab, setTab] = useState<TabId>('history');
  const handleTabChange = useCallback((newTab) => {
    setTab(newTab);
  }, []);

  return (
    <div className={classes.container}>
      <Header onTabChange={handleTabChange}/>
      <div className={classes.body}>
        {tab === 'history' ? <History/> : (tab === 'commit' ? <PerformCommit/> : null)}
      </div>
    </div>
  );
}
