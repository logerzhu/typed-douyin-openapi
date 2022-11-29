/* eslint-env jest */
import { testDouyinApi } from '../config'

test('Test Douyin Api', async () => {
  const accessToken = await testDouyinApi.getAccessToken()
  expect(accessToken.isValid() == true).toBeTruthy()
  expect(accessToken.accessToken != null).toBeTruthy()
  expect(accessToken.expireTime).toBeTruthy()
})
