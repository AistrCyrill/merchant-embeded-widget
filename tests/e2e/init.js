import dotenv from 'dotenv';
dotenv.config()

import { Selector, ClientFunction } from 'testcafe'
import ListPage from './pages/MethodsList'

const APP_TESTING_BASE_URL = process.env.APP_TESTING_BASE_URL || 'http://localhost:1234';
const IFRAME_SELECTOR = process.env.IFRAME_SELECTOR || "app";
const HPP_BASE_URL = process.env.HPP_BASE_URL || 'http://localhost:8015/hpp';
const HPP_API_KEY = process.env.HPP_API_KEY || 'pk_test_yNznq07p7MChOL8shs7WT3Yat6ZnlqyXq8ep6WKF998';
const mlPage = new ListPage();

const intitWidget = ClientFunction(() => {
  window.widget.init({
    selector: IFRAME_SELECTOR,
    flow: "iframe",
    public_key: HPP_API_KEY,
    amount: 100,
    currency: "USD",
    baseUrl: HPP_BASE_URL
  });
}, {
    dependencies: { HPP_BASE_URL, HPP_API_KEY, IFRAME_SELECTOR }
  });


fixture`Go to page ${APP_TESTING_BASE_URL},  and initialize hpp iframe`
  .page`${APP_TESTING_BASE_URL}`.beforeEach(async (t) => {
    t.ctx.HPP_BASE_URL = HPP_BASE_URL;
    const initIframe = intitWidget;
    await initIframe();
  })

test('Iframe initialized correct', async t => {
  const getLocation = ClientFunction(() => window.location.href);
  await t.expect(Selector("#payment_widget").exists).ok()
  await t
    .setPageLoadTimeout(10000)
    .switchToIframe('#payment_widget')
    .expect(getLocation()).contains(`${t.ctx.HPP_BASE_URL}`);
});


test('Checking that methods list exists', async t => {
  await t
    .setPageLoadTimeout(10000)
    .switchToIframe('#payment_widget')
    .expect(Selector(".payment-wrap__items").exists).ok()

})



// CLICK ON BREADCRUMB NEEDED

// test('Click methods and verify every page', async t => {
//   await t
//     .setPageLoadTimeout(10000)
//     .switchToIframe('#payment_widget')

//   const getLocation = ClientFunction(() => window.location.href);
//   const methodsCount = await mlPage.getMethodsCount();
//   const linkToCastegory = Selector('.payment-methods__select-payment-wrap');
//   const allOptions = Selector('.select-payment__options li');
//   const linkToMain = allOptions.nth(0)
//   let list = await mlPage.getMethodsList();

//   for (let i = 0; i < methodsCount; i++) {
//     const methodSelector = list.nth(i);

//     // TODO: Later compare href and window.href with methods that has been selected;
//     let href = await methodSelector.getAttribute('href')
//     let id = await methodSelector.getAttribute('id')
//     await t
//       .click(methodSelector)
//       .click(linkToCastegory)
//       .click(linkToMain)

//   }
// });


test(`Check that widget successfully close`, async t => {
  await t.expect(Selector("#payment_widget").exists).ok()

  const removeIframe = ClientFunction(() => {
    window.widget.close({ frameId: 'payment_widget' })
  })

  await removeIframe();
  await t.expect(Selector("#payment_widget").exists).notOk()
})