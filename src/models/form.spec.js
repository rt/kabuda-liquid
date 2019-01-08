import chai from 'chai';
import Form from './form';
import FormField from './form-field';

const expect = chai.expect;

describe('Form', () => {

    let model;
    const uiDataForms = { 
        childForm: {
            fields: [
                {
                    key: 'aaa',
                    fieldName: 'AAA',
                },
            ]
        }
    };
    const data = {
        prop1: 1,
        list: [
            {
                aaa: 100,
                b: 3,
            },
            {
                aaa: 2,
                b: 3,
            }
        ]
    };
    const formObj = {
        fields: [
            {
                key: 'prop1',
                fieldName: 'Prop1',
                isRequired: true,
                //validations: [
                    //{
                        //type: 'alpha',
                    //}
                //],
            },
            {
                key: 'list',
                fieldName: 'List',
                isRequired: true,
                arrayFormId: 'childForm',
            },
        ]
    };

    describe('#deserialize', () => {

        it('should deserialize properly', () => {
            model = new Form({
                fields: [
                {
                    key: 'aaa',
                    fieldName: 'AAA',
                },
                ]
            });

            expect(model.fields).to.be.instanceof(Array);
            expect(model.fields[0]).to.be.instanceof(FormField);
        });

    });
    
    describe('#fromData', () => {

        it('should init form data', () => {
            model = new Form(formObj);
            model.fromData(data, uiDataForms);

            //original data copied to data
            expect(model.data).to.deep.eq(data);

            //value copied to field value
            expect(model.getField('prop1').value).to.eq(1);
            
            //should generate 2 forms on the field "list" for the internal array
            const listField = model.getField('list');
            expect(listField.forms.length).to.eq(2);

            //child forms will do the same (have data and set form value)
            const childForm = listField.forms[0];
            expect(childForm.data).to.deep.eq({ aaa:100, b: 3});
            const childField = childForm.getField('aaa');
            expect(childField.value).to.eq(100);
            
            //reconstructing data should give the same
            expect(model.getData()).to.deep.eq(data);
        });

    });

    describe('#changeValue', () => {

        it('should change value in field and form data', () => {
            model = new Form(formObj);
            model.fromData(data, uiDataForms);

            model.changeValue('prop1', 2);
            
            //form field value should change
            expect(model.getField('prop1').value).to.eq(2);

            //form data should change
            const newData = Object.assign({}, data, {prop1: 2});//clone with 2
            //const newData = {...data, prop1: 2};//clone with 2
            expect(model.getData()).to.deep.eq(newData);
        });

        it('should change child array value in field and form data', () => {
            model = new Form(formObj);
            model.fromData(data, uiDataForms);

            //this part is up to implementor
            const listField = model.getField('list');
            listField.forms[0].changeValue('aaa', 200);

            //form field value should change
            const aaaField = model.getField('list').forms[0].getField('aaa'); 
            expect(aaaField.value).to.eq(200);

            //form data should change
            const newData = Object.assign({}, data, {prop1: 2});//clone with 2
            //const newData = {...data};//clone 
            newData.list[0].aaa = 200;
            expect(model.getData()).to.deep.eq(newData);
        });
    });


});
