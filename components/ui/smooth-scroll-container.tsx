"use client";

import React, { forwardRef } from 'react';
import { Element as ScrollElement } from 'react-scroll';
import { cn } from '@/lib/utils';

interface SmoothScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  name?: string; // Optional name for scroll targeting
}

export const SmoothScrollContainer = forwardRef<
  HTMLDivElement,
  SmoothScrollContainerProps
>(({ children, className, name, ...props }, ref) => {
  if (name) {
    return (
      <ScrollElement
        name={name}
        className={cn(
          "smooth-scroll-container scroll-smooth",
          className
        )}
        {...props}
      >
        {children}
      </ScrollElement>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "smooth-scroll-container scroll-smooth",
        className
      )}
      style={{
        scrollBehavior: 'smooth',
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

SmoothScrollContainer.displayName = "SmoothScrollContainer";

// Export scroll elements for easy targeting
export const ScrollSection = forwardRef<
  HTMLDivElement,
  SmoothScrollContainerProps
>(({ children, className, name = "section", ...props }, ref) => (
  <ScrollElement
    name={name}
    className={cn("scroll-section", className)}
    {...props}
  >
    {children}
  </ScrollElement>
));

ScrollSection.displayName = "ScrollSection";