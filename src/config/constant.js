import APP_CONFIG from './api';

const constant = {
    URL_MASTER_PATH: APP_CONFIG.API_ROOT,
    KEY_CC: APP_CONFIG.CC_PUBLIC_KEY,

    REGEX_CHAR_ONLY: /^[a-zA-Z ]*$/,
    REGEX_PHONE_NUMBER: /^08[0-9]{9,12}$/,
    REGEX_PHONE_NUMBER2: /^8[0-9]{8,11}$/,
    REGEX_EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    REGEX_CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,


    URL_LINK_AJA: APP_CONFIG.ESPAY_URL,
    URL_VALIDATE_WEB_VIEW: "webview-validate",
    URL_INITIATE_WEB: "webview-initial",
    URL_PAY_NOW: "webview-paynow",
    URL_GET_CHANNEL: "webview-channel-menu",
    URL_SUBMIT_CHANNEL: "webview-channel-menusubmit",
    URL_SUBMIT_VA: "payment-va",
    URL_SUBMIT_BRIVA: "payment-briva",
    URL_SUBMIT_CREDIT_CARD: "webview-send-card-details",
    URL_ATM_BERSAMA: "payment-artajasa",
    URL_ESPAY: "espay-pay",
    URL_LINK_AJA_WORKFLOW: "espay-workflow",

    URL_CC: APP_CONFIG.CC_URL,
    URL_CC_SUBMIT_API: 'credit-card-charge'
}

export default constant;
