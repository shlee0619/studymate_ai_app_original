import {
  DB_NAME,
  DB_VERSION,
  STORE_ATTEMPTS,
  STORE_CONCEPTS,
  STORE_ERRORTAGS,
  STORE_EVIDENCES,
  STORE_ITEMS,
  STORE_GOALS,
  INITIAL_ERROR_TAGS,
} from '../constants';
import type { Item, Attempt, ErrorTag, ErrorTagHistogram, Concept, StudyGoal } from '../types';
class StudyMateDB {
  private db: IDBDatabase | null = null;
  private isSupported: boolean = true;
  private checkIndexedDBSupport(): boolean {
    if (typeof window === 'undefined') return false;
    if (!('indexedDB' in window)) return false;
    // Check for private browsing mode in Safari
    try {
      const testDB = indexedDB.open('test');
      testDB.onerror = () => false;
      return true;
    } catch {
      return false;
    }
  }
  public async init(): Promise<void> {
    this.isSupported = this.checkIndexedDBSupport();
    if (!this.isSupported) {
      console.warn('IndexedDB is not supported. App will work with limited functionality.');
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
          this.isSupported = false;
          console.warn('Failed to open IndexedDB. Falling back to limited functionality.');
          resolve(); // Don't reject, just continue without DB
        };
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_ITEMS)) {
            db.createObjectStore(STORE_ITEMS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_ATTEMPTS)) {
            db.createObjectStore(STORE_ATTEMPTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_ERRORTAGS)) {
            const errorTagsStore = db.createObjectStore(STORE_ERRORTAGS, { keyPath: 'id' });
            INITIAL_ERROR_TAGS.forEach((tag) => errorTagsStore.put(tag));
          }
          if (!db.objectStoreNames.contains(STORE_CONCEPTS)) {
            db.createObjectStore(STORE_CONCEPTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_EVIDENCES)) {
            db.createObjectStore(STORE_EVIDENCES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_GOALS)) {
            db.createObjectStore(STORE_GOALS, { keyPath: 'id' });
          }
        };
      } catch (error) {
        this.isSupported = false;
        console.warn('IndexedDB initialization failed:', error);
        resolve(); // Continue without throwing
      }
    });
  }
  private ensureDb(): IDBDatabase {
    if (!this.isSupported || !this.db) {
      throw new Error('IndexedDB is not available.');
    }
    return this.db;
  }

  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    const database = this.ensureDb();
    try {
      return database.transaction(storeName, mode).objectStore(storeName);
    } catch (error) {
      const resolvedError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Failed to access store "${storeName}":`, resolvedError);
      throw resolvedError;
    }
  }
  public async upsertItems(items: Item[]): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ITEMS, 'readwrite');
    } catch (error) {
      console.warn('Skipping item upsert; IndexedDB is unavailable.', error);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      items.forEach((item) => store.put(item));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
  public async getAllItems(): Promise<Item[]> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ITEMS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning empty items array.', error);
      return [];
    }

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Failed to get items:', request.error);
        resolve([]);
      };
    });
  }
  public async getDueItems(): Promise<Item[]> {
    const allItems = await this.getAllItems();
    const now = new Date();
    return allItems.filter((item) => item.nextReview && new Date(item.nextReview) <= now);
  }
  public async updateItemScheduling(
    id: string,
    ef: number,
    intervalDays: number,
    reps: number,
    nextReview: string,
  ): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ITEMS, 'readwrite');
    } catch (error) {
      console.warn('Skipping scheduling update; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          item.ef = ef;
          item.intervalDays = intervalDays;
          item.reps = reps;
          item.nextReview = nextReview;
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error(`Item with id ${id} not found.`));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
  public async addAttempt(attempt: Attempt): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ATTEMPTS, 'readwrite');
    } catch (error) {
      console.warn('Skipping attempt write; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.add(attempt);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  public async getAllAttempts(): Promise<Attempt[]> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ATTEMPTS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning empty attempts array.', error);
      return [];
    }

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  public async getAllErrorTags(): Promise<ErrorTag[]> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ERRORTAGS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning default error tags.', error);
      return INITIAL_ERROR_TAGS;
    }

    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        resolve(result.length > 0 ? result : INITIAL_ERROR_TAGS);
      };
      request.onerror = () => {
        console.error('Failed to get error tags:', request.error);
        resolve(INITIAL_ERROR_TAGS);
      };
    });
  }
  public async getAllConcepts(): Promise<Concept[]> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_CONCEPTS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning empty concepts array.', error);
      return [];
    }

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  public async addConcept(concept: Concept): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_CONCEPTS, 'readwrite');
    } catch (error) {
      console.warn('Skipping concept add; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.add(concept);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  public async updateConcept(concept: Concept): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_CONCEPTS, 'readwrite');
    } catch (error) {
      console.warn('Skipping concept update; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.put(concept);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  public async deleteConcept(conceptId: string): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_CONCEPTS, 'readwrite');
    } catch (error) {
      console.warn('Skipping concept delete; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.delete(conceptId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  public async getErrorTagHistogram(): Promise<ErrorTagHistogram> {
    const tags = await this.getAllErrorTags();
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_ATTEMPTS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning empty error tag histogram.', error);
      const histogram: ErrorTagHistogram = {};
      tags.forEach((tag) => {
        histogram[tag.id] = { name: tag.name, count: 0 };
      });
      return histogram;
    }

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const attempts: Attempt[] = request.result;
        const histogram: ErrorTagHistogram = {};
        tags.forEach((tag) => {
          histogram[tag.id] = { name: tag.name, count: 0 };
        });
        attempts.forEach((attempt) => {
          if (!attempt.correct) {
            attempt.errorTagIds.forEach((tagId) => {
              if (histogram[tagId]) {
                histogram[tagId].count++;
              }
            });
          }
        });
        resolve(histogram);
      };
      request.onerror = () => reject(request.error);
    });
  }
  public async getAllGoals(): Promise<StudyGoal[]> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_GOALS, 'readonly');
    } catch (error) {
      console.warn('Database not available, returning empty goals array.', error);
      return [];
    }

    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async saveGoal(goal: StudyGoal): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_GOALS, 'readwrite');
    } catch (error) {
      console.warn('Skipping goal save; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.put(goal);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteGoal(goalId: string): Promise<void> {
    let store: IDBObjectStore;
    try {
      store = this.getStore(STORE_GOALS, 'readwrite');
    } catch (error) {
      console.warn('Skipping goal delete; IndexedDB is unavailable.', error);
      return;
    }

    const request = store.delete(goalId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async exportData(): Promise<any> {
    const items = await this.getAllItems();

    let attempts: Attempt[] = [];
    try {
      const store = this.getStore(STORE_ATTEMPTS, 'readonly');
      const request = store.getAll();
      attempts = await new Promise<Attempt[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Skipping attempts export; IndexedDB is unavailable.', error);
    }

    const errorTags = await this.getAllErrorTags();
    const goals = await this.getAllGoals();
    return {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      data: {
        items,
        attempts,
        errorTags,
        goals,
      },
    };
  }
  public async importData(data: any): Promise<void> {
    if (!data || !data.data) {
      throw new Error('Invalid import data format');
    }

    const database = this.ensureDb();
    await this.clearAllData();

    const transaction = database.transaction(
      [STORE_ITEMS, STORE_ATTEMPTS, STORE_ERRORTAGS, STORE_GOALS],
      'readwrite',
    );

    const { items = [], attempts = [], errorTags = [], goals = [] } = data.data as {
      items?: Item[];
      attempts?: Attempt[];
      errorTags?: ErrorTag[];
      goals?: StudyGoal[];
    };

    try {
      const itemsStore = transaction.objectStore(STORE_ITEMS);
      items.forEach((item) => itemsStore.put(item));

      const attemptsStore = transaction.objectStore(STORE_ATTEMPTS);
      attempts.forEach((attempt) => attemptsStore.put(attempt));

      const errorTagsStore = transaction.objectStore(STORE_ERRORTAGS);
      errorTagsStore.clear();
      if (errorTags.length > 0) {
        errorTags.forEach((tag) => errorTagsStore.put(tag));
      } else {
        INITIAL_ERROR_TAGS.forEach((tag) => errorTagsStore.put(tag));
      }

      const goalsStore = transaction.objectStore(STORE_GOALS);
      goals.forEach((goal) => goalsStore.put(goal));
    } catch (error) {
      transaction.abort();
      throw error instanceof Error ? error : new Error(String(error));
    }

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Import transaction failed.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Import transaction aborted.'));
    });
  }
  public async clearAllData(): Promise<void> {
    let database: IDBDatabase;
    try {
      database = this.ensureDb();
    } catch (error) {
      console.warn('Database not initialized; skipping clearAllData.', error);
      return;
    }

    const storeNames = [
      STORE_ITEMS,
      STORE_ATTEMPTS,
      STORE_CONCEPTS,
      STORE_EVIDENCES,
      STORE_ERRORTAGS,
      STORE_GOALS,
    ];
    const tx = database.transaction(storeNames, 'readwrite');

    return new Promise((resolve, reject) => {
      let cleared = 0;
      storeNames.forEach((name) => {
        const clearRequest = tx.objectStore(name).clear();
        clearRequest.onsuccess = () => {
          cleared++;
          if (cleared === storeNames.length) {
            const errorTagsStore = tx.objectStore(STORE_ERRORTAGS);
            INITIAL_ERROR_TAGS.forEach((tag) => errorTagsStore.put(tag));
          }
        };
        clearRequest.onerror = () => {
          console.error(`Failed to clear store ${name}:`, clearRequest.error);
        };
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
}
export const db = new StudyMateDB();
