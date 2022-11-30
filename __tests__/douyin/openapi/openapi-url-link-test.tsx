/* eslint-env jest */
import { testDouyinOpenapi } from '../config'

test('Test Douyin Url Link Api', async () => {
  const urlLink = await testDouyinOpenapi.generateUrlLink({
    path: 'abc/c'
  })
  expect(urlLink != null).toBeTruthy()
  const urlLinkInfo = await testDouyinOpenapi.queryUrlLinkInfo(urlLink)
  expect(urlLinkInfo != null).toBeTruthy()
  expect(urlLinkInfo.path === 'abc/c').toBeTruthy()

  const quota = await testDouyinOpenapi.queryUrlLinkQuota()
  expect(quota.url_link_limit > 0).toBeTruthy()
  expect(quota.url_link_used > 0).toBeTruthy()

  console.log(urlLink, urlLinkInfo, quota)
})
