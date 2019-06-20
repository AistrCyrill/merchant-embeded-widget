import render from "./render";
import mount from "./mount";
import { stringify } from "./helpers";
// TODO: better alternative for ow is https://github.com/ianstormtaylor/superstruct , just 3.2kB

import ow from "ow";
import EventService from "./EventService";

// FIXME: Do we need UMD instead if IIFE?
// Probably not yet  🥴;

// UPD.
// And we need it.
// TODO: Refactor everything to class in UMD.

(function(window, undefined) {
  'use strict';

  const buildFrameSrc = ({
    // FIXME: move it to upper function
    base_url = "https://com.paycore.io/hpp",
    public_key,
    amount,
    currency,
    service = null,
    service_fields = null,
    cpi = null,
    description = null,
    expires = null,
    reference_id = null,
    metadata = null,
    language = null,
    display = null,
    style = null,
    pay_button_label = null,
  }) => {
    const qParams = stringify({
      // Required params
      amount,
      currency,
      public_key,

      // Optional params
      description,
      expires,
      reference_id,
      metadata,
      language,

      // Theming, UX
      display,
      style,
      pay_button_label,

      // Different usecase flow params
      service,
      service_fields,
      cpi,
    });
    return `${base_url}?${qParams}`;
  };


  /*
   * Widget initialize method:
   *
   * @param  {string}  Selector The Element selector to render an iframe, must be an ID
   * @param  {Object}  The Config with public key of commerce app, currency and amount, description
   * @param  {Object}  Predefined styles for Merchant HPP inside iframe
   *
   */

  const widget = function() {
    this.config = {};

    this.init = (config) => {
      this.config = config;
      _init(config);

      if(config.handlers){
        for(const [k,v] of Object.entries(config.handlers) ) {
          this.bindEventListener(k, v);
        }
      }
    };

    this.reinit = () => {
      _reinit(this.config)
    };

    this.close = () => {
      _close(this.config)
    };

    this.bindEventListener = (event, callback) => {
      this.CommunicationService.bindEventListener(
          event,
          callback,
      );
    };

    this.CommunicationService = new EventService(this.config);
    this.bindEventListener('rendered', () => {})
  };

  const _init = config => {
    try {
      ow(
        config,
        ow.object.exactShape({
          target: ow.string,
          selector_id: ow.optional.string,
          frame_id: ow.optional.string,

          base_url: ow.optional.string,
          public_key: ow.string,

          amount: ow.number,
          currency: ow.string,
          description: ow.optional.string,
          reference_id: ow.optional.string,


          service: ow.optional.string,
          service_fields: ow.optional.array,

          cpi: ow.optional.string,
          expires: ow.optional.any(ow.string, ow.number),
          language: ow.optional.string,
          logo: ow.optional.string,
          metadata: ow.optional.any(ow.object, ow.array),

          handlers: ow.optional.object,


          display: ow.optional.object.exactShape({
            hide_footer: ow.optional.boolean,
            hide_header: ow.optional.boolean,
            hide_progress_bar: ow.optional.boolean,
            hide_method_filter: ow.optional.boolean,
            hide_lifetime_counter: ow.optional.boolean,
          }),

          style: ow.optional.object.exactShape({
            theme: ow.optional.string,
            font_family: ow.optional.string,

            success_color: ow.optional.string,
            warning_color: ow.optional.string,
            danger_color: ow.optional.string,
            info_color: ow.optional.string,

            primary: ow.optional.string,
            primary_variant: ow.optional.string,
            primary_text_color: ow.optional.string,
            primary_background_color: ow.optional.string,
            on_primary_color: ow.optional.string,

            secondary: ow.optional.string,
            secondary_variant: ow.optional.string,
            secondary_text_color: ow.optional.string,
            secondary_background_color: ow.optional.string,
            on_secondary_color: ow.optional.string,

            pay_button_label: ow.optional.string,
            show_method_logo: ow.optional.boolean,

            //  Material styling
            primary: ow.optional.string,
            primary_variant: ow.optional.string,
            secondary: ow.optional.string,
            secondary_variant: ow.optional.string,
            background: ow.optional.string,
            surface:ow.optional.string,

            error: ow.optional.string,
            on_primary: ow.optional.string,
            on_secondary: ow.optional.string,

            on_background: ow.optional.string,
            on_surface: ow.optional.string,
            on_error: ow.optional.string,
          }),
        }),
      );
      if (config.target === "iframe") {
        if(!config.selector_id) {
          config.selector_id = "payment_widget"
        }
        if (!config.frame_id) {
          config.frame_id = "payment_frame";
        }

        /**
         * If already exists iframe with existed ID - he will be rerenderer
         * */

        const paymentIframe = document.getElementById(config.frame_id);
        if (paymentIframe) {
          _reinit(config);
          return;
        }

        /**
         * @returns iframe src attribute;
         */
        let src = buildFrameSrc(config);
        const iFrame = initializeIframe({src, frame_id: config.frame_id});
        mount(iFrame, document.getElementById(config.selector_id));
      } else {
        // Redirect flow
        const path = buildFrameSrc(config);
        window.open(path, "_blank");
      }
    } catch (e) {
      throw (e);
    }
  };

  const _close = config => {
    const frameToClose = document.getElementById(config.frame_id);
    if (frameToClose) {
      frameToClose.remove();
    }
  };

  const _reinit = config => {
    _close(config);
    _init(config);
    return;
  };


  const initializeIframe = props =>
    render({
      attrs: {
        id: props.frame_id,
        src: props.src || "",
        width: "100%",
        height: "100%",
        frameborder: "none",
      },
    });


  window.payment_widget = new widget();
})(window);
