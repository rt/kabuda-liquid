import Model from './model';
import FormField from './form-field';
import GetSet from '../utils/getset';

/**
 * initialize with ui-data.form and store to session
 * ex. in action.validateText > store.getForm().changeText(val)
*/
export default class Form extends Model {

    constructor(o) {
        super(o);

        //original data.  this will keep updating
        this.data = o.data || {};

        this.deserializeArray(o, 'fields', FormField);
    }

    /**
     * @param {string} key
     * @param {string|number} key
     */
    changeValue(key, val) {
        const field = this.getField(key);
        if (field) {
            field.setValue(val);
            field.validate();

            //set to data
            GetSet.set(this.data, key, val);
        }
    }

    getField(key) {
        return this.fields.find((field) => {
            return field.key === key;
        });
    }

    /**
     * set status to "error" for each field if required and no value
     */
    checkRequired() {
        this.fields.forEach((field) => {
            field.checkRequired();
        });
    }

    getHasErrors() {
        return this.fields.some((field) => {
            return field.status === 'error';
        });
    }

    validateGroup() {
        
    }

    /**
     * @param {object} data
     * @param {object} forms : uiData.forms for reference for child arrays
     */
    fromData(data, forms) {
        //init with original
        this.data = data;
        this.fields.forEach((field) => {
            if (field.arrayFormId) {
                field.forms = [];
                //make for for each
                const array = GetSet.get(this.data, field.key);
                array.forEach(listItem => {
                    const form = new Form(forms[field.arrayFormId]);
                    form.fromData(listItem, forms);
                    field.forms.push(form);
                });
            } else {
                field.value = GetSet.get(data, field.key);
            }
        });
    }

    clearData() {
        this.fields.forEach((field) => {
            if (field.arrayFormId) {
                field.forms = [];
            } else {
                field.value = null;
            }
        });
        this.data = {};
    }
    
    /**
    */
    getData() {
        //get all child arrays that had forms
        this.fields.forEach((field) => {
            if (field.arrayFormId) {
                const array = [];
                for (const form of field.forms) {
                    array.push(form.getData());
                }
                GetSet.set(this.data, field.key, array);
            } 
        });
        return this.data;
    }

}
