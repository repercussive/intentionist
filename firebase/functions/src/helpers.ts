import type { UserData } from './types'
import type { Firestore, Transaction } from 'firebase-admin/firestore'

export function getUserDocShortcut(db: Firestore) {
  return (uid: string) => db.collection('users').doc(uid)
}

export function getUsernameDocShortcut(db: Firestore) {
  return (username: string) => db.collection('usernames').doc(username)
}

export function getFriendsDocShortcut(db: Firestore) {
  return (uid: string) => db.collection('users').doc(uid).collection('data').doc('friends')
}

export function getFriendRequestsDocShortcut(db: Firestore) {
  return (uid: string) => db.collection('users').doc(uid).collection('data').doc('friendRequests')
}

export async function getUserDataByUsername(transaction: Transaction, db: Firestore, username: string): Promise<UserData | undefined> {
  const querySnapshot = await transaction.get(db.collection('users').where('username', '==', username))
  if (querySnapshot.empty) return undefined
  const userDoc = querySnapshot.docs[0]
  const profile = userDoc.data()
  return {
    uid: userDoc.id,
    username: username,
    displayName: profile.displayName,
    avatar: profile.avatar
  }
}

export async function getUserDataByUid(transaction: Transaction, db: Firestore, uid: string): Promise<UserData | undefined> {
  const userDoc = await transaction.get(db.collection('users').doc(uid))
  const profile = userDoc.data()
  if (!profile) return undefined
  return {
    uid: uid,
    username: profile.username,
    displayName: profile.displayName,
    avatar: profile.avatar
  }
}