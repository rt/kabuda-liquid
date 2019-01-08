import uuid from 'uuid';

export default class ObjectStore {
    /**
     * @constructor
     * @param {object} options
     * options
     * - onChange {Function}
     */
    constructor(options) {
        /**
         * @type {object}
         */
        this.options = options;

        this.initialize();
    }

    /**
     * initialize store
     */
    initialize() {
        this.initializeStore();
        this.initializeSubscribers();
    }

    initializeStore() {

        /**
         * @type {Object.<string, Array.<KABUDA.stores.Serializable>>}
         */
        this._store = {};
    }

    initializeSubscribers() {

        /**
         * @type {Object.<Array.<Function>>}
         */
        this.subscribers = {};
    }

    /**
     * @param {string} eventName
     * @param {object} context
     * @param {Function} subscribeCb
     * @param {Function} initCb
     */
    subscribe(eventName, context, subscribeCb, initCb) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        if (context === undefined) {
            context = null;
        }

        this.subscribers[eventName].push({subscribeCb: subscribeCb, initCb: initCb, context: context});
    }

    /**
     * @param {string} eventName
     * @param {object} context
     * @param {Function} cb
     */
    subscribeAndInit(eventName, context, cb) {
        this.subscribe(eventName, context, cb, cb);
        cb.bind(context)();
    }

    /**
     * @param {string} eventName
     * @param {object} context
     * @param {Function} subscribeCb
     * @param {Function} initCb
     */
    subscribeAndInitSeparate(eventName, context, subscribeCb, initCb) {
        this.subscribe(eventName, context, subscribeCb, initCb);
        initCb.bind(context)();
    }

    /**
     * @param {string} eventName
     * @param {Function} cb
     */
    unsubscribe(eventName, cb) {
        const subscribers = this.subscribers[eventName] || [];

        for (let i = subscribers.length - 1; i >= 0; i -= 1) {
            let subscriber = subscribers[i];
            if (subscriber.subscribeCb === cb) {
                subscribers.splice(i, 1);
                break;
            }
        }
    }

    /**
     * @param {string} eventName
     * @param {object} callbackObject
     */
    fire(eventName, callbackObject) {
        if (this.subscribers[eventName]) {
            for (let i = 0; i < this.subscribers[eventName].length; i++) {
                let subscriber = this.subscribers[eventName][i];
                subscriber.subscribeCb.bind(subscriber.context)(callbackObject);
            }
        }
    }

    /**
     * @param {string} eventName
     */
    fireInit(eventName) {
        if (this.subscribers[eventName]) {
            for (let i = 0; i < this.subscribers[eventName].length; i++) {
                let subscriber = this.subscribers[eventName][i];
                if (subscriber.initCb) {
                    subscriber.initCb.bind(subscriber.context)();
                }
            }
        }
    }

    /**
     * @param {string} collectionName
     * @param {object} obj
     * @param {boolean} suppressChangeEvent
     * @return {object}
     */
    create(collectionName, obj, suppressChangeEvent) {

        obj._id = uuid.v1();

        obj._timestamp = Date.now();
        this._store[collectionName].push(obj);
        !suppressChangeEvent && this.options.onChange && this.options.onChange();
        return this.decouple(obj);
    }

    /**
     * @param {string} collectionName
     */
    releaseOldest(collectionName) {
        let t = Date.now();
        let itemToRemove;
        for (let i = 0; i < this._store[collectionName].length; i++) {
            let item = this._store[collectionName][i];
            if (item._timestamp < t) {
                t = item._timestamp;
                itemToRemove = item;
            }
        }
        if (itemToRemove) {
            this.remove(collectionName, itemToRemove);
        }
    }

    /**
     * @param {string} collectionName
     * @param {object} obj
     * @param {boolean} suppressChangeEvent
     */
    update(collectionName, obj, suppressChangeEvent) {

        for (let i = 0; i < this._store[collectionName].length; i++) {
            let item = this._store[collectionName][i];
            if (item._id === obj._id) {
                this._store[collectionName][i] = obj;
                break;
            }
        }
        !suppressChangeEvent && this.options.onChange && this.options.onChange();
    }

    /**
     * @param {string} collectionName
     * @param {object} obj
     * @param {boolean} suppressChangeEvent
     */
    remove(collectionName, obj, suppressChangeEvent) {

        for (let i = 0; i < this._store[collectionName].length; i++) {
            let item = this._store[collectionName][i];
            if (item._id === obj._id) {
                this._store[collectionName].splice(i, 1);
                break;
            }
        }
        !suppressChangeEvent && this.options.onChange && this.options.onChange();
    }

    /**
     * @param {string} collectionName
     * @param {Function} fn (item, index)
     * @return {Array.<object>}
     */
    find(collectionName, fn) {

        const ret = [];
        for (let i = 0; i < this._store[collectionName].length; i++) {
            let item = this._store[collectionName][i];
            if (fn(item, i)) {
                ret.push(item);
            }
        }
        return this.decouple(ret);
    }

    /**
     * @param {string} collectionName
     * @return {Array.<object>}
     */
    all(collectionName) {
        return this.decouple(this._store[collectionName]);
    }

    /**
     * this will not work on native date objects (we use number)
     * will copy only things in JSON spec
     * note: JSON.stringify({key: undefined}) //=> "{}", null is fine
     * @param {object} o
     * @return {object}
     */
    decouple(o) {
        return JSON.parse(JSON.stringify(o));
    }

    /**
     * @param {string} collectionName
     * @return {object|null}
     */
    getFirstObject(collectionName) {
        if (this._store[collectionName].length > 0) {
            return this.decouple(this._store[collectionName][0]);
        } else {
            return null;
        }
        return null;
    }

    /**
     * @param {string} collectionName
     * @param {number} id
     * @return {object}
     */
    getObjectById(collectionName, id) {
        const collection = this._store[collectionName];
        for (let i = 0; i < collection.length; i++) {
            let obj = collection[i];
            if (obj._id === id) {
                return this.decouple(obj);
            }
        }
        return null;
    }

    /**
     * @param {string} collectionName
     * @param {Array.<object>} collection
     */
    setCollection(collectionName, collection) {
        this.clearCollection(collectionName);
        collection.forEach((obj) => {
            this.create(collectionName, obj, true);
        });
        this.options.onChange && this.options.onChange();
    }

    /**
     * @param {string} collectionName
     */
    clearCollection(collectionName) {
        this._store[collectionName] = [];
        this.options.onChange && this.options.onChange();
    }

    /**
     * @param {string} collectionName
     * @param {Array.<object>} items
     */
    addCollectionItems(collectionName, items) {
        items.forEach((item) => {
            this.create(collectionName, item, true);
        });
        this.options.onChange && this.options.onChange();
    }

    /**
     * update only items in the collection passed in
     * @param {string} collectionName
     * @param {Array.<object>} items
     */
    updateCollectionItems(collectionName, items) {
        items.forEach((item) => {
            this.update(collectionName, item, true);
        });
        this.options.onChange && this.options.onChange();
    }

    /**
     * delete only items in the collection passed in
     * @param {string} collectionName
     * @param {Array.<object>} items
     */
    removeCollectionItems(collectionName, items) {
        items.forEach((item) => {
            this.remove(collectionName, item, true);
        });
        this.options.onChange && this.options.onChange();
    }

    /**
     * for export
     * @return {object}
     */
    serialize() {

        const o = {};

        o.store = this._store;

        return o;
    }

    /**
     * deserialize object tree
     * @param {object} objectTree
     */
    deserialize(objectTree) {

        const store = objectTree.store || {};

        for (let key in this.options.schema) {

            store[key] = store[key] || [];

            this._store[key] = [];
            for (let i = 0; i < store[key].length; i++) {
                let o = store[key][i];

                this._store[key].push(o);
            }
        }
        this.options.onChange && this.options.onChange();
    };

    /**
     * Reinitialize all the properties of store and clear cache
     */
    reinitialize() {
        this.initializeStore();
        this.deserialize({});
    };

}

