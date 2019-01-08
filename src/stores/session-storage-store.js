import ClassStore from './class-store';

export default class SessionStorageStore extends ClassStore {

    /**
     * @constructor
     * @extends {KABUDA.stores.ClassStore}
     * @param {object} options
     * options
     * - sessionStorageKey {string}
     * - sessionStorage {KABUDA.stores.SessionStorage}
     */
    constructor(options) {
        options = options || {};
        options.onChange = () => {
            this.persistToSessionStorage();
        };
        super(options);
        this.deserialize(this.getSessionStorageObject());
    }

    /**
     */
    persistToSessionStorage() {

        if (this.options.sessionStorageKey && this.options.sessionStorage) {
            const storeJson = this.serialize();
            this.setItem(JSON.stringify(storeJson));
        }
    }

    /**
     * get sessionStorage persisted object
     * @return {object}
     */
    getSessionStorageObject() {

        let objectTree;
        if (this.options.sessionStorageKey) {
            const session = this.options.sessionStorage.getItem(this.options.sessionStorageKey);
            objectTree = session ? JSON.parse(session) : {};
        } else {
            objectTree = {};
        }
        return objectTree;

    }

    clearSessionStorage() {
        this.setItem(null);
    }

    /**
     * @param {string | null} item
     */
    setItem(item) {
        try {
            this.options.sessionStorage.setItem(this.options.sessionStorageKey, item);
        } catch (e) {
            // NOTE: Safari Private Browsing mode has a limitation where session storage is allocated 
            // zero space and would throw a "QuotaExceededError: DOM Exception 22". 
            // This would make preserving state upon refresh not possible.
            // A nicer way to deal with this scenario will be handled in the future.
            console.log('Failed to save state in session storage.', e);
        }
    }
}
