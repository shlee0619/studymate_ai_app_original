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
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(readPersistedApiBaseUrl);
  const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialiseDb = async () => {
      try {
        await db.init();
      } catch (error) {
        console.error('DB initialization failed:', error);
        if (isMounted) {
          showToast('Local data features are unavailable. Refresh to retry.', 'error');
        }
      } finally {
        if (isMounted) {
          setIsDbReady(true);
        }
      }
    };

    initialiseDb();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const setApiBaseUrl = useCallback((url: string) => {
    setApiBaseUrlState(url);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem('apiBaseUrl', url);
    } catch (error) {
      console.error('Failed to persist API base URL:', error);
      showToast('Failed to save API base URL. It may reset after refresh.', 'error');
    }
  }, [showToast]);
  
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <DashboardScreen showToast={showToast} />;
      case 'library': return <LibraryScreen apiBaseUrl={apiBaseUrl} showToast={showToast} />;
      case 'quiz': return <QuizScreen apiBaseUrl={apiBaseUrl} />;
      case 'review': return <ReviewScreen />;
      case 'errors': return <ErrorsScreen />;
      case 'concepts': return <ConceptsScreen showToast={showToast} />;
      case 'settings': return <SettingsScreen apiBaseUrl={apiBaseUrl} setApiBaseUrl={setApiBaseUrl} showToast={showToast} />;
      default: return null;
    }
  };

  if (!isDbReady) {
    return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mb-4"></div>
                <p>Initializing StudyMate AI...</p>
            </div>
        </div>
    );
  }

  return (
    <ThemeProvider>
      <Layout activeScreen={activeScreen} onScreenChange={setActiveScreen}>
        {renderScreen()}
      </Layout>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
       <style>{`
            @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
            .toggle-checkbox:checked { right: 0; border-color: #4f46e5; }
            .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }
       `}</style>
    </ThemeProvider>
  );
}
