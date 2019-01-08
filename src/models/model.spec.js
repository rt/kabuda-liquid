import chai from 'chai';
import Model from './model';

const expect = chai.expect;

describe('#Model', () => {

    let model;
    beforeEach(() => {
    });

    afterEach(() => {
    });

    describe('#deserialize', () => {
        
        it('should deserialize with no initial object', () => {
            model = new Model();
            expect(model).to.be.instanceof(Model);
        });

        it('should deserialize properties', () => {
            model = new Model({
                prop: 'blah'
            });

            expect(model.prop).to.eq('blah');
            expect(model).to.be.instanceof(Model);
        });

    });

    describe('#deserializeProperty', () => {

        it('should deserialize child properties to class instance', () => {
            model = new Model();
            let Cls = class {};
            model.deserializeProperty({prop: 1}, 'prop', Cls);

            expect(model.prop).to.be.instanceof(Cls);
        });
        
        it('should retain undefined', () => {
            model = new Model();
            let Cls = class {};
            model.deserializeProperty({}, 'prop', Cls);

            expect(model.prop).to.be.undefined;
        });

        it('should ensure child class deserializeion when ensure is passed', () => {
            model = new Model();
            let Cls = class {};
            model.deserializeProperty({}, 'prop', Cls, true);

            expect(model.prop).to.be.instanceof(Cls);
        });
    });

    describe('#deserializeArray', () => {

        it('should deserialize child properties to arrays of class instances', () => {
            model = new Model();
            let Cls = class {};
            model.deserializeArray({list: [{prop: 1}, {prop: 2}]}, 'list', Cls);

            expect(model.list[0]).to.be.instanceof(Cls);
            expect(model.list[1]).to.be.instanceof(Cls);
        });

        it('should always ensure array', () => {
            model = new Model();
            let Cls = class {};
            model.deserializeArray({}, 'list', Cls);

            expect(model.list).to.be.instanceof(Array);
        });
    });

    describe('#serialize', () => {

        it('should keep list of computed properties', () => {

            class Cls1 extends Model {

                doSomething1 () {
                }

                deserialize (o) {

                    /** @type {string} */
                    //o.prop1 = o.prop1 || null;

                    super.deserialize(o);
                }
            }

            class Cls2 extends Model{


                doSomething2() {

                }

                deserialize(o) {

                    /** @type {string} */
                    o.prop2 = null;

                    //[>* @type {Cls1} <]
                    //o.cls1 = o.cls1 || null;

                    //[>* @type {Array.<Cls1>} <]
                    //o.list = o.list || [];

                    super.deserialize(o);
                    this.deserializeArray(o, 'list', Cls1);
                    this.deserializeProperty(o, 'cls1', Cls1);
                }
            }

            model = new Cls2({
                prop2: 'prop2',
                cls1: {
                    prop1: 'cls1-prop1'
                },
                list: [
                    {
                        prop1: 'list0-cls1-prop1'
                    },
                    {
                        prop1: 'list0-cls1-prop1'
                    }
                ]
            });


            expect(model.cls1.doSomething1).to.not.be.undefined;
            expect(model.list[0].doSomething1).to.not.be.undefined;

            let o = model.serialize();

            expect(o.cls1.doSomething1).to.be.undefined;
            expect(o.list[0].doSomething1).to.be.undefined;

        });

    });
});
