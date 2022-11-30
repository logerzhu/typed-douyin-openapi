/* eslint-env jest */
import { testDouyinApi, testOpenid } from '../config'

test('Test Douyin Customer Api', async () => {
  const customerService = await testDouyinApi.customerServiceUrl({
    openid: testOpenid,
    type: '1128'
  })
  expect(customerService.log_id != null).toBeTruthy()
  expect(customerService.url != null).toBeTruthy()
})
