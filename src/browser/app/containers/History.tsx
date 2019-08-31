import React from 'react';
import InfiniteScroll from '../components/InfiniteScroll';

export default function History() {
  return (
    <InfiniteScroll onScroll={() => { console.log('hello') }}>
      <div style={{ height: '1000px' }} />
      <div style={{ height: '1000px' }} />
      <div style={{ height: '1000px' }} />
    </InfiniteScroll>
  );
}
