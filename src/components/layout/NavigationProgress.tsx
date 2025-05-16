
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Ref to store the path that most recently *started* a loading sequence.
  const activeLoadingPathRef = useRef<string | null>(null);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentFullPath = pathname + searchParams.toString();

    // Clear any pending completion timeout if a new navigation starts quickly
    // This handles cases where user clicks another link before the previous one fully "hides"
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }

    // This condition means a new navigation has started
    if (activeLoadingPathRef.current !== currentFullPath) {
      // If there's an old progress interval from a previous navigation, clear it
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Start new loading sequence
      activeLoadingPathRef.current = currentFullPath;
      setIsVisible(true);
      setProgress(15); // Start with a slightly more visible initial progress

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) { // Stall near the end
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return prev;
          }
          // Simulate progress: random increment between 5 and 20
          const increment = Math.random() * 15 + 5; 
          return Math.min(prev + increment, 95);
        });
      }, 150); // Update interval (e.g., every 150ms)
    }
    // This condition means the useEffect is running for the *same path* that is currently loading,
    // and the bar is visible. This implies the new page's components have rendered.
    else if (isVisible && activeLoadingPathRef.current === currentFullPath) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100); // Complete the progress

      completionTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        // No need to reset activeLoadingPathRef.current here; it's updated when a *new* path starts.
        setProgress(0); // Reset progress value for the next navigation
      }, 300); // Short delay before hiding the fully loaded bar
    }

    // Cleanup function: clears intervals/timeouts if the component unmounts
    // or if dependencies change causing the effect to re-run *before* completion.
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, [pathname, searchParams]); // Effect only depends on path changes

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 w-full z-[49] h-1"> {/* Header is h-16 (4rem), so top-16 places it below. Header z-index is 50. */}
      <Progress value={progress} className="h-1 rounded-none [&>div]:bg-primary" /> {/* Custom height and primary color for indicator */}
    </div>
  );
}
