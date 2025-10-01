import { useCallback, useEffect, useState } from 'react';
import { loadStudySnapshot, type StudySnapshot } from '../services/studyInsightsService';

interface UseStudySnapshotResult {
  snapshot: StudySnapshot | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useStudySnapshot = (): UseStudySnapshotResult => {
  const [snapshot, setSnapshot] = useState<StudySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadStudySnapshot();
      setSnapshot(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load study snapshot:', err);
      setError('Unable to load study data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => {
      // handled in refresh
    });
  }, [refresh]);

  return {
    snapshot,
    loading,
    error,
    refresh,
  };
};

