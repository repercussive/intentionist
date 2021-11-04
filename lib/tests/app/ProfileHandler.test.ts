import '@abraham/reflection'
import { container } from 'tsyringe'
import { when } from 'mobx'
import { setDoc, doc } from '@firebase/firestore'
import { db } from '@/lib/firebase'
import ProfileHandler, { UserProfileInfo } from '@/logic/app/ProfileHandler'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import AuthUser from '@/logic/app/AuthUser'
import DbHandler from '@/logic/app/DbHandler'
import InitialFetchHandler from '@/lib/logic/app/InitialFetchHandler'

// 🔨

const { app: adminApp, db: adminDb } = getFirebaseAdmin()

let authUser: AuthUser, dbHandler: DbHandler, profileHandler: ProfileHandler
let testUsername = 'profile_handler_test_username'

async function initializeProfileHandler() {
  const testContainer = container.createChildContainer()
  await (when(() => testContainer.resolve(InitialFetchHandler).hasCompletedInitialFetches))
  profileHandler = testContainer.resolve(ProfileHandler)
}

beforeAll(async () => {
  await signInDummyUser()
  authUser = container.resolve(AuthUser)
  dbHandler = container.resolve(DbHandler)
})

afterEach(async () => {
  await adminDb.collection('users').doc(authUser.uid).delete()
  await adminDb.collection('usernames').doc(testUsername).delete()
})

afterAll(async () => {
  await adminApp.delete()
})

// 🧪

describe('initialization', () => {
  test('local profile is set to null when user profile does not exist in database', async () => {
    await initializeProfileHandler()
    expect(profileHandler.profileInfo).toBeNull()
  })

  test('fetching profile of an existing user works', async () => {
    const profile: UserProfileInfo = { displayName: 'Bob', avatar: '😎', username: testUsername }
    await setDoc(doc(db, 'users', authUser.uid), profile)
    await initializeProfileHandler()
    expect(profileHandler.profileInfo).toEqual(profile)
  })
})

describe('behavior', () => {
  beforeEach(async () => {
    await initializeProfileHandler()
  })

  test('updated profile info appears in the "profile" field in the user document', async () => {
    await profileHandler.setUserProfileInfo({
      displayName: 'Jeff',
      avatar: '🐹',
      username: testUsername
    })
    const userDoc = await dbHandler.getOwnDoc()
    expect(userDoc).toEqual({
      displayName: 'Jeff',
      avatar: '🐹',
      username: testUsername
    })
  })

  test('updated profile data is reflected in local cache', async () => {
    await profileHandler.setUserProfileInfo({
      displayName: 'Zoe',
      avatar: '🐸',
      username: testUsername
    })
    expect(profileHandler.profileInfo?.displayName).toBe('Zoe')
  })

  test('updating profile data returns the new data', async () => {
    const profileInfo: UserProfileInfo = {
      displayName: 'Pam',
      avatar: '🐔',
      username: testUsername
    }
    expect(await profileHandler.setUserProfileInfo(profileInfo)).toEqual(profileInfo)
  })

  test('attempting to update profile without changing anything just returns the existing profile', async () => {
    const profileInfo: UserProfileInfo = {
      displayName: 'Arnold',
      avatar: '🤖',
      username: testUsername
    }
    const firstUpdate = await profileHandler.setUserProfileInfo(profileInfo)
    const secondUpdate = await profileHandler.setUserProfileInfo(profileInfo)
    expect(firstUpdate === secondUpdate).toBe(true)
  })
})

test('teardown: user document and username document are removed after tests', async () => {
  expect(await dbHandler.getOwnDoc()).toBeUndefined()
  expect(await dbHandler.getUsernameDoc(testUsername)).toBeNull()
})