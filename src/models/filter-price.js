import FilterItem from './filter-item';

export default class FilterPrice extends FilterItem {

    constructor(o) {
        super(o);
        
        /** @type {number} */
        this.priceRangeMinimum = o.priceRangeMinimum || null;

        /** @type {number} */
        this.priceRangeMaximum = o.priceRangeMaximum || null;
        
        /** @type {number} */
        this.priceRangeMinimumPosition = o.priceRangeMinimumPosition || null;

        /** @type {number} */
        this.priceRangeMaximumPosition = o.priceRangeMaximumPosition || null;
    }

    init(items) {

        if (items.length === 0) {
            return;
        }

        let priceRangeMinimumPosition = Number.MAX_VALUE;
        let priceRangeMaximumPosition = -Number.MAX_VALUE;

        items.forEach((item) => {
            const price = item.info && item.info.price;
            if (price) {
                if (price < priceRangeMinimumPosition) {
                    priceRangeMinimumPosition = price;
                }

                if (price > priceRangeMaximumPosition) {
                    priceRangeMaximumPosition = price;
                }
            }
        });

        this.priceRangeMinimumPosition = Math.floor(priceRangeMinimumPosition);
        this.priceRangeMaximumPosition = Math.ceil(priceRangeMaximumPosition);

        this.priceRangeMinimum = this.priceRangeMinimumPosition;
        this.priceRangeMaximum = this.priceRangeMaximum || this.priceRangeMaximumPosition;

        if (this.priceRangeMaximum < this.priceRangeMinimumPosition || this.priceRangeMaximum > this.priceRangeMaximumPosition) {
            this.priceRangeMaximum = this.priceRangeMaximumPosition;
        }

    }

    filterItem(item) {
        const price = item.info && item.info.price;
        if (this.priceRangeMaximum !== -1 && price) {
            if (!(price >= this.priceRangeMinimum && price <= this.priceRangeMaximum)) {
                return false;
            }
        }
        return true;
    }

}
