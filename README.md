An client third-party inteface to init and render Mechant HPP to an a page with custom style;



/**
    @param selector element to render into - ID of DOM tag selector
    @param config Object - config with public key of commerce app, currency and amount, description;
    @pararm styles={} Object - predefined styles for Merchant HPP inside iframe
    @param locale string - Locale of client page
*/
PCW.init(selector, config, styles);

