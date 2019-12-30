import { LightningElement, api } from 'lwc';
import { dispatch, isEmpty, isFunction, handleError } from 'c/utilTemplateBuilder';
import checkNameUniqueness from '@salesforce/apex/FORM_ServiceGiftEntry.isNameUnique';
import GeLabelService from 'c/geLabelService';

export default class geTemplateBuilderTemplateInfo extends LightningElement {

    CUSTOM_LABELS = GeLabelService.CUSTOM_LABELS;

    @api isLoading;
    @api templateName;
    @api templateDescription;

    @api
    validate() {
        return new Promise(async (resolve, reject) => {
            const nameInput = this.template.querySelector('lightning-input');
            let isValid = false;

            if (isFunction(nameInput.reportValidity) && !isEmpty(nameInput)) {
                checkNameUniqueness({ name: nameInput.value })
                    .then(isNameUnique => {
                        if (isNameUnique) {
                            nameInput.setCustomValidity('');
                        } else {
                            nameInput.setCustomValidity('Name is already in use.');
                        }

                        nameInput.reportValidity();
                        isValid = nameInput.checkValidity();

                        dispatch(this, 'updatevalidity', { property: 'hasTemplateInfoTabError', hasError: !isValid });
                        resolve(isValid);
                    })
                    .catch(error => {
                        handleError(error);
                        reject(error);
                    });
            }
        });
    }

    /*******************************************************************************
    * @description Handles onblur event from lightning-input and dispatches an
    * event to notify parent component geTemplateBuilder that the form template
    * description has changed.
    *
    * @param {object} event: Event object from lightning-input onblur event handler
    * @return {object} templateInfo: Object containing the template name and description
    */
    handleChangeTemplateInfoName(event) {
        dispatch(this, 'changetemplateinfoname', event.target.value);
        this.validate();
    }

    /*******************************************************************************
    * @description Handles onblur event from lightning-textarea and dispatches an
    * event to notify parent component geTemplateBuilder that the form template
    * description has changed.
    *
    * @param {object} event: Event object from lightning-textarea onblur event handler
    * @return {object} templateInfo: Object containing the template name and description
    */
    handleChangeTemplateInfoDescription(event) {
        dispatch(this, 'changetemplateinfodescription', event.target.value);
    }
}