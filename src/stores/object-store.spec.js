import chai from 'chai';
import ObjectStore from './object-store';

chai.expect();

const expect = chai.expect;

describe('ObjectStore', () => {

    let store = null;
    const EVENT = 'EVT';
    beforeEach(() => {
        store = new ObjectStore({
            schema: {
                collection: Object 
            }
        });
        //maybe this should be in the ObjectStore constructor
        store.deserialize({});
    });

    describe('constructor', () => {
        it('should init store and subscribers', () => {

            expect(store._store).to.deep.eq({
                collection: []
            });
            expect(store.subscribers).to.deep.eq({});
        });
    });
    
    describe('serialize', () => {
        it('should serialize store and counter', () => {

            let o = store.serialize();
            expect(o.store).to.deep.eq({
                collection: []
            });
            expect(store.subscribers).to.deep.eq({});
        });
    });
    
    describe('deserialize', () => {
        it('should deserialize store and counter', () => {

            store.deserialize({
                store: {
                    collection: [
                        {_id:1, data: 'blah'}
                    ]
                }
            });
            expect(store.getObjectById('collection', 1).data).to.eq('blah');
        });
    });

    describe('subscribeAndInit', () => {
        it('should init and be called on subscribe', (done) => {

            let hitCount = 0;
            function initAndSubscribeHandler() {
                hitCount++;
                if (hitCount === 2) {
                    done();
                }
            }
            
            store.subscribeAndInit(EVENT, null, initAndSubscribeHandler);
            store.fire(EVENT);
        });
    });

    describe('unsubscribe', () => {
        it('should be able to unsubscribe a context', () => {

            function subscribeHanlder() { }
            
            store.subscribe(EVENT, null, subscribeHanlder);
            expect(store.subscribers[EVENT].length).to.be.eq(1);
            store.unsubscribe(EVENT, subscribeHanlder);
            expect(store.subscribers[EVENT].length).to.be.eq(0);
            
        });
    });
    
    describe('fire', () => {
        it('should fire subscribe event', (done) => {

            function subscribeHanlder() { 
                done();
            } 
            store.subscribe(EVENT, null, subscribeHanlder);
            store.fire(EVENT);
        });
    });

    describe('fireInit', () => {
        it('should fire init event', (done) => {

            function initHandler() { 
                done();
            } 
            store.subscribe(EVENT, null, null, initHandler);
            store.fireInit(EVENT);
        });
    });

    describe('create', () => {
        it('should create obj in collection', () => {
            store.create('collection', {data: 'foo'}, false);
            let collection = store.all('collection');
            expect(collection.length).to.eq(1);
            let o = collection[0];
            expect(o._id).to.not.be.undefined;
            expect(o._timestamp).to.not.be.undefined;
            expect(o.data).to.eq('foo');
        });
        
    });

    describe('update', () => {
        it('should update obj in collection', () => {
            store.create('collection', {data: 'foo'}, false);
            let collection = store.all('collection');
            expect(collection.length).to.eq(1);
            let o = collection[0];
            o.data = 'bar';
            store.update('collection', o);

            collection = store.all('collection');
            expect(collection.length).to.eq(1);
            o = collection[0];
            expect(o.data).to.eq('bar');
        });
    });

    describe('remove', () => {
        it('should remove obj in collection', () => {
            store.create('collection', {data: 'foo'}, false);
            let collection = store.all('collection');
            expect(collection.length).to.eq(1);
            let o = collection[0];

            store.remove('collection', o);

            collection = store.all('collection');
            expect(collection.length).to.eq(0);
        });
        
    });

    describe('getFirstObject', () => {
        it('should retrive first object', () => {
            let o = store.create('collection', {data:1}, false);
            store.create('collection', {data:2}, false);
            let collection = store.all('collection');
            expect(collection.length).to.eq(2);

            let oo = store.getFirstObject('collection');

            expect(oo._id).to.eq(collection[0]._id);
        });
    });

    describe('releaseOldest', () => {
        it('should release oldest object', (done) => {
            store.create('collection', {data:1}, false);
            setTimeout(() => {
                store.create('collection', {data:2}, false);

                let collection = store.all('collection');
                expect(collection.length).to.eq(2);

                store.releaseOldest('collection');

                collection = store.all('collection');
                expect(collection.length).to.eq(1);

                expect(collection[0].data).to.eq(2);

                done();
            }, 10);
        });
    });

    describe('getObjectById', () => {
        it('should get object by _id', () => {
            let o = store.create('collection', {}, false);
            let oo = store.getObjectById('collection', o._id);
            expect(oo._id).to.eq(o._id);
        });
    });

    describe('setCollection', () => {
        it('should set a collection of objects', () => {
            store.setCollection('collection', [
                {data: 'foo'},
                {data: 'bar'}
            ]);
            let collection = store.all('collection');
            expect(collection.length).to.eq(2);
            expect(collection[0]._id).to.not.be.undefined;
            expect(collection[1]._id).to.not.be.undefined;
        });
    });

    describe('clearCollection', () => {
        it('should set a collection of objects', () => {
            store.setCollection('collection', [
                {data: 'foo'},
                {data: 'bar'}
            ]);
            let collection = store.all('collection');
            expect(collection.length).to.eq(2);
           
            store.clearCollection('collection');
            
            collection = store.all('collection');
            expect(collection.length).to.eq(0);
        });
    });

    describe('addCollectionItems', () => {
        it('should add a collection an existing collection', () => {
            store.setCollection('collection', [
                {data: 'foo'},
                {data: 'bar'}
            ]);
            let collection = store.all('collection');
            expect(collection.length).to.eq(2);
           
            store.addCollectionItems('collection', [
                {data: 'other'}
            ]);
            
            collection = store.all('collection');
            expect(collection.length).to.eq(3);
        });
    });
    
    describe('updateCollectionItems', () => {
        it('should update a collection of items in an existing collection', () => {
            store.setCollection('collection', [
                {data: 'foo'},
                {data: 'bar'},
                {data: 'blah'},
            ]);
            let collection = store.all('collection');
            expect(collection.length).to.eq(3);
           
            let fooObj = collection[0];
            fooObj.data = 'foo1';
            let barObj = collection[1];
            barObj.data = 'bar1';
            store.updateCollectionItems('collection', [fooObj, barObj]); 
            collection = store.all('collection');
            expect(collection.length).to.eq(3);
            
            expect(store.getObjectById('collection', fooObj._id).data).to.eq('foo1');
            expect(store.getObjectById('collection', barObj._id).data).to.eq('bar1');
        });
    });

    describe('removeCollectionItems', () => {
        it('should remove a collection of items in an existing collection', () => {
            store.setCollection('collection', [
                {data: 'foo'},
                {data: 'bar'},
                {data: 'blah'},
            ]);
            let collection = store.all('collection');
            expect(collection.length).to.eq(3);
           
            let fooObj = collection[0];
            let barObj = collection[1];
            store.removeCollectionItems('collection', [fooObj, barObj]); 
            collection = store.all('collection');
            expect(collection.length).to.eq(1);
            
        });
    });

});
