import FilterItem from './filter-item';

const getFilterableStarRating = (rating) => {
    if (!rating) {
        rating = 0;
    }
    if (rating === 0) {
        rating = 1.0;
    }

    return Math.ceil(rating);
};

export default class FilterStarRating extends FilterItem {

    constructor(o) {
        super(o);

        /** @type {string} */
        this.starRatings = o.starRatings || null;
    }

    init(items) {

        const allAvailableStarRatingsHash = {};

        items.forEach((item) => {
            const rating = item.info && item.info.rating;
            if (rating) {
                const filterableStarRating = getFilterableStarRating(rating);

                if (!allAvailableStarRatingsHash.hasOwnProperty(filterableStarRating.toString())) {
                    allAvailableStarRatingsHash[filterableStarRating.toString()] = {
                        value: filterableStarRating,
                        isSelected: true,
                        filterCount: 0
                    };
                }
            }
        });

        //put it on an array
        const allAvailableStarRatings = [];
        for (let rating in allAvailableStarRatingsHash) {
            allAvailableStarRatings.push(allAvailableStarRatingsHash[rating]);
        }

        this.allAvailableStarRatings = allAvailableStarRatings;

    }

    filterItem(item) {

        const rating = item.info && item.info.rating;
        if (this.allAvailableStarRatings.length > 0) {
            const filterRating = rating === 0 ? 1 : Math.ceil(rating);

            const found = this.allAvailableStarRatings.some((rating) => {
                return rating.isSelected && rating.value === filterRating;
            });

            if (!found) {
                return false;
            }
        }
        return true;
    }

    resetFilterCounts() {

        if (this.allAvailableStarRatings.length > 0) {
            this.allAvailableStarRatings.forEach(rating => {
                rating.filterCount = 0;
            });
        }
    }

    addFilterCounts(item) {
        this.allAvailableStarRatings.forEach(rating => {
            if (rating.value === getFilterableStarRating(item.info.rating)) {
                rating.filterCount++;
            }
        });
    }

    sortItem(o1, o2) {

        //todo: could consider when rating doesnt exist on the item..
        return o2.info.rating - o1.info.rating;
    }

}
