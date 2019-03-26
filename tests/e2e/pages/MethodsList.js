import { Selector, t } from 'testcafe';

const label = Selector('label');


export default class ListPage {
  constructor() {
    this.methodsList = Selector('.payment-wrap__items a');
    this.methodsCount = this.methodsList.count
  }


  async selectMethod(method) {
    await t.click()
  }

  async getMethodsCount() {
    return Selector('.payment-wrap__items a').count
  }

  async getMethodsList() {
    return Selector('.payment-wrap__items a')
  }
}