/* eslint-env jest */
import { testDouyinPay } from '../config'

test('Test Douyin Pay Callback Api', async () => {
  const message = testDouyinPay.verifyAndGetMsg({
    timestamp: 1602507471,
    nonce: '797',
    msg:
      '{"appid":"tt07e3715e98c9aac0","cp_orderno":"out_order_no_1","cp_extra":"","way":"2","payment_order_no":"2021070722001450071438803941","total_amount":9980,"status":"SUCCESS","seller_uid":"69631798443938962290","extra":"null","item_id":"","order_id":"N71016888186626816"}',
    msg_signature: '625879c2e166aa62a8e8d40ed01fc124935e6ca2'
  })
  expect(message != null).toBeTruthy()
})
