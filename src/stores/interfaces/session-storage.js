export default class SessionStorage {

    /**
     * @interface
     */
    constructor() {}

    /**
     * @param {string} key
     * @return {string}
     */
    getItem(key) {}

    /**
     * @param {string} key
     * @param {string} item
     */
    setItem(key, item) {}

}
