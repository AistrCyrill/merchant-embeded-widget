
##An client third-party inteface to init and render Mechant HPP to an a clint page with custom options.



#Initializing iframe on page.

1) Get iframe widget from CDN.

```html
<script src="https://unpkg.com/@paycore/merchant-widget-js@0.1.6/dist/merchantWidget.umd.min.js"></script>
```

2) Init widget on your client page:
```javascript
window.widget.init({
    selector: "HTML_ID_SELECTOR_TO_INSERT_WIDGET_INTO",
    flow: "iframe",
    public_key: "YOUR_PUBLIC_KEY",
    amount: "AMOUNT_OF_INVOICE",
    currency: "USD",
    baseUrl: "URL_OF_YOUR_HPP"
  });
```

### Parameters
- `options` **[Object][19]** Required
- `options.selector` **[String][20]** Selector on client page you wnat insert iframe to. Required.
- `options.flow` **[String][20]** Widget supports 2 ways to initalize HPP - in the iframe or in blank page.
To Open widget in the iframe, you need pass iframe flow, or redirect for open in new browser tab;
- `options.public_key` **[String][20]** Commerce account PUBLIC API_KEY Required
- `options.baseUrl` **[String][20]** Base endpoint to HPP that will be initialized in the iframe. Required
- `options.currency` **[String][20]** The currency of the invoice (3-letter ISO 4217 code). Must be a commerce-account supported currency. Required.
- `options.amount` **[Number][23]**  The amount of payment invoice