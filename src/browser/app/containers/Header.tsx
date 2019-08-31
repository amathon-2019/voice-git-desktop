import { Paper, Tab, Tabs } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { TabId } from '../models/tab';

interface Props {
  onTabChange: (tab: TabId) => void;
}

export default function Header({ onTabChange }: Props) {
  const [index, setIndex] = useState(0);

  const handleChange = useCallback((_, newIndex: number) => {
    setIndex(newIndex);

    switch (newIndex) {
      case 0:
        onTabChange('history');
        break;
      case 1:
        onTabChange('commit');
        break;
    }
  }, [onTabChange]);

  return (
    <Paper square>
      <Tabs
        value={index}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="fullWidth"
      >
        <Tab label="History"/>
        <Tab label="Commit"/>
      </Tabs>
    </Paper>
  );
}
