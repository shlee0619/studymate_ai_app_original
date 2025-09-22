
import React, { useState, useCallback } from 'react';
import { SAMPLE_TEXT } from '../../constants';
import { generateItems, ingestChunks } from '../../services/apiService';
import { db } from '../../services/db';
import type { Item } from '../../types';
import { useApiUrl } from '../../contexts/ApiUrlContext';
import { useToast } from '../../contexts/ToastContext';

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

export const LibraryScreen: React.FC = () => {
  const { apiBaseUrl } = useApiUrl();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState<{ autocard: boolean; ingest: boolean }>({ autocard: false, ingest: false });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLoadSample = useCallback(() => {
    setText(SAMPLE_TEXT);
    showToast('샘플 텍스트를 불러왔습니다.', 'success');
  }, [showToast]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'text/markdown', 'text/x-markdown', 'application/x-markdown'];
    const allowedExtensions = ['.txt', '.md', '.markdown'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      showToast('텍스트 파일(.txt, .md)만 업로드 가능합니다.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const content = await file.text();
      setText(content);
      showToast(`${file.name} 파일을 불러왔습니다.`, 'success');
    } catch (error) {
      console.error('File read error:', error);
      showToast('파일을 읽는 중 오류가 발생했습니다.', 'error');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [showToast]);

  const handleAutocard = useCallback(async () => {
    if (!text.trim()) {
      showToast('노트 내용을 입력해주세요.', 'error');
      return;
    }
    setIsLoading(prev => ({ ...prev, autocard: true }));
    try {
      const k = 5; // Generate 5 items
      const generated = await generateItems(apiBaseUrl, text, k);
      const newItems: Item[] = generated.map(item => ({
        ...item,
        ef: 2.5,
        intervalDays: 0,
        reps: 0,
      }));
      await db.upsertItems(newItems);
      showToast(`${newItems.length}개의 카드가 생성되었습니다.`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      showToast(`카드 생성 실패: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, autocard: false }));
    }
  }, [text, apiBaseUrl, showToast]);

  const handleIngest = useCallback(async () => {
    if (!text.trim()) {
        showToast('노트 내용을 입력해주세요.', 'error');
        return;
    }
    setIsLoading(prev => ({ ...prev, ingest: true }));
    try {
        const chunkSize = 500;
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, i + chunkSize));
        }
        const docId = `doc_${Date.now()}`;
        const result = await ingestChunks(apiBaseUrl, docId, chunks);
        showToast(`${result.count}개의 청크가 처리되었습니다.`, 'success');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        showToast(`처리 실패: ${errorMessage}`, 'error');
    } finally {
        setIsLoading(prev => ({ ...prev, ingest: false }));
    }
  }, [text, apiBaseUrl, showToast]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">학습 노트</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            파일 업로드 (.txt, .md)
          </label>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="여기에 학습할 내용을 붙여넣으세요..."
        className="w-full flex-grow p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-inner focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-900 dark:text-white"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button onClick={handleLoadSample} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
          샘플 로드
        </button>
        <button onClick={handleAutocard} disabled={isLoading.autocard} className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
          {isLoading.autocard ? <LoadingSpinner /> : '자동 카드 생성 (Autocard)'}
        </button>
        <button onClick={handleIngest} disabled={isLoading.ingest} className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors disabled:bg-emerald-800 disabled:cursor-not-allowed">
          {isLoading.ingest ? <LoadingSpinner /> : 'RAG 색인 (Ingest)'}
        </button>
      </div>
    </div>
  );
};
