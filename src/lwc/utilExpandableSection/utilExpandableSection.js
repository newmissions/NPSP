import { LightningElement, api } from 'lwc';

export default class utilExpandableSection extends LightningElement {

    @api id;
    @api label;
    @api isCollapsed = false;
    @api alternativeText;
    @api bodyClass;
    @api buttonBackground;

    get containerClass() {
        let classItems = ['slds-section'];

        if (this.isCollapsed === false) {
            classItems = [...classItems, 'slds-is-open'];
        }

        return classItems.join(' ');
    }

    get iconClass() {
        let classItems = ['slds-p-right_small', 'icon-transition'];

        if (!this.isCollapsed) {
            classItems = [...classItems, 'icon-transition_is-open'];
        }

        return classItems.join(' ');
    }

    get sectionClass() {
        let classItems = ['section-transition'];

        if (this.isCollapsed) {
            classItems = [...classItems, 'section-transition_is-closed'];
        } else {
            // Apply provided css class to body if section is expanded
            if (this.bodyClass) {
                let bodyClass = this.bodyClass.split(' ');
                classItems = [...classItems, ...bodyClass];
            }
        }

        return classItems.join(' ');
    }

    get computedButtonClass() {
        let classItems = ['slds-button', 'slds-section__title-action'];

        if (this.buttonBackground && this.buttonBackground === 'none') {
            classItems = [...classItems, 'slds-section__title-action-background-none'];
        }

        return classItems.join(' ');
    }

    get ariaExpanded() {
        return !this.isCollapsed;
    }

    get ariaHidden() {
        return this.isCollapsed;
    }

    toggleSection() {
        this.isCollapsed = !this.isCollapsed;
    }

    /*******************************************************************************
     * Start getters for data-qa-locator attributes
     */

    get qaLocatorToggleSection() {
        return `button Toggle Section ${this.label}`;
    }

    /*******************************************************************************
     * End getters for data-qa-locator attributes
     */

}