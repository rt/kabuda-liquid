import Model from './model';

export default class FilterItem extends Model {

    constructor(o) {
        super(o);
    }

    init() {
    }

    /* eslint-disable no-unused-vars */
    filterItem(item) {
        return true;
    }

    sortItem(o1, o2) {
        return 0;
    }

    /* eslint-disable no-unused-vars */
    addFilterCounts(item) {
    }

    resetFilterCounts() {
    }

}
