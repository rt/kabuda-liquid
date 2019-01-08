import chai from 'chai';
import ClassStore from './class-store';
import ObjectStore from './object-store';

chai.expect();

const expect = chai.expect;

describe('ClassStore', () => {

    let store = null;
    let cls = null;
    class Cls {
        constructor(o) {
            for (let key in o) {
                if (o.hasOwnProperty(key) && typeof o[key] !== 'function') {
                    this[key] = o[key];
                }
            }
        }

        serialize() {
              let o = {}; 
              for (let key in this) {
                  if (this.hasOwnProperty(key) && typeof this[key] !== 'function') {
                      o[key] = this[key];
                  }   
              }   
              return o;
        }
    }

    const EVENT = 'EVT';
    beforeEach(() => {

        store = new ClassStore({
            schema: {
                collection: Cls 
            }
        });
        //maybe this should be in the ObjectStore constructor
        store.deserialize({});
    });

    describe('constructor', () => {
        it('should be instance of ClassStore and ObjectStore', () => {
            expect(store).to.be.instanceof(ClassStore);
            expect(store).to.be.instanceof(ObjectStore);
        });
    });
    
    describe('create', () => {
        it('should create obj in collection with cls and return a cls', () => {
            store.create('collection', new Cls({data: 'foo'}));
            let collection = store.all('collection');
            expect(collection.length).to.eq(1);
            let o = collection[0];
            expect(o).to.be.instanceof(Cls);
            expect(o.data).to.eq('foo');
        });
    });
    
    describe('update', () => {
        it('should update obj in collection with cls', () => {
            store.create('collection', new Cls({data: 'foo'}), false);
            let collection = store.all('collection');
            expect(collection.length).to.eq(1);
            let o = collection[0];
            o.data = 'bar';
            store.update('collection', o);

            collection = store.all('collection');
            expect(collection.length).to.eq(1);
            o = collection[0];
            expect(o.data).to.eq('bar');
            expect(o).to.be.instanceof(Cls);
        });
    });

    describe('getObjectById', () => {
        it('should get object by _id', () => {
            let o = store.create('collection', new Cls());
            let oo = store.getObjectById('collection', o._id);
            expect(oo._id).to.eq(o._id);
            expect(oo).to.be.instanceof(Cls);
        });
    });
    
    describe('getFirstObject', () => {
        it('should retrive first object', () => {
            let o = store.create('collection', new Cls({data:1}));
            store.create('collection', new Cls({data:2}));
            let collection = store.all('collection');
            expect(collection.length).to.eq(2);

            let oo = store.getFirstObject('collection');

            expect(oo._id).to.eq(collection[0]._id);
            expect(oo).to.be.instanceof(Cls);
        });
    });

    describe('deserializeObject', () => {
        it('should deserialize object to cls', () => {
            let cls = store.deserializeObject('collection', {data: 'foo'});
            expect(cls).to.be.instanceof(Cls);
        });
    });
});
