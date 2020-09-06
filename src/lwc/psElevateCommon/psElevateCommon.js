

/***
* @description Visualforce page for the credit card tokenization
*/
const TOKENIZE_CARD_PAGE_NAME = 'GE_TokenizeCard';

/***
* @description Max number of ms to wait for the response
*/
const TOKENIZE_TIMEOUT_MS = 10000;

/***
* @description Returns tokenize card Visualforce page URL
*/
const getTokenizeCardPageURL = (namespace) => {
    return namespace
        ? `/apex/${namespace}__${TOKENIZE_CARD_PAGE_NAME}`
        : `/apex/${TOKENIZE_CARD_PAGE_NAME}`;
}

/***
* @description Builds the visualforce origin url that we need in order to
* make sure we're only listening for messages from the correct source in the
* registerPostMessageListener method.
*/
const getVisualforceOriginURLs = (domainInfo, namespace) => {
    let url = `https://${domainInfo.orgDomain}--c.visualforce.com`;
    let alternateUrl = `https://${domainInfo.orgDomain}--c.${domainInfo.podName}.visual.force.com`;

    if (namespace) {
        url = url.replace('--c', `--${namespace}`);
        alternateUrl = alternateUrl.replace('--c', `--${namespace}`);
    }

    return [{ value: url }, { value: alternateUrl }];
}


export {
    TOKENIZE_TIMEOUT_MS,
    getVisualforceOriginURLs,
    getTokenizeCardPageURL,
};