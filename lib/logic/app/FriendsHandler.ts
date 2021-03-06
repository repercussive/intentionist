import { inject, singleton } from 'tsyringe'
import { makeAutoObservable, when } from 'mobx'
import { Unsubscribe } from '@firebase/util'
import { DocumentData, onSnapshot } from '@firebase/firestore'
import { Functions, httpsCallable } from '@firebase/functions'
import { UserProfileInfo } from '@/logic/app/ProfileHandler'
import DbHandler from '@/logic/app/DbHandler'

export type Friend = UserProfileInfo & { uid: string }
export const maxFriends = 50

@singleton()
export default class FriendsHandler {
  public friends: Friend[] = []
  public hasLoadedFriends = false
  private friendsDocListenerUnsubscribe: Unsubscribe | null = null

  constructor(private dbHandler: DbHandler, @inject('Functions') private functions: Functions) {
    makeAutoObservable(this)
  }

  public listenToFriendsDoc = () => {
    if (this.friendsDocListenerUnsubscribe) return
    this.friendsDocListenerUnsubscribe = onSnapshot(
      this.dbHandler.friendsDocRef,
      (snapshot) => this.handleFriendsDocSnapshot(snapshot.data())
    )
  }

  public stopListeningToFriendsDoc = () => {
    this.friendsDocListenerUnsubscribe?.()
    this.friendsDocListenerUnsubscribe = null
  }

  public removeFriend = async (uid: string) => {
    const friendsCountAfterRemoval = this.friends.length - 1
    const remove = httpsCallable(this.functions, 'removeFriend')
    await remove({ uid })
    await when(() => this.friends.length === friendsCountAfterRemoval)
  }

  private handleFriendsDocSnapshot = (friendsDocData: DocumentData | undefined) => {
    this.hasLoadedFriends = true
    const friends = friendsDocData?.friends as undefined | { [uid: string]: UserProfileInfo & { time: number } }
    if (!friends) return
    this.friends = Object.entries(friends)
      .sort(([_keyA, friendA], [_keyB, friendB]) => (friendA.time ?? 0) - (friendB.time ?? 0))
      .map(([uid, profileInfo]) => ({ uid, ...profileInfo }))
  }
}