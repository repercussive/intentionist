import '@abraham/reflection'
import { httpsCallable } from '@firebase/functions'
import { signOut } from '@firebase/auth'
import { waitForCloudFunctionExecution } from 'core/tests/cloud-functions/_helpers'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import signInDummyUser from '@/test-setup/signInDummyUser'
import teardownFirebase from '@/test-setup/teardownFirebase'
import initializeFirebase from '@/firebase-setup/initializeFirebase'

//#region test setup

const firebase = initializeFirebase()
const { app, db } = getFirebaseAdmin()
const { userDoc, usernameDoc, friendRequestsDoc, } = getDbShortcuts(db)
const cancelFriendRequest = httpsCallable(firebase.functions, 'cancelOutgoingFriendRequest')

const now = Date.now()
const authUserSeed = 'cancelFriendRequest'
let senderUid: string

const sender = {
  username: `test_sender${now}`,
  displayName: 'cancelFriendRequest Test Sender',
  avatar: '🧪'
}

const recipient = {
  uid: `test-recipient-uid${now}`,
  username: `test_recipient${now}`,
  displayName: 'cancelFriendRequest Test Recipient',
  avatar: '📨'
}

beforeAll(async () => {
  senderUid = (await signInDummyUser(authUserSeed)).uid
})

afterEach(async () => {
  await teardown()
})

afterAll(async () => {
  await teardownFirebase(firebase)
  await app.delete()
})

async function createFriendRequests() {
  await userDoc(senderUid).set({ username: sender.username, displayName: sender.displayName, avatar: sender.avatar })
  await userDoc(recipient.uid).set({ username: recipient.username, displayName: recipient.displayName, avatar: recipient.avatar })

  // allow username docs to be generated
  await waitForCloudFunctionExecution()

  await friendRequestsDoc(senderUid).set({
    outgoing: {
      [recipient.username]: { time: 123 }
    }
  })

  await friendRequestsDoc(recipient.uid).set({
    incoming: {
      [sender.username]: { time: 123 }
    }
  })
}

async function teardown() {
  await db.recursiveDelete(userDoc(senderUid))
  await db.recursiveDelete(userDoc(recipient.uid))
  await usernameDoc(sender.username).delete()
  await usernameDoc(recipient.username).delete()
}

//#endregion

beforeEach(async () => {
  await createFriendRequests()
})

describe('making a valid cancellation', () => {
  it(`removes the correct fields from the sender's outgoing requests and the recipient's incoming requests`, async () => {
    await cancelFriendRequest({ recipientUsername: recipient.username })

    const recipientIncomingRequests = (await friendRequestsDoc(recipient.uid).get()).data()?.incoming
    expect(recipientIncomingRequests).toEqual({})

    const senderOutgoingRequests = (await friendRequestsDoc(senderUid).get()).data()?.outgoing
    expect(senderOutgoingRequests).toEqual({})
  })
})

describe('expected failures', () => {
  it('fails if no recipient username is specified', async () => {
    let fails = false
    try { await cancelFriendRequest({}) }
    catch { fails = true }

    expect(fails).toEqual(true)
  })

  it('fails if the user is not authenticated', async () => {
    await signOut(firebase.auth)

    let fails = false
    try { await cancelFriendRequest({ recipientUsername: recipient.username }) }
    catch { fails = true }

    expect(fails).toEqual(true)

    await signInDummyUser(authUserSeed)
  })
})