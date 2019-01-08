
export default class GetSet {

    static get(obj, path) {
        if (!obj || !(obj instanceof Object)) {
            throw new Error('GetSet:get(): no object');
        } 

        if (!path || typeof path !== 'string') {
            throw new Error('GetSet:get(): no path');
        }

        //if (path === '.') {
            //return obj;
        //}

        let o = obj;
        let parts = path.split('.');
        for (const part of parts) {
            o = o[part];
            if (o === undefined) {
                return null;
            }
        }
        return o;

    }

    static set(obj, path, val) {
        if (!obj || !(obj instanceof Object)) {
            throw new Error('GetSet:set(): no object');
        } 

        if (!path || typeof path !== 'string') {
            throw new Error('GetSet:set(): no path');
        }
       
        let parts = path.split('.');
        let o = obj;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                o[part] = val;
                break;
            }

            if (o[part] === undefined) {
                o[part] = {};
            }
            o = o[part];
        }
    }
}
