import FilterItem from './filter-item';

export default class FilterText extends FilterItem {

    constructor(o) {

        super(o);

        /** @type {string} */
        this.text = o.text || null;
    }

    filterItem(item) {
        if (this.text) {
            if (item.itemName.toLowerCase().indexOf(this.text.toLowerCase()) !== -1) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

}
