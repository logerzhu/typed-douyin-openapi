/* eslint-env jest */
import { testDouyinApi, jsLoginCode, jsAnonymousLoginCode } from '../config'

test('Test Douyin Login Api', async () => {
  const session = await testDouyinApi.jscode2session(jsLoginCode)
  expect(session.openid != null).toBeTruthy()
  expect(session.session_key != null).toBeTruthy()
  expect(session.unionid != null).toBeTruthy()

  const anonymousSession = await testDouyinApi.jscode2session_anonymous(
    jsAnonymousLoginCode
  )
  expect(anonymousSession.anonymous_openid != null).toBeTruthy()
  expect(anonymousSession.session_key != null).toBeTruthy()

  console.log(session, anonymousSession)
})
