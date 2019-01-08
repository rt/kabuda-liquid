import chai from 'chai';
import GetSet from './getset';

const expect = chai.expect;

describe('#GetSet', () => {

    let model;
    beforeEach(() => {
    });

    afterEach(() => {
    });

    describe('#get', () => {

        it('should have object', () => {
            expect(() => {GetSet.get(undefined, 'aa')}).to.throw();
            expect(() => {GetSet.get(null, 'aa')}).to.throw();
            expect(() => {GetSet.get('asdf', 'aa')}).to.throw();
            expect(() => {GetSet.get(12, 'aa')}).to.throw();
        });
        
        it('should have path', () => {
            expect(() => {GetSet.get({})}).to.throw;
        });

        it('should return null if path does not exist', () => {
            expect(GetSet.get({}, 'aa')).to.be.null;
            expect(GetSet.get({}, 'aa.bb')).to.be.null;
            expect(GetSet.get({aa: 1}, 'aa.bb')).to.be.null;
            expect(GetSet.get({aa: 1}, 'aa.bb.cc')).to.be.null;
        });
        
        it('should return obj/val at path if path does exist', () => {
            expect(GetSet.get({aa: 1}, 'aa')).to.eq(1);
            expect(GetSet.get({aa: {bb: {cc: 1}}}, 'aa.bb.cc')).to.eq(1);
        });
        
        //it('should return obj/val for path "."', () => {
            //const o = {aa: 1};
            //expect(GetSet.get(o, '.')).to.deep.eq(o);
        //});
    });
    
    describe('#set', () => {

        it('should have object', () => {
            expect(() => {GetSet.set(undefined, 'aa', 1)}).to.throw();
            expect(() => {GetSet.set(null, 'aa', 1)}).to.throw();
            expect(() => {GetSet.set('asdf', 'aa', 1)}).to.throw();
            expect(() => {GetSet.set(12, 'aa')}, 1).to.throw();
        });
        
        it('should have path', () => {
            expect(() => {GetSet.set({})}).to.throw;
        });

        it('should set first child', () => {
            let o = {};
            GetSet.set(o, 'aa', 1)
            expect(o).to.deep.eq({aa:1});
        });
        
        it('should set deep child', () => {
            let o = {};
            GetSet.set(o, 'aa.bb.cc', 1)
            expect(o).to.deep.eq({aa: {bb: {cc: 1}}});
        });
    });
});
