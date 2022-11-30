/* eslint-env jest */
import { testDouyinOpenapi } from '../config'

test('Test Douyin QRCode Api', async () => {
  const qrCode = await testDouyinOpenapi.createQRCode({})

  expect(qrCode != null).toBeTruthy()
  expect(qrCode instanceof Buffer).toBeTruthy()
})
