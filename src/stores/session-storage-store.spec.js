import chai from 'chai';
import SessionStorageStore from './session-storage-store';
import ClassStore from './class-store';
import ObjectStore from './object-store';

chai.expect();

const expect = chai.expect;

describe('SessionStore', () => {
    let store = null;
    let cls = null;

    class FakeSessionStorage {
        constructor() {
            this.hash = {};
        }

        getItem(key) {
            if (key in this.hash) {
                return this.hash[key];
            } else {
                return null;
            }
        }

        setItem(key, str) {
            this.hash[key] = str;
        }
    }

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

        store = new SessionStorageStore({
            schema: {
                collection: Cls
            },
            sessionStorageKey: 'test',
            sessionStorage: new FakeSessionStorage()
        });
    });

    describe('constructor', () => {
        it('should be instance of SessionStore, ClassStore and ObjectStore', () => {
            expect(store).to.be.instanceof(SessionStorageStore);
            expect(store).to.be.instanceof(ClassStore);
            expect(store).to.be.instanceof(ObjectStore);
        });
    });
    
    describe('persistToSessionStorage/getSessionStorageObject', () => {
        it('should persist to session storage', () => {
            store.persistToSessionStorage();
            let storeObj = store.getSessionStorageObject();
            expect(storeObj.store).to.deep.eq({
                collection: []
            });
        });
    });
    
    describe('onChange', () => {
        it('should persist to session storage onChange', () => {
            store.create('collection', new Cls({data: 'foo'}));
            let storeObj = store.getSessionStorageObject();
            expect(storeObj.store.collection.length).to.eq(1);
        });
    });
});
