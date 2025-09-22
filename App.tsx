import React, { useMemo, useState } from 'react';
import type { Screen } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ReviewScreen } from './components/screens/ReviewScreen';
import { ErrorsScreen } from './components/screens/ErrorsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ConceptsScreen } from './components/screens/ConceptsScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ApiUrlProvider } from './contexts/ApiUrlContext';
import { ToastProvider } from './contexts/ToastContext';
import { useDb } from './hooks/useDb';

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mb-4" />
      <p>Initializing StudyMate AI...</p>
    </div>
  </div>
);

interface ErrorStateProps {
  message: string;
  onContinue: () => void;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onContinue, onRetry }) => (
  <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <div className="flex flex-col items-center max-w-md text-center">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="text-xl font-semibold mb-2">Database Initialization Failed</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
        You can still use StudyMate AI, but some features requiring local storage will be unavailable.
      </p>
      <button
        onClick={onContinue}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Continue Without Local Storage
      </button>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Retry Initialization
      </button>
    </div>
  </div>
);

const AppShell: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const { isDbReady, dbError, retryDbInit, acknowledgeDbError } = useDb();

  const screens = useMemo(
    () => ({
      dashboard: <DashboardScreen />,
      library: <LibraryScreen />,
      quiz: <QuizScreen />,
      review: <ReviewScreen />,
      errors: <ErrorsScreen />,
      concepts: <ConceptsScreen />,
      settings: <SettingsScreen />,
    }),
    [],
  );

  if (!isDbReady && !dbError) {
    return <LoadingState />;
  }

  if (dbError) {
    return (
      <ErrorState
        message={dbError}
        onContinue={acknowledgeDbError}
        onRetry={() => {
          retryDbInit().catch(() => {
            // Errors are surfaced through toast and state in useDb
          });
        }}
      />
    );
  }

  const renderScreen = () => screens[activeScreen] ?? null;

  return (
    <Layout activeScreen={activeScreen} onScreenChange={setActiveScreen}>
      {renderScreen()}
    </Layout>
  );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <ApiUrlProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ApiUrlProvider>
  </ToastProvider>
);

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
