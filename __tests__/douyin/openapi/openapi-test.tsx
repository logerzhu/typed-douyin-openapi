/* eslint-env jest */
import { testDouyinOpenapi } from '../config'

test('Test Douyin Api', async () => {
  const accessToken = await testDouyinOpenapi.getAccessToken()
  expect(accessToken.isValid() == true).toBeTruthy()
  expect(accessToken.accessToken != null).toBeTruthy()
  expect(accessToken.expireTime).toBeTruthy()
})
