import { useEffect } from 'react';

export const useDidMount = (callback: () => void) => {
  // eslint-disable-next-line
  useEffect(() => callback(), []);
};
