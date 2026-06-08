import { useEffect, useRef } from 'react';
import { generateTelemetry } from '../data/simulatedTelemetry';

const TELEMETRY_INTERVAL_MS = 4500;

/**
 * Hook that runs a simulated live data feed.
 * Batches selective telemetry so React handles one state transition per tick.
 *
 * @param {function} dispatch - Dispatch function from BmsContext reducer.
 * @param {React.MutableRefObject<boolean>} initializedRef - ref indicating state is ready.
 */
export function useLiveData(dispatch, initializedRef) {
  const intervalRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      if (initializedRef && !initializedRef.current) return;
      if (typeof document !== 'undefined' && document.hidden) return;

      const updates = generateTelemetry();
      if (updates.length) {
        dispatch({ type: 'BATCH_UPDATE', payload: updates });
      }
    };

    intervalRef.current = setInterval(tick, TELEMETRY_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dispatch, initializedRef]);
}
