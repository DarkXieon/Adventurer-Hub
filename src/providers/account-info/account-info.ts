import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountInfoProvider {
  
  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase,
    private firebaseStorage: AngularFireStorage) {
    
  }

  public setUserInfo(userInfo: UserInfo): void {
    this.firebaseDatabase.object('users/' + this.getUid()).set(userInfo.displayName);
    this.firebaseStorage.ref('user files/' + this.getUid() + '/profle image').putString(<string>userInfo.imageUrl, 'data_url');
  }
  
  public async getUserInfo(uid: string): Promise<UserInfo> {
    let displayName: string = await this.firebaseDatabase.database.ref('users/' + uid).once('value').then(value => {
      return value.val();
    });

    let imageDataUrl: Observable<string> = this.firebaseStorage.ref('user files/' + this.getUid() + '/profle image').getDownloadURL();

    return { displayName: displayName, imageUrl: imageDataUrl };
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
  imageUrl: string | Observable<string>;
}
