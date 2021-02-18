import { useEffect, useState } from 'react';

const isBrowser = (): boolean => {
  return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
};

type SSRState = {
  isBrowser: boolean;
  isServer: boolean;
};

const useSSR = (): SSRState => {
  const [browser, setBrowser] = useState<boolean>(false);
  useEffect(() => {
    setBrowser(isBrowser());
  }, []);

  return {
    isBrowser: browser,
    isServer: !browser,
  };
};

const createElement = (id: string): HTMLElement => {
  const el = document.createElement('div');
  el.setAttribute('id', id);
  return el;
};

const usePortal = (
  selectId: string = Math.random().toString(32).slice(2, 10),
): HTMLElement | null => {
  const id = `id-${selectId}`;
  const isUsingBrowser = useSSR().isBrowser;
  const [elSnapshot, setElSnapshot] = useState<HTMLElement | null>(
    isUsingBrowser ? createElement(id) : null,
  );

  useEffect(() => {
    const hasElement = document.querySelector<HTMLElement>(`#${id}`);
    const el = hasElement || createElement(id);

    if (!hasElement) {
      document.body.appendChild(el);
    }
    setElSnapshot(el);
  }, []);

  return elSnapshot;
};

export default usePortal;
