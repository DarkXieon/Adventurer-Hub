import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AccountInfoProvider {
  
  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase) {
    
  }

  public setUserInfo(userInfo: UserInfo): void {
    this.firebaseDatabase.object<UserInfo>('users/' + this.getUid()).set(userInfo);
  }
  
  public async getUserInfo(uid: string): Promise<UserInfo> {
    return await this.firebaseDatabase.database.ref('users/' + uid).once('value').then(value => {
      return value.val();
    });
  }

  public getUid(): string {
    return this.firebaseAuth.auth.currentUser.uid;
  }

  public logout(): void {
    this.firebaseAuth.auth.signOut();
  }
}

export interface UserInfo {
  displayName: string;
  imagePath: string;
}
