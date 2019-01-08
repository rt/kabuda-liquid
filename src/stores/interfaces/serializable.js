export default class Serializable {

    /**
     * all shopping ember model classes should inherit this
     * @interface
     */
    constructor() {}

    /**
     * @return {object}
     */
    serialize() {}

    /**
     * deserialize to appropriate classes
     * @param {object} o
     */
    deserialize(o) {}

}
