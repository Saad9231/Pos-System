import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms.
 * Only fires once on mount. Uses requestAnimationFrame for silky 60fps.
 */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo curve — fast start, smooth stop
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      startTimeRef.current = null;
    };
  }, [target, duration]);

  return value;
}
