import { makeStyles } from '@material-ui/core';
import React, { ReactNode, useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { filter, map, pairwise } from 'rxjs/operators';

const noop = () => {};

interface ScrollDownDetectionOptions {
  threshold: number;
  onScroll: () => void;
}

interface ScrollPosition {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

const eventToScrollPosition = (event: Event): ScrollPosition => {
  const target = event.target as HTMLElement;

  const scrollHeight = target.scrollHeight;
  const scrollTop = target.scrollTop;
  const clientHeight = target.clientHeight;

  return { scrollHeight, scrollTop, clientHeight };
};

export function useScrollDownDetection<T extends HTMLElement = HTMLElement>({
  threshold,
  onScroll,
}: ScrollDownDetectionOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const subscription = fromEvent(ref.current, 'scroll').pipe(
      map(eventToScrollPosition),
      pairwise(),
      filter(([pos1, pos2]) => {
        return (pos1.scrollTop < pos2.scrollTop)
          && (pos2.scrollHeight - (pos2.scrollTop + pos2.clientHeight)) < threshold;
      }),
    ).subscribe(() => {
      onScroll();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [threshold]);

  return ref;
}

const useStyles = makeStyles(() => ({
  container: {
    overflowY: 'auto',
    height: '100%',
  },
}));

interface Props {
  threshold?: number;
  onScroll?: () => void;
  children?: ReactNode;
}

export default function InfiniteScroll({
  threshold = 50,
  onScroll = noop,
  children,
}: Props) {
  const classes = useStyles([]);
  const ref = useScrollDownDetection<HTMLDivElement>({ threshold, onScroll });

  return (
    <div ref={ref} className={classes.container}>
      {children}
    </div>
  );
}
