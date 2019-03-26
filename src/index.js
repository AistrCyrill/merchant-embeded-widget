import render from './render';
import mount from './mount';
import { stringify } from './helpers';
import ow from 'ow';
import EventService from './EventService'

// FIXME: Do we need UMD instead if IIFE? 
// Probably not yet  🥴;

(function (window, undefined) {


  const buildFrameSrc = ({ baseUrl, key, amount, currency, styling }) => {
    const qParams = stringify({
      amount,
      currency,
      styling,
      apiKey: key
    })
    return `${baseUrl}?${qParams}`;
  }
  /*
    * Widget initialize method:
    *
    * @param  {string}  Selector The Element selector to render an iframe, must be an ID
    * @param  {Object}  The Config with public key of commerce app, currency and amount, description
    * @param  {Object}  Predefined styles for Merchant HPP inside iframe
    * @param  {String}  Locale of client page
    *
    */

  const _init = (config) => {

    try {
      ow(config, ow.object.exactShape({
        selector: ow.string,
        key: ow.string,
        amount: ow.number,
        currency: ow.string,
        baseUrl: ow.string,
        styling: ow.optional.object,
        frameId: ow.optional.string,
        src: ow.optional.string
      }))

      if (!config.frameId) {
        config.frameId = 'payment_widget';
      }


      /** We pass config to reinit */
      const CommunicationService = new EventService(config);

      /** 
       * POST MESSAGE LISTENERS INITIALIZE
       */
      CommunicationService.addEventListener()
      CommunicationService.bindEventListener('reinit', _reinit);
      CommunicationService.bindEventListener('delete', _close);

      /**
       * If already exists iframe with existed ID - he will be rerendered 
       * */
      const paymentIframe = document.getElementById(config.frameId);
      if (paymentIframe) {
        _reinit(config);
        return
      }

      /**
       * @returns iframe src attribute;
       */
      config.src = buildFrameSrc(config);
      const iFrame = initializeIframe(config);
      mount(iFrame, document.getElementById(config.selector))




    } catch (e) {
      console.error(e)
    }
  };

  const _close = (config) => {

    const frameToClose = document.getElementById(config.frameId);
    if (frameToClose) {
      frameToClose.remove();
    }
  };

  const _reinit = (config) => {
    _close(config);
    _init(config);
    return
  };

  const initializeIframe = (props) => render({
    attrs: {
      id: props.frameId,
      src: props.src || 'www.google.com',
      width: '100%',
      height: '100%',
      frameborder: 'none'
    }
  })



  window.widget = {
    init: _init,
    reinit: _reinit,
    close: _close
  };

})(window)

