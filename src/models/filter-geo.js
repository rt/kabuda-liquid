import FilterItem from './filter-item';
import GeoLocation from './geo-location';

export default class FilterGeo extends FilterItem {

    constructor(o) {
        super(o);
        
        /** @type {MapInterface} */
        this.mapViewPort = o.mapViewPort || null;
    }

    //init(items) {

    //}

    filterItem(item) {
        let result = true;

        if (this.mapViewPort) {
            result = this.mapViewPort.contains(item.info.latitude, item.info.longitude);
        }
        return result;
    }

    sortItem(o1, o2, sortCenter) {

        if (!o1.latitude && o2.latitude) {
            return 1;
        }
        if (o1.latitude && !o2.latitude) {
            return -1;
        }
        if (!o1.latitude && !o2.latitude) {
            return 0;
        }

        if (sortCenter) {
            const d1 = GeoLocation.surfaceDistanceInMiles(sortCenter, new GeoLocation({
                lat: o1.latitude,
                lng: o1.longitude
            }));
            const d2 = GeoLocation.surfaceDistanceInMiles(sortCenter, new GeoLocation({
                lat: o2.latitude,
                lng: o2.longitude
            }));
            return d1 - d2;
        } else {
            return 0;
        }
    }
    
}
