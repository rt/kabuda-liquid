
/**
 * MemorySessionStore is a simple store following the browser sesssion storage interface
 * for usage on the server and in tests
 */
export default class MemorySessionStorage {
    constructor() {
        this.hash = {};
    }

    getItem(key) {
        return this.hash[key];
    }
    setItem(key, val) {
        this.hash[key] = val;
    }
    removeItem(key) {
        delete this.hash[key];
    }
    clear() {
        this.hash = {};
    }
}
