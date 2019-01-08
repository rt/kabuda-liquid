
export default class Model {

    constructor(o) {
        this.deserialize(o || {});
    }

    /**
     * helper for applying an known id 
     * usually when you want to reinitialize, or blow a model away while keeping its id, so it can update
     * @param {number} id
     */
    setId(id) {
        this._id = id;
    }
    
    getId() {
        return this._id;
    }

    /**
     * @param {object} o
     * @param {string} propName
     * @param {Function} Cls
     * @param {boolean} ensure
     */
    deserializeProperty(o, propName, Cls, ensure) {
        if (o[propName]) {
            this[propName] = new Cls(o[propName]);
        } else if (ensure) {
            this[propName] = new Cls({});
        }
    }

    /**
     * @param {object} o
     * @param {string} propName
     * @param {Function} Cls
     */
    deserializeArray(o, propName, Cls) {
        let a = [];
        if (o[propName]) {
            a = o[propName].map(item => {
                return new Cls(item);
            });
        }
        this[propName] = a;
    }

    /**
     * @param {object} o
     * @param {string} propName
     * @param {Function} Cls
     */
    deserializeMap(o, propName, Cls, ArrayItemCls) {
        let a = {};
        if (o[propName]) {
            Object.keys(o[propName]).forEach(function (key) {
                //we only consider Array, could do Object, .. and nested too ...
                if (Cls === Array) {
                    let array = o[propName][key] || [];
                    a[key] = array.map(item => {
                        return new ArrayItemCls(item);
                    });
                } else {
                    a[key] = new Cls(o[propName][key]);
                }
            });
        }
        this[propName] = a;
    }

    /**
     * @param {Array.<string>}
     * @return {object}
     */
    serialize() {

        function getValue(item) {
            return item instanceof Model ? item.serialize() : item;
        }

        let o = {};
        for (let key in this) {
            if (this.hasOwnProperty(key) && typeof this[key] !== 'function') {
                if (Array.isArray(this[key])) {
                    o[key] = this[key].map(function (item) {
                        return getValue(item);
                    });
                } else {
                    o[key] = getValue(this[key]);
                }
            }
        }
        return o;
    }

    deserialize(o) {

        for (let key in o) {
            if (o.hasOwnProperty(key) && typeof o[key] !== 'function') {
                //and is native ...
                
                this[key] = o[key];// > wont be inherited, not prototype...
            }
        }
    }
}
