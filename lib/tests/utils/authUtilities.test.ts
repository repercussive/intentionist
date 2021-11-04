import { authState, handleSignOut } from '@/logic/utils/authUtilities'
import signInDummyUser from '@/test-setup/signInDummyUser'

test('signing in and out correctly updates local auth state', async () => {
  expect(authState.current).toBe(false)
  await signInDummyUser()
  expect(authState.current).toBe(true)
  await handleSignOut()
  expect(authState.current).toBe(false)
})