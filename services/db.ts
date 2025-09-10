
import { 
  DB_NAME, 
  DB_VERSION, 
  STORE_ATTEMPTS, 
  STORE_CONCEPTS, 
  STORE_ERRORTAGS, 
  STORE_EVIDENCES, 
  STORE_ITEMS,
  INITIAL_ERROR_TAGS
} from '../constants';
import type { Item, Attempt, ErrorTag, ErrorTagHistogram, Concept } from '../types';

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
    } catch (e) {
      return false;
    }
  }

  public async init(): Promise<void> {
    this.isSupported = this.checkIndexedDBSupport();
    
    if (!this.isSupported) {
      console.warn('IndexedDB is not supported. App will work with limited functionality.');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
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
            INITIAL_ERROR_TAGS.forEach(tag => errorTagsStore.put(tag));
          }
          if (!db.objectStoreNames.contains(STORE_CONCEPTS)) {
            db.createObjectStore(STORE_CONCEPTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_EVIDENCES)) {
            db.createObjectStore(STORE_EVIDENCES, { keyPath: 'id' });
          }
        };
      } catch (error) {
        this.isSupported = false;
        console.warn('IndexedDB initialization failed:', error);
        resolve(); // Continue without throwing
      }
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.isSupported || !this.db) {
      throw new Error('Database not available. IndexedDB is not supported or not initialized.');
    }
    return this.db.transaction(storeName, mode).objectStore(storeName);
  }

  public async upsertItems(items: Item[]): Promise<void> {
    const store = this.getStore(STORE_ITEMS, 'readwrite');
    return new Promise((resolve, reject) => {
      const transaction = store.transaction;
      items.forEach(item => store.put(item));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  public async getAllItems(): Promise<Item[]> {
    if (!this.isSupported || !this.db) {
      console.warn('Database not available, returning empty items array');
      return [];
    }
    
    try {
      const store = this.getStore(STORE_ITEMS, 'readonly');
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error('Failed to get items:', request.error);
          resolve([]); // Return empty array instead of rejecting
        };
      });
    } catch (error) {
      console.error('Error accessing items store:', error);
      return [];
    }
  }

  public async getDueItems(): Promise<Item[]> {
    const allItems = await this.getAllItems();
    const now = new Date();
    return allItems.filter(item => item.nextReview && new Date(item.nextReview) <= now);
  }

  public async updateItemScheduling(id: string, ef: number, intervalDays: number, reps: number, nextReview: string): Promise<void> {
    const store = this.getStore(STORE_ITEMS, 'readwrite');
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
    const store = this.getStore(STORE_ATTEMPTS, 'readwrite');
    const request = store.add(attempt);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllAttempts(): Promise<Attempt[]> {
    const store = this.getStore(STORE_ATTEMPTS, 'readonly');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllErrorTags(): Promise<ErrorTag[]> {
    if (!this.isSupported || !this.db) {
      console.warn('Database not available, returning default error tags');
      return INITIAL_ERROR_TAGS;
    }
    
    try {
      const store = this.getStore(STORE_ERRORTAGS, 'readonly');
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          resolve(result.length > 0 ? result : INITIAL_ERROR_TAGS);
        };
        request.onerror = () => {
          console.error('Failed to get error tags:', request.error);
          resolve(INITIAL_ERROR_TAGS);
        };
      });
    } catch (error) {
      console.error('Error accessing error tags store:', error);
      return INITIAL_ERROR_TAGS;
    }
  }

  public async getAllConcepts(): Promise<Concept[]> {
    const store = this.getStore(STORE_CONCEPTS, 'readonly');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async addConcept(concept: Concept): Promise<void> {
    const store = this.getStore(STORE_CONCEPTS, 'readwrite');
    const request = store.add(concept);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async updateConcept(concept: Concept): Promise<void> {
    const store = this.getStore(STORE_CONCEPTS, 'readwrite');
    const request = store.put(concept);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteConcept(conceptId: string): Promise<void> {
    const store = this.getStore(STORE_CONCEPTS, 'readwrite');
    const request = store.delete(conceptId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getErrorTagHistogram(): Promise<ErrorTagHistogram> {
    const tags = await this.getAllErrorTags();
    const tagMap = new Map(tags.map(t => [t.id, t.name]));
    
    const store = this.getStore(STORE_ATTEMPTS, 'readonly');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const attempts: Attempt[] = request.result;
        const histogram: ErrorTagHistogram = {};
        
        tags.forEach(tag => {
            histogram[tag.id] = { name: tag.name, count: 0 };
        });
        
        attempts.forEach(attempt => {
          if (!attempt.correct) {
            attempt.errorTagIds.forEach(tagId => {
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
  
  public async exportData(): Promise<any> {
    const items = await this.getAllItems();
    const store = this.getStore(STORE_ATTEMPTS, 'readonly');
    const attempts = await new Promise<Attempt[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    const errorTags = await this.getAllErrorTags();
    
    return {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      data: {
        items,
        attempts,
        errorTags
      }
    };
  }

  public async importData(data: any): Promise<void> {
    if (!data || !data.data) {
      throw new Error('Invalid import data format');
    }

    // Clear existing data first
    await this.clearAllData();

    // Import items
    if (data.data.items && data.data.items.length > 0) {
      await this.upsertItems(data.data.items);
    }

    // Import attempts
    if (data.data.attempts && data.data.attempts.length > 0) {
      const store = this.getStore(STORE_ATTEMPTS, 'readwrite');
      const transaction = store.transaction;
      data.data.attempts.forEach((attempt: Attempt) => store.put(attempt));
      await new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(undefined);
        transaction.onerror = () => reject(transaction.error);
      });
    }

    // Import error tags (if different from initial)
    if (data.data.errorTags && data.data.errorTags.length > 0) {
      const store = this.getStore(STORE_ERRORTAGS, 'readwrite');
      const transaction = store.transaction;
      data.data.errorTags.forEach((tag: ErrorTag) => store.put(tag));
      await new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(undefined);
        transaction.onerror = () => reject(transaction.error);
      });
    }
  }

  public async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized.');
    const storeNames = [STORE_ITEMS, STORE_ATTEMPTS, STORE_CONCEPTS, STORE_EVIDENCES, STORE_ERRORTAGS];
    const tx = this.db.transaction(storeNames, 'readwrite');
    return new Promise((resolve, reject) => {
        let cleared = 0;
        storeNames.forEach(name => {
            tx.objectStore(name).clear().onsuccess = () => {
                cleared++;
                if (cleared === storeNames.length) {
                    const errorTagsStore = tx.objectStore(STORE_ERRORTAGS);
                    INITIAL_ERROR_TAGS.forEach(tag => errorTagsStore.put(tag));
                }
            };
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
  }
}

export const db = new StudyMateDB();
