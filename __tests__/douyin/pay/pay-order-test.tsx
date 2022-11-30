/* eslint-env jest */
import { testDouyinPay } from '../config'

test('Test Douyin Pay Api', async () => {
  const order = await testDouyinPay.createOrder({
    out_order_no: 'test' + Date.now(),
    total_amount: 100,
    subject: 'TEst1',
    body: 'Test2',
    valid_time: 60 * 5
  })
  expect(order.order_id != null).toBeTruthy()
  expect(order.order_token != null).toBeTruthy()
})
