import { useEffect, useState } from 'react';

const getInitialFocusState = () => {
  if (typeof document === 'undefined') {
    return true;
  }
  return document.hasFocus();
};

export const useIsFocused = () => {
  const [isFocused, setIsFocused] = useState(getInitialFocusState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return isFocused;
};
