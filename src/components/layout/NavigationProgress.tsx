
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const newPath = pathname + searchParams.toString();

    // This effect runs after the new page's content has rendered (or on initial load).
    // If the progress bar is visible and the path is the same as when it started,
    // it means navigation has completed for the currentPathRef.
    if (isVisible && currentPathRef.current === newPath) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100); // Set to 100%
      // After a short delay, hide the progress bar
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setProgress(0); // Reset for the next navigation
      }, 500); // Duration to show 100%
      return; // Exit early as this is the completion phase
    }

    // If the path has actually changed, it signifies a new navigation.
    if (currentPathRef.current !== newPath) {
      currentPathRef.current = newPath; // Update ref to the new path

      // Clear any existing timers/intervals from previous navigations or completions
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      setIsVisible(true);
      setProgress(10); // Start with a small initial progress

      // Simulate progress increment
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) { // Stall near the end
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          // Increment progress; you can make this more sophisticated
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 95);
        });
      }, 250); // Adjust interval for desired speed
    }

    // Cleanup function to clear interval and timeout if component unmounts
    // or if dependencies change before completion.
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchParams, isVisible]); // `isVisible` helps manage the completion logic correctly

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 w-full z-[49] h-1"> {/* Header is h-16 (4rem), so top-16 places it below. Header z-index is 50. */}
      <Progress value={progress} className="h-1 rounded-none [&>div]:bg-primary" /> {/* Custom height and primary color for indicator */}
    </div>
  );
}
