"use client";

import { animateScroll as scroll, scroller } from 'react-scroll';

export type SmoothScrollOptions = {
  duration?: number;
  smooth?: boolean | string;
  offset?: number;
  delay?: number;
};

export const useSmoothScroll = () => {
  const scrollTo = (target: string | number, options: SmoothScrollOptions = {}) => {
    const {
      duration = 800,
      smooth = true,
      offset = 0,
      delay = 0
    } = options;

    if (typeof target === 'number') {
      // Scroll to absolute position
      scroll.scrollTo(target, {
        duration,
        smooth,
        offset,
        delay
      });
    } else {
      // Scroll to element
      scroller.scrollTo(target, {
        duration,
        smooth,
        offset,
        delay
      });
    }
  };

  const scrollToTop = (options: SmoothScrollOptions = {}) => {
    const {
      duration = 800,
      smooth = true,
      delay = 0
    } = options;

    scroll.scrollToTop({
      duration,
      smooth,
      delay
    });
  };

  const scrollToBottom = (options: SmoothScrollOptions = {}) => {
    const {
      duration = 800,
      smooth = true,
      delay = 0
    } = options;

    scroll.scrollToBottom({
      duration,
      smooth,
      delay
    });
  };

  const scrollMore = (value: number, options: SmoothScrollOptions = {}) => {
    const {
      duration = 800,
      smooth = true,
      delay = 0
    } = options;

    scroll.scrollMore(value, {
      duration,
      smooth,
      delay
    });
  };

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollMore
  };
};

// Hook for smooth scrolling within containers
export const useSmoothScrollContainer = () => {
  const scrollToElement = (
    containerId: string,
    targetId: string,
    options: SmoothScrollOptions = {}
  ) => {
    const {
      duration = 800,
      smooth = true,
      offset = 0,
      delay = 0
    } = options;

    scroller.scrollTo(targetId, {
      duration,
      smooth,
      offset,
      delay,
      containerId
    });
  };

  return {
    scrollToElement
  };
};