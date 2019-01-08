import Model from './model';
import Form from './form';

export default class FormField extends Model {

    constructor(o) {
        super(o);

        this.fieldName = o.fieldName || 'Name';
        this.isRequired = o.isRequired || false;
        
        /** @type {Array<string>} */
        this.errors = o.errors || [];

        this.value = o.value || ''; //null/undefined creates warning (using '' makes it a controlled inputs)

        //this.deserializeProperty(o, 'validations', Validation);
        
        this.deserializeArray(o, 'forms', Form);
    }

    setValue(val) {
        this.value = val;
    }
    
    isEmpty(val) {
        if (typeof val === 'string') {
            return !(val.trim());
        } else {
            if (typeof val !== 'number') {
                return !(val);
            }
            return false;
        }
    }

    checkRequired() {

        if (this.isRequired && this.isEmpty(this.value)) {
            this.status = 'error';
        } else {
            this.status = undefined;
        }
    }
    
    validate() {

        this.errors = [];
        this.status = undefined;

        //if its empty is valid temporarily until required check is done
        //usually we can assume an array but because this is set in ui-data we cannot
        if (!this.isEmpty(this.value) && this.validations) {  

            this.validations.forEach(validation => {

                if (validation.type) {
                    switch (validation.type) {

                            case 'alpha':
                                if (!this.validateAlpha(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                            case 'email':
                                if (!this.validateEmail(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                            case 'integer':
                                if (!this.validateInteger(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                            case 'phone':
                                if (!this.validatePhone(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                            case 'number':
                                if (!this.validateNumber(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                            case 'alphaNumeric':
                                if (!this.validateAlphaNumeric(this.value)) {
                                    this.errors.push(validation.type);
                                    this.status = 'error';
                                }
                                break;
                    }
                }

            });
        }
    }

    required(val) {
        return val && val.search(/\S/) !== -1;
    }

    validateEmail(val) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;// eslint-disable-line max-len
        return re.test(val);
    }

    validateDollars(value) {
        //will accept dollar amounts with two digits after the decimal or no decimal
        //will also accept a number with or without a dollar sign
        const regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    }

    validateNumber(val) {
        return val && val.search(/^\s*\d+\s*$/) !== -1;
    }

    validateAlpha(val) {
        return val && val.search(/^[A-ÿ][A-ÿ' -]*$/) !== -1;
    }
    
    validateAlphaNumeric(val) {
        return val && val.search(/^[A-ÿ0-9 _]*[A-ÿ0-9-][A-ÿ0-9 _]*$/) !== -1;
    }

    validateAnyText(val) {
        return val && val.search(/[^\r\n]*/) !== -1;
    }

    validateInteger(val) {
        return val && val.search(/^[0-9]+$/) !== -1;
    }
    
    validatePhone(val) {
        return val && val.search(/^\+?[\d\s()\.-]+$/) !== -1;
    }

    //validateCCExpire(val) {
        //var currentDate = moment(),
            //dateFormat = 'MM/YY',
            //dateEntered,
            //dateDiff;

        //dateEntered = moment(elm.val(), dateFormat.toUpperCase());
        //dateDiff = dateEntered.diff(currentDate.startOf('month'), 'years', true);

        //return dateEntered.isValid() && dateDiff >= 0 && dateDiff <= 10;
    //}
        
    validateAge(val) {
        return val && val.search(/^[0-9]+$/) !== -1 && val >= 1 && val <= 130;
    }

    //ie. 11/12
    //setExpirationDate: function (expirationDate) {
        //if (expirationDate && expirationDate.length > 0) {
            //this.expiration = moment.utc(expirationDate, 'MM/YY').valueOf();
            //this.expirationDate = expirationDate;
        //}
    //},

    /**
     * @return {string}
     */
    //getMaskedNumber: function () {
        //let maskedNumber = null;

        //if (typeof this.number === 'string') {
            //if ('AX' === this.type && this.number.length === 15) {
                //maskedNumber = 'XXXX XXXXXX ' + this.number.substr(this.number.length - 5);
            //} else if (this.number.length === 16) {
                //maskedNumber = '**** **** **** ' + this.number.substr(this.number.length - 4);
            //}
        //}

        //return maskedNumber;
    //},

}
