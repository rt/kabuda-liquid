import ObjectStore from './object-store';

export default class ClassStore extends ObjectStore {

    /**
     * @constructor
     * @extends {KABUDA.stores.ObjectStore}
     * @param {object} options
     */
    constructor(options) {
        super(options);
    }

    /**
     * @param {object} table
     */
    addTable(table) {
        this._store[table.name] = this._store[table.name] || [];
        this.options.schema[table.name] = table.model;
        Object.assign(this, table.methods);
    }

    /**
     * @param {string} collectionName
     * @param {class} obj
     */
    create(collectionName, obj) {
        obj = super.create(collectionName, obj.serialize());
        return new this.options.schema[collectionName](obj);
    }

    /**
     * @param {string} collectionName
     * @param {object} obj
     */
    update(collectionName, obj) {
        obj = obj.serialize();
        obj = super.update(collectionName, obj);
    }

    /**
     * @param {string} collectionName
     * @param {Function} fn (item, index)
     */
    find(collectionName, fn) {

        const ret = [];
        for (let i = 0; i < this._store[collectionName].length; i++) {
            let item = this._store[collectionName][i];
            if (fn(item, i)) {
                ret.push(this.deserializeObject(collectionName, item));
            }
        }
        return ret;
    }

    /**
     * @param {string} collectionName
     * @return {Array.<object>}
     */
    all(collectionName) {
        return this.find(collectionName, () => {
            return true;
        });
    }

    /**
     * @param {string} collectionName
     * @param {number} startIndex
     * @param {number} endIndex
     * @return {Array.<object>}
     */
    slice(collectionName, startIndex, endIndex) {
        return this.find(collectionName, (item, index) => {
            return index >= startIndex && index < endIndex;
        });
    }

    /**
     * expose base javascript objects
     * @param {string} collectionName
     * @param {Function} fn (item, index)
     * @return {Array.<object>}
     */
    findObjects(collectionName, fn) {
        return super.find(collectionName, fn);
    }

    /**
     * expose base javascript objects
     * @param {string} collectionName
     * @return {Array.<object>}
     */
    allObjects(collectionName) {
        return super.all(collectionName);
    }

    /**
     * expose base
     * @param {string} collectionName
     * @param {Array.<object>} objects
     */
    setCollectionObjects(collectionName, objects) {
        objects.forEach(obj => {
            super.create(collectionName, obj);
        });
    }

    /**
     * @param {string} collectionName
     * @return {object|null}
     */
    getFirstObject(collectionName) {
        const obj = super.getFirstObject(collectionName);
        return obj && this.deserializeObject(collectionName, obj);
    }

    /**
     * @param {string} collectionName
     * @param {number} id
     * @return {object}
     */
    getObjectById(collectionName, id) {
        const obj = super.getObjectById(collectionName, id);
        return obj && this.deserializeObject(collectionName, obj);
    }

    /**
     * @param {string} collection
     * @param {object} o
     */
    deserializeObject(collection, o) {
        /**
         * @type {KABUDA.stores.Serializable}
         */
        const item = new this.options.schema[collection](o);
        return item;
    }

}
