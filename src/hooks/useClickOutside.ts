// https://github.com/Andarist/use-onclickoutside
/* eslint-disable */
import { useEffect, useRef } from 'react';

const useLatest = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
};

const MOUSEDOWN = 'mousedown';
const TOUCHSTART = 'touchstart';

const events = [MOUSEDOWN, TOUCHSTART];

export default function useOnClickOutside(
  ref: React.MutableRefObject<HTMLElement | undefined>,
  handler: (event: Event) => void | null,
) {
  const isBrowser = typeof document !== 'undefined';
  if (!isBrowser) {
    return;
  }
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!handler) {
      return;
    }

    const listener = (event: Event) => {
      if (!ref.current || !handlerRef.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [!handler]);
}

/* eslint-disable */
