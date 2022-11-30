/* eslint-env jest */
import { testDouyinOpenapi, testOpenid } from '../config'

test('Test Douyin Customer Api', async () => {
  const customerService = await testDouyinOpenapi.customerServiceUrl({
    openid: testOpenid,
    type: '1128'
  })
  expect(customerService.log_id != null).toBeTruthy()
  expect(customerService.url != null).toBeTruthy()
})
