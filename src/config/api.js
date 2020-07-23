let APP_CONFIG;
const hostname = window && window.location && window.location.hostname;



if (hostname == "www.web.qoin.id" || hostname === 'web.qoin.id') {
    APP_CONFIG = {
        API_ROOT: 'https://staginglbapigw.qoin.id/',
        ESPAY_URL: '?url=https://sandbox-kit.espay.id/public/test/pluginprod&paymentId=transactionidloyalto&commCode=SGWMAGENTO&bankCode=008&productCode=LINKAJAAPPLINK',
        CC_PUBLIC_KEY: 'xnd_public_production_NGph2IwlgC4CsRrQP3eXaJqgyZ639lf9R3xgJ0ltgN4fVZjGBz02Fjedj4r3:',
        CC_URL: 'https://api.xendit.co/v2/credit_card_tokens'
    }
}
else if (hostname === 'www.webviewstaging.qoin.id' || hostname === 'webviewstaging.qoin.id') {
    APP_CONFIG = {
        API_ROOT: 'https://staginglbapigw.qoin.id/',
        ESPAY_URL: '?url=https://sandbox-kit.espay.id/public/test/pluginprod&paymentId=transactionidloyalto&commCode=SGWOLEHASTG&bankCode=008&productCode=LINKAJAAPPLINK',
        CC_PUBLIC_KEY: 'xnd_public_production_NGph2IwlgC4CsRrQP3eXaJqgyZ639lf9R3xgJ0ltgN4fVZjGBz02Fjedj4r3:',
        CC_URL: 'https://api.xendit.co/v2/credit_card_tokens'
        // ESPAY_URL: '?url=https://sandbox-kit.espay.id/public/test/pluginprod&paymentId=transactionidloyalto&commCode=SGWOLEHASTG&bankCode=008&productCode=LINKAJAAPPLINK'
    }
}
else {
    APP_CONFIG = {
        API_ROOT: 'https://devlbapigw.loyalto.id/',
        // ESPAY_URL: 'https://sandbox-kit.espay.id/index/order/?url=https://sandbox-kit.espay.id/public/test/pluginprod&paymentId=transactionidloyalto&commCode=SGWOLEHA&bankCode=075&productCode=JENIUSIB'
        ESPAY_URL: '?url=https://sandbox-kit.espay.id/public/test/pluginprod&paymentId=transactionidloyalto&commCode=SGWMAGENTO&bankCode=008&productCode=LINKAJAAPPLINK',
        CC_PUBLIC_KEY: 'xnd_public_development_5aUqNlHLV1UZNeixVJ5Y22uls2FIn1T10PUhSfdDEKXFEpqgJJCexDMzLIySTTS:',
        CC_URL: 'https://api.xendit.co/v2/credit_card_tokens'
    }
}

export default APP_CONFIG;