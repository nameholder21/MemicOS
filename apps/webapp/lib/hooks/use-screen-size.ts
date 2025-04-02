// TODO: this might be the same as use-window-size

import { useEffect, useState } from 'react';

export const useScreenSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};
