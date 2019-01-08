import FilterItem from './filter-item';

/**
 * filter if has all of serveral specificed > default is AND (see type='OR')
 * item.info.features > Array
*/
export default class FilterFeature extends FilterItem {

    constructor(o) {
        super(o);

        this.type = o.type || 'AND';
        
        /** @type {object} */
        this.allFeatures = o.allFeatures || [];
        
        /** @type {object {filterCount: number}} */
        this.allAvailableFeatures = o.allAvailableFeatures || [];
    }

    init(items) {

        //find available features from all the items and initilize object
        this.allAvailableFeatures = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const features = item.info.features;
            if (features) {
                for (let j = 0; j < features.length; j++) {
                    const feature = features[j];
                    let feat = this.findAllAvailableFeature(feature);
                    if (!feat) {
                        //copy from all features but add counts
                        this.allAvailableFeatures.push(Object.assign({
                            isSelected: !(this.type === 'AND'),
                            filterCount: 0
                        }, this.findFeature(feature)));
                    }
                }
            }
        }
        
        this.sortPopularAlpha();
    }
    
    sortPopularAlpha() {

        return this.allAvailableFeatures.sort(function (o1, o2) {
            // Order by count, then name 
            const countComparison = o2.filterCount - o1.filterCount;
            if (countComparison !== 0) {
                return countComparison;
            }

            if (o1.name < o2.name) {
                return -1;
            }
            if (o1.name > o2.name) {
                return 1;
            }
            return 0;
        });
    }

    filterItem(item) {

        //if no selections show them all
        if (!this.hasSelections()) {
            return true;
        }

        if (this.type === 'OR') {
            //OR
            return this.allAvailableFeatures.some(feature => {
                return feature.isSelected && item.info.features.indexOf(feature.key) !== -1;
            });
        } else {
            //AND
            return this.allAvailableFeatures.every(feature => {
                return !(feature.isSelected && item.info.features.indexOf(feature.key) === -1);
            });
        }

    }

    hasSelections() {
        return this.allAvailableFeatures.some((feat) => {
            return feat.isSelected;
        });
    }

    addFilterCounts(item) {

        if (item.info.features) {
            item.info.features.forEach(itemFeature => {
                this.allAvailableFeatures.forEach(feat => {
                    if (feat.key === itemFeature) {
                        feat.filterCount++;
                    }
                });
            });
        }
    }

    resetFilterCounts() {
        this.allAvailableFeatures.forEach((feature) => {
            feature.filterCount = 0;
        });
    }

    findFeature(key) {
        return this.allFeatures.find((feature) => {
            return feature.key === key;
        });
    }

    findAllAvailableFeature(key) {
        return this.allAvailableFeatures.find((feature) => {
            return feature.key === key;
        });
    }

    changeFeatureSelection(key, value) {

        let feat = this.findAllAvailableFeature(key);

        if (!feat) {
            return;
        }
        feat.isSelected = value;
    }
}
