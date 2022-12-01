/* eslint-env jest */
import { testDouyinOpenapi, testOpenid } from '../config'

test('Test Douyin Notification Api', async () => {
  await testDouyinOpenapi.sendNotification({
    tpl_id: 'MSG139278005551c58ec4a5f3ee47eafc4a07c84bf15858',
    open_id: testOpenid,
    data: {}
  })
})
