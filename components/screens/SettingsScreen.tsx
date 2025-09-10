
import React, { useState } from 'react';
import { db } from '../../services/db';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsScreenProps {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ apiBaseUrl, setApiBaseUrl, showToast }) => {
  const [urlInput, setUrlInput] = useState(apiBaseUrl);
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setApiBaseUrl(urlInput);
    showToast('API 주소가 저장되었습니다.', 'success');
  };

  const handleClearData = () => {
    if (window.confirm('정말로 모든 로컬 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      db.clearAllData()
        .then(() => {
          showToast('모든 데이터가 삭제되었습니다.', 'success');
          // Optionally reload the app to reset state
          window.location.reload();
        })
        .catch(err => {
          console.error("Failed to clear data:", err);
          showToast('데이터 삭제에 실패했습니다.', 'error');
        });
    }
  };

  const handleExportData = async () => {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studymate-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('데이터가 성공적으로 내보내졌습니다.', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('데이터 내보내기에 실패했습니다.', 'error');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (window.confirm('기존 데이터가 모두 삭제되고 가져온 데이터로 대체됩니다. 계속하시겠습니까?')) {
        await db.importData(data);
        showToast('데이터가 성공적으로 가져와졌습니다.', 'success');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Reload to refresh app state
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Import failed:', error);
      showToast('데이터 가져오기에 실패했습니다. 올바른 형식의 파일인지 확인해주세요.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">테마 설정</h2>
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">다크 모드</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">눈의 피로를 줄이고 배터리를 절약합니다</p>
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
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">API 설정</h2>
        <div className="space-y-2">
          <label htmlFor="api-url" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
            API Base URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="api-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-white"
              placeholder="http://127.0.0.1:8000"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors whitespace-nowrap"
            >
              저장
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">로컬 AI 서버의 주소를 입력하세요.</p>
        </div>
      </div>

      <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">데이터 관리</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
              >
                데이터 내보내기 (JSON)
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
                  데이터 가져오기
                </label>
              </div>
            </div>
            <button
                onClick={handleClearData}
                className="w-full px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
            >
                로컬 데이터 전체 삭제
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              • 내보내기: 모든 학습 카드와 기록을 JSON 파일로 저장합니다.<br/>
              • 가져오기: 저장된 JSON 파일에서 데이터를 복원합니다.<br/>
              • 삭제: 모든 데이터를 영구적으로 삭제합니다.
            </p>
          </div>
      </div>

      <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">클라우드 동기화 (구현 예정)</h2>
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Use Firebase</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" disabled/>
                  <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
              </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">여러 기기에서 데이터를 동기화하는 기능입니다 (현재 비활성).</p>
      </div>
    </div>
  );
};
