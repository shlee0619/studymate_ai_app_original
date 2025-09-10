
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
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(
    () => localStorage.getItem('apiBaseUrl') || 'http://127.0.0.1:8000'
  );
  const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    db.init()
      .then(() => setIsDbReady(true))
      .catch(err => console.error("DB initialization failed:", err));
  }, []);

  const setApiBaseUrl = (url: string) => {
    localStorage.setItem('apiBaseUrl', url);
    setApiBaseUrlState(url);
  };
  
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

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
