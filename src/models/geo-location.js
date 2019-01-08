import Model from './model';

const ConversionUtil = {
    KILOMETERS_PER_MILE: 1.6093419
};

const EARTH_RADIUS_MILES = 3963.205;

class CartesianPoint {

    /**
     * @constructor
     * @param {GeoLocation} point
     */
    constructor(point) {
        this._x = undefined;
        this._y = undefined;
        this._z = undefined;

        this.setX(EARTH_RADIUS_MILES * Math.cos(point.theta()) * Math.sin(point.phi()));
        this.setY(EARTH_RADIUS_MILES * Math.sin(point.theta()) * Math.sin(point.phi()));
        this.setZ(EARTH_RADIUS_MILES * Math.cos(point.phi()));
    }

    getX() {
        return this._x;
    }

    setX(x) {
        this._x = x;
    }

    getY() {
        return this._y;
    }

    setY(y) {
        this._y = y;
    }

    getZ() {
        return this._z;
    }

    setZ(z) {
        this._z = z;
    }

}

export default class GeoLocation extends Model {

    constructor(o) {
        super(o);

        /** @type {number} */
        this.lat = o.lat || null;

        /** @type {number} */
        this.lng = o.lng || null;

    }

    /**
     * phi is the angle from the north pole. It is 0 at the north pole and 90 degress at the south pole.
     * This is returned in radians.
     * @return {number}
     */
    phi() {
        return ((90.0 - this.lat) * 2 * Math.PI) / 360.0;
    }

    /**
     * theta is the angle starting at longtitude 0 and moving east
     * This is returned in radians.
     * @return {number}
     */
    theta() {
        let resultInDgrees;
        if (this.lng >= 0.0) {
            resultInDgrees = this.lng;
        } else {
            resultInDgrees = 360.0 - Math.abs(this.lng);
        }
        return (resultInDgrees * 2 * Math.PI) / 360;
    }

    /**
     * @param {GeoLocation} point1
     * @param {GeoLocation} point2
     * @return {number}
     */
    static straightLineDistanceInMiles(point1, point2) {
        const c1 = new CartesianPoint(point1);
        const c2 = new CartesianPoint(point2);
        return Math.sqrt(Math.pow(c2.getX() - c1.getX(), 2) + Math.pow(c2.getY() - c1.getY(), 2) + Math.pow(c2.getZ() - c1.getZ(), 2));
    }

    /**
     * @param {GeoLocation} point1
     * @param {GeoLocation} point2
     * @return {number}
     */
    static surfaceDistanceInMiles(point1, point2) {
        const straightLineDistance = GeoLocation.straightLineDistanceInMiles(point1, point2);
        return 2 * (EARTH_RADIUS_MILES) * Math.asin(straightLineDistance / (2 * EARTH_RADIUS_MILES));
    }

    /**
     * @param {LIQ_SHOP.models.GeoLocation} point1
     * @param {LIQ_SHOP.models.GeoLocation} point2
     * @return {number}
     */
    static surfaceDistanceInKilometers(point1, point2) {
        return GeoLocation.surfaceDistanceInMiles(point1, point2) * ConversionUtil.KILOMETERS_PER_MILE;
    }

}

