import AsyncStorage from '@react-native-async-storage/async-storage';

declare type Callback = (error?: Error | null) => void;
declare type CallbackWithResult<T> = (error?: Error | null, result?: T | null) => void;

export interface Storage {
    getItem: (key: string, callback?: CallbackWithResult<string>) => Promise<string | null>;
    setItem: (key: string, value: string, callback?: Callback) => Promise<void>;
    removeItem: (key: string, callback?: Callback) => Promise<void>;
    clear: (callback?: Callback) => Promise<void>;
}

export interface SetSorageOptions {
    maxAge: number; // time of data storage
}

interface StorageData {
    data: any;
    createAt: number;
    updateAt: number;
    maxAge: number;
    size: number;
}

export class StorageFactory {

    private static get local() {
        if (!AsyncStorage) {
            throw new Error('AsyncStorage API not support.');
        }

        return AsyncStorage;
    }

    private static get session() {
        if (!AsyncStorage) {
            throw new Error('AsyncStorage API not support.');
        }

        return AsyncStorage;
    }

    private static async setItem(storage: Storage, key: string, value: any, options?: SetSorageOptions) {
        const store = JSON.stringify(value);
        const timestamp = Date.now();
        const payload: StorageData = {
            data: store,
            createAt: timestamp,
            updateAt: timestamp,
            maxAge: options?.maxAge || 0,
            size: store.length,
        };

        storage.setItem(key, JSON.stringify(payload));
    }

    private static async getItem(storage: Storage, key: string) {
        try {
            let payloadStr = await storage.getItem(key);
            if (payloadStr === null) {
                return null;
            }
            const payload = JSON.parse(payloadStr) as StorageData;
            const { maxAge, updateAt } = payload;
            if (maxAge === 0) {
                return JSON.parse(payload.data);
            }
            if (Date.now() - updateAt > maxAge) {
                return null;
            } else {
                return JSON.parse(payload.data);
            }
        } catch {
            return null;
        }
    }

    static setLocal(key: string, value: any, options?: SetSorageOptions) {
        this.setItem(this.local, key, value, options);
    }

    static getLocal(key: string) {
        return this.getItem(this.local, key);
    }

    static removeLocal(key: string) {
        this.local.removeItem(key);
    }

    static clearLocal() {
        this.local.clear();
    }

    static setSession(key: string, value: any, options?: SetSorageOptions) {
        this.setItem(this.session, key, value, options);
    }

    static getSession(key: string) {
        return this.getItem(this.session, key);
    }

    static removeSession(key: string) {
        this.session.removeItem(key);
    }

    static clearSession() {
        this.session.clear();
    }
}
