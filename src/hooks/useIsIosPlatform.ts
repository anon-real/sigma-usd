import { useState, useEffect } from 'react';

export const useIsIosPlatform = () => {
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsIos(
      /iP(ad|hone|od)/.test(window.navigator.platform) ||
        (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1),
    );
  }, []);

  return isIos;
};

export default useIsIosPlatform;
