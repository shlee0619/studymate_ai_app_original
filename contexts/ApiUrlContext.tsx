import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

type ApiUrlContextValue = {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
};

const readPersistedApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_API_BASE_URL;
  }

  try {
    return localStorage.getItem('apiBaseUrl') || DEFAULT_API_BASE_URL;
  } catch (error) {
    console.warn('Unable to read API base URL from localStorage:', error);
    return DEFAULT_API_BASE_URL;
  }
};

const ApiUrlContext = createContext<ApiUrlContextValue | undefined>(undefined);

export const ApiUrlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(readPersistedApiBaseUrl);

  const setApiBaseUrl = useCallback(
    (url: string) => {
      const trimmedUrl = url.trim();

      try {
        const urlObj = new URL(trimmedUrl);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          showToast('Please enter a valid HTTP or HTTPS URL', 'error');
          return;
        }
      } catch {
        showToast('Please enter a valid URL', 'error');
        return;
      }

      setApiBaseUrlState(trimmedUrl);

      if (typeof window === 'undefined') {
        return;
      }

      try {
        localStorage.setItem('apiBaseUrl', trimmedUrl);
        showToast('API base URL updated successfully', 'success');
      } catch (error) {
        console.error('Failed to persist API base URL:', error);
        showToast('Failed to save API base URL. It may reset after refresh.', 'error');
      }
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ apiBaseUrl, setApiBaseUrl }),
    [apiBaseUrl, setApiBaseUrl],
  );

  return <ApiUrlContext.Provider value={value}>{children}</ApiUrlContext.Provider>;
};

export const useApiUrl = (): ApiUrlContextValue => {
  const context = useContext(ApiUrlContext);
  if (!context) {
    throw new Error('useApiUrl must be used within an ApiUrlProvider');
  }
  return context;
};

export { DEFAULT_API_BASE_URL };
