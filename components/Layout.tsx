import React from 'react';
import type { Screen } from '../types';

interface LayoutProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  children: React.ReactNode;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
}> = ({ label, icon, isActive, onClick, ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`}
    aria-label={ariaLabel}
    aria-current={isActive ? 'page' : undefined}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
    </svg>
    <span className="text-xs">{label}</span>
  </button>
);

const navIcons: Record<Screen, string> = {
    dashboard: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    library: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
    quiz: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
    review: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-7.5 12h18",
    errors: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5l1.5-1.5m0 0l-1.5 1.5m1.5-1.5l1.5 1.5M3 12h18",
    concepts: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
    settings: "M9.594 3.94c.09-.542.56-1.007 1.11-.962a8.958 8.958 0 017.3 5.624m-16.792 0A8.958 8.958 0 012.04 5.624a8.958 8.958 0 0110.45 6.22m-1.33 4.793a8.958 8.958 0 01-11.43-2.58 8.958 8.958 0 01.19-9.52m10.58 11.54a8.958 8.958 0 01-7.3-5.624m16.792 0A8.958 8.958 0 0121.96 14.38a8.958 8.958 0 01-10.44-6.218m-1.33-4.793c.34-.198.68-.383 1.02-.557m-9.52 10.123c.34.198.68.383 1.02.557m0 0a8.958 8.958 0 019.52-10.123"
};

const navItems: Array<{ key: Screen; label: string; ariaLabel: string }> = [
  { key: 'dashboard', label: '대시보드', ariaLabel: '대시보드 화면으로 이동' },
  { key: 'library', label: '라이브러리', ariaLabel: '라이브러리 화면으로 이동' },
  { key: 'quiz', label: '퀴즈', ariaLabel: '퀴즈 화면으로 이동' },
  { key: 'review', label: '복습', ariaLabel: '복습 화면으로 이동' },
  { key: 'errors', label: '오답', ariaLabel: '오답 화면으로 이동' },
  { key: 'concepts', label: '개념', ariaLabel: '개념 화면으로 이동' },
  { key: 'settings', label: '설정', ariaLabel: '설정 화면으로 이동' },
];

export const Layout: React.FC<LayoutProps> = ({ activeScreen, onScreenChange, children }) => {
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-2xl shadow-indigo-900/20 dark:shadow-indigo-900/50">
      <header className="p-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">StudyMate AI</h1>
      </header>
      
      <main className="flex-grow p-4 overflow-y-auto">
        {children}
      </main>
      
      <footer className="sticky bottom-0 left-0 right-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around max-w-2xl mx-auto" aria-label="주요 화면 이동">
          {navItems.map(({ key, label, ariaLabel }) => (
            <NavItem
              key={key}
              label={label}
              icon={navIcons[key]}
              isActive={activeScreen === key}
              onClick={() => onScreenChange(key)}
              ariaLabel={ariaLabel}
            />
          ))}
        </nav>
      </footer>
    </div>
  );
};
