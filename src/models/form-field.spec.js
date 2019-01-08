import chai from 'chai';
import FormField from './form-field';

const expect = chai.expect;

describe('FormField', () => {

    let model;

    describe('#deserialize', () => {

        it('should deserialize properly', () => {
            model = new FormField({
            });

            expect(model.errors).to.be.instanceof(Array);
            expect(model.forms).to.be.instanceof(Array);
        });

    });


});
