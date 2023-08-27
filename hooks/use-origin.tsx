/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 06:52:04 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { useEffect, useState } from 'react';

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (!mounted) {
    return '';
  }

  return origin;
};
