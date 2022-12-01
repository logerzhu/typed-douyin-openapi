/* eslint-env jest */
import { testDouyinPay } from '../config'

test('Test Douyin Pay Api', async () => {
  const out_order_no = 'test' + Date.now()
  const order = await testDouyinPay.createOrder({
    out_order_no: out_order_no,
    total_amount: 100,
    subject: 'TEst1',
    body: 'Test2',
    valid_time: 60 * 5
  })
  console.log(JSON.stringify(order))

  expect(order.order_id != null).toBeTruthy()
  expect(order.order_token != null).toBeTruthy()

  const orderInfo = await testDouyinPay.queryOrder({
    out_order_no: out_order_no
  })
  console.log('queryOrder', orderInfo)
  expect(orderInfo.order_id != null).toBeTruthy()
  expect(orderInfo.payment_info != null).toBeTruthy()
  expect(orderInfo.payment_info.total_fee === 100).toBeTruthy()
  expect(orderInfo.payment_info.order_status === 'PROCESSING').toBeTruthy()
  expect(orderInfo.payment_info.seller_uid != null).toBeTruthy()

  // 测试退款
  // const refundInfo = await testDouyinPay.createRefund({
  //   out_order_no: out_order_no,
  //   out_refund_no: 'testRefund' + Date.now(),
  //   reason: "Test",
  //   refund_amount: 1
  // })
  // expect(refundInfo.refund_no != null).toBeTruthy()
})
