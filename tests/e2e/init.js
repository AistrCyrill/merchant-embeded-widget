import { Selector, ClientFunction } from 'testcafe'
import ListPage from './pages/MethodsList'

const mlPage = new ListPage()

fixture`My fixture`
  .page`http://localhost:1234`.beforeEach(async t => {
    const initIframe = ClientFunction(() => {
      window.widget.init({
        selector: "app",
        key: "pk_test_yNznq07p7MChOL8shs7WT3Yat6ZnlqyXq8ep6WKF998",
        amount: 100,
        currency: "USD",
        baseUrl: "http://localhost:8015/hpp"
      });
    })
    await initIframe();
  })

test('switching to an iframe', async t => {
  const getLocation = ClientFunction(() => window.location.href);
  await t.expect(Selector("#payment_widget").exists).ok()
  // NOTE: the ClientFunction will be executed in TOP window's context
  console.log(await getLocation());
  await t
    .setPageLoadTimeout(10000)
    .switchToIframe('#payment_widget')
    .expect(getLocation()).contains('http://localhost:8015/');
});


test('Checking that methods list exists', async t => {
  await t
    .setPageLoadTimeout(10000)
    .switchToIframe('#payment_widget')
    .expect(Selector(".payment-wrap__items").exists).ok()

})



test('Click methods and verify every page', async t => {
  await t
    .setPageLoadTimeout(10000)
    .switchToIframe('#payment_widget')

  const getLocation = ClientFunction(() => window.location.href);
  const methodsCount = await mlPage.getMethodsCount();
  const linkToCastegory = Selector('.payment-methods__select-payment-wrap');
  const allOptions = Selector('.select-payment__options li');
  const linkToMain = allOptions.nth(0)
  let list = await mlPage.getMethodsList();

  for (let i = 0; i < methodsCount; i++) {
    const methodSelector = list.nth(i);

    // TODO: Later compare href and window.href with methods that has been selected;
    let href = await methodSelector.getAttribute('href')
    let id = await methodSelector.getAttribute('id')
    await t
      .click(methodSelector)
      .click(linkToCastegory)
      .click(linkToMain)

  }
});


test(`Check that widget successfully close`, async t => {
  await t.expect(Selector("#payment_widget").exists).ok()

  const removeIframe = ClientFunction(() => {
    window.widget.close({ frameId: 'payment_widget' })
  })

  await removeIframe();
  await t.expect(Selector("#payment_widget").exists).notOk()
})