import React, { useState, useEffect, useCallback } from 'react';
import type { Screen } from './types';
import { db } from './services/db';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ReviewScreen } from './components/screens/ReviewScreen';
import { ErrorsScreen } from './components/screens/ErrorsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ConceptsScreen } from './components/screens/ConceptsScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

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

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white text-sm z-50 animate-fade-in-down';
    const typeClasses = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {message}
        </div>
    );
};


export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(readPersistedApiBaseUrl);
  const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const handleToastDismiss = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialiseDb = async () => {
      try {
        await db.init();
        if (isMounted) {
          setIsDbReady(true);
        }
      } catch (error) {
        console.error('DB initialization failed:', error);
        if (isMounted) {
          setDbError('Database initialization failed. Some features may be unavailable.');
          showToast('Local data features are unavailable. Refresh to retry.', 'error');
        }
      }
    };

    initialiseDb();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const setApiBaseUrl = useCallback((url: string) => {
    // Trim and validate URL
    const trimmedUrl = url.trim();
    
    // Basic URL validation
    try {
      const urlObj = new URL(trimmedUrl);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        showToast('Please enter a valid HTTP or HTTPS URL', 'error');
        return;
      }
    } catch (error) {
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
  }, [showToast]);
  
  // Object mapping for screen rendering - better extensibility and readability
  const screens: Record<Screen, React.ReactElement | null> = {
    dashboard: <DashboardScreen showToast={showToast} />,
    library: <LibraryScreen apiBaseUrl={apiBaseUrl} showToast={showToast} />,
    quiz: <QuizScreen apiBaseUrl={apiBaseUrl} />,
    review: <ReviewScreen />,
    errors: <ErrorsScreen />,
    concepts: <ConceptsScreen showToast={showToast} />,
    settings: <SettingsScreen apiBaseUrl={apiBaseUrl} setApiBaseUrl={setApiBaseUrl} showToast={showToast} />,
  };

  const renderScreen = () => screens[activeScreen] ?? null;

  // Show loading state while DB is initializing
  if (!isDbReady && !dbError) {
    return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mb-4"></div>
                <p>Initializing StudyMate AI...</p>
            </div>
        </div>
    );
  }

  // Show error state if DB initialization failed
  if (dbError) {
    return (
      <ThemeProvider>
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="flex flex-col items-center max-w-md text-center">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Database Initialization Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{dbError}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">You can still use StudyMate AI, but some features requiring local storage will be unavailable.</p>
            <button 
              onClick={() => {
                setDbError(null);
                setIsDbReady(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Without Local Storage
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Retry Initialization
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout activeScreen={activeScreen} onScreenChange={setActiveScreen}>
        {renderScreen()}
      </Layout>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={handleToastDismiss} />}
    </ThemeProvider>
  );
}
