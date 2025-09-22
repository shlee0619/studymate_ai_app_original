
import React, { useState } from 'react';
import { db } from '../../services/db';
import { useTheme } from '../../contexts/ThemeContext';
import { useApiUrl } from '../../contexts/ApiUrlContext';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsScreen: React.FC = () => {
  const { apiBaseUrl, setApiBaseUrl } = useApiUrl();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [urlInput, setUrlInput] = useState(apiBaseUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isClearModalOpen, setClearModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any | null>(null);
  const [pendingImportFileName, setPendingImportFileName] = useState<string | null>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setApiBaseUrl(urlInput);
    showToast('API base URL updated.', 'success');
  };

  const handleExportData = async () => {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `studymate-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      showToast('Export completed.', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Unable to export data.', 'error');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setPendingImportData(parsed);
      setPendingImportFileName(file.name);
      setImportModalOpen(true);
    } catch (error) {
      console.error('Import preparation failed:', error);
      showToast('Unable to read the selected file.', 'error');
      resetFileInput();
    }
  };

  const confirmImportData = async () => {
    if (!pendingImportData) {
      setImportModalOpen(false);
      return;
    }

    setImportModalOpen(false);
    try {
      await db.importData(pendingImportData);
      showToast('Data imported successfully.', 'success');
      resetFileInput();
      setPendingImportData(null);
      setPendingImportFileName(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Import failed:', error);
      showToast('Unable to import the provided file.', 'error');
    }
  };

  const cancelImportData = () => {
    setImportModalOpen(false);
    setPendingImportData(null);
    setPendingImportFileName(null);
    resetFileInput();
  };

  const openClearDataModal = () => {
    setClearModalOpen(true);
  };

  const confirmClearData = async () => {
    setClearModalOpen(false);
    try {
      await db.clearAllData();
      showToast('All local data has been removed.', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      showToast('Unable to clear local data.', 'error');
    }
  };

  const cancelClearData = () => {
    setClearModalOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Theme</h2>
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Dark mode</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reduce eye strain and save battery.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              style={{ backgroundColor: theme === 'dark' ? '#4f46e5' : '#e5e7eb' }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ transform: theme === 'dark' ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
              />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">API settings</h2>
          <div className="space-y-2">
            <label htmlFor="api-url" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              API base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="api-url"
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-white"
                placeholder="http://127.0.0.1:8000"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors whitespace-nowrap"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Provide the endpoint for the StudyMate AI backend.</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Data management</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
              >
                Export data (JSON)
              </button>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors cursor-pointer text-center"
                >
                  Import data
                </label>
              </div>
            </div>
            <button
              onClick={openClearDataModal}
              className="w-full px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear local data
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Export saves your study cards and attempts as a JSON backup.
              Import replaces all local information with the selected backup file.
              Clearing data removes every locally stored record, including cards and review history.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Cloud sync (coming soon)</h2>
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400">Use Firebase</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input id="toggle" type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" disabled />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer" htmlFor="toggle" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Synchronise data across devices (in development).</p>
        </div>
      </div>

      <ConfirmModal
        open={isClearModalOpen}
        title="Reset local data"
        message="This will remove every locally stored card and attempt. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmClearData}
        onCancel={cancelClearData}
      />
      <ConfirmModal
        open={isImportModalOpen}
        title="Replace local data"
        message={pendingImportFileName
          ? `All local data will be replaced with the content of "${pendingImportFileName}". Continue?`
          : 'All local data will be replaced with the selected backup. Continue?'}
        confirmLabel="Import"
        cancelLabel="Cancel"
        onConfirm={confirmImportData}
        onCancel={cancelImportData}
      />
    </>
  );
};
