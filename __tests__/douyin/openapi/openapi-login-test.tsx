/* eslint-env jest */
import { testDouyinOpenapi, jsLoginCode, jsAnonymousLoginCode } from '../config'

test('Test Douyin Login Api', async () => {
  const session = await testDouyinOpenapi.jscode2session(jsLoginCode)
  expect(session.openid != null).toBeTruthy()
  expect(session.session_key != null).toBeTruthy()
  expect(session.unionid != null).toBeTruthy()

  const anonymousSession = await testDouyinOpenapi.jscode2session_anonymous(
    jsAnonymousLoginCode
  )
  expect(anonymousSession.anonymous_openid != null).toBeTruthy()
  expect(anonymousSession.session_key != null).toBeTruthy()

  console.log(session, anonymousSession)
})
