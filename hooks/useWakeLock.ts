
import { useState, useEffect } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    let isMounted = true;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          const lock = await navigator.wakeLock.request('screen');
          if (isMounted) {
            setWakeLock(lock);
            lock.addEventListener('release', () => {
              // Lock was released by the system
              setWakeLock(null);
            });
          }
        } catch (err) {
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    // This is an expected warning, not a critical error.
                    // It often happens in sandboxed environments (like iframes) that don't have the required permission policy.
                    // The game remains fully playable.
                    console.warn(`Screen Wake Lock failed: ${err.message}. The screen may turn off automatically.`);
                } else {
                    console.error(`An unexpected error occurred with Screen Wake Lock: ${err.name}, ${err.message}`);
                }
            }
        }
      }
    };

    requestWakeLock();

    return () => {
      isMounted = false;
      if (wakeLock !== null) {
        wakeLock.release().then(() => setWakeLock(null));
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return wakeLock;
};

// Type definition for WakeLockSentinel if not available in standard libs
interface WakeLockSentinel extends EventTarget {
  readonly released: boolean;
  readonly type: string;
  release(): Promise<void>;
  onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
}
