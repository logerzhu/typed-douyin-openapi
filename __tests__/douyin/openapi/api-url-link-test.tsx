/* eslint-env jest */
import { testDouyinApi } from '../config'

test('Test Douyin Url Link Api', async () => {
  const urlLink = await testDouyinApi.generateUrlLink({
    path: 'abc/c'
  })
  expect(urlLink != null).toBeTruthy()
  const urlLinkInfo = await testDouyinApi.queryUrlLinkInfo(urlLink)
  expect(urlLinkInfo != null).toBeTruthy()
  expect(urlLinkInfo.path === 'abc/c').toBeTruthy()

  const quota = await testDouyinApi.queryUrlLinkQuota()
  expect(quota.url_link_limit > 0).toBeTruthy()
  expect(quota.url_link_used > 0).toBeTruthy()

  console.log(urlLink, urlLinkInfo, quota)
})
