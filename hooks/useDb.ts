import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '../services/db';
import { useToast } from '../contexts/ToastContext';

interface UseDbResult {
  isDbReady: boolean;
  dbError: string | null;
  retryDbInit: () => Promise<void>;
  acknowledgeDbError: () => void;
}

export const useDb = (): UseDbResult => {
  const { showToast } = useToast();
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const initialiseDb = useCallback(async () => {
    try {
      await db.init();
      if (!isMountedRef.current) {
        return;
      }
      setIsDbReady(true);
      setDbError(null);
    } catch (error) {
      console.error('DB initialization failed:', error);
      if (!isMountedRef.current) {
        return;
      }
      setDbError('Database initialization failed. Some features may be unavailable.');
      setIsDbReady(false);
      showToast('Local data features are unavailable. Refresh to retry.', 'error');
      throw error;
    }
  }, [showToast]);

  useEffect(() => {
    initialiseDb().catch(() => {
      // Error is already handled inside initialiseDb
    });
  }, [initialiseDb]);

  const acknowledgeDbError = useCallback(() => {
    setDbError(null);
    setIsDbReady(true);
  }, []);

  return {
    isDbReady,
    dbError,
    retryDbInit: initialiseDb,
    acknowledgeDbError,
  };
};
