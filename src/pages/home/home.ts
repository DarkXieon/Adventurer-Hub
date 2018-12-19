import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AccountInfoProvider, UserInfo } from '../../providers/account-info/account-info';
import { YourCampaignsPage } from '../your-campaigns/your-campaigns';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { CreateAccountPage } from '../create-account/create-account';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private email: string;
  private password: string;
  private errorMessage: string;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private angularFireAuth: AngularFireAuth,
    private accountInfoProvider: AccountInfoProvider,
    private camera: Camera) {

  }
  
  ionViewDidLoad() {
    this.angularFireAuth.auth.onAuthStateChanged(user => {
      if (this.angularFireAuth.auth.currentUser == null && this.navCtrl.first().name != "HomePage") {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      }
      else if (this.angularFireAuth.auth.currentUser != null && this.navCtrl.first().name == "HomePage") {
        //this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE).then(res => {
        //  this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password);
        //});

        this.navCtrl.setRoot(YourCampaignsPage);
        this.navCtrl.popToRoot();
      }
    });
  }

  private login(): void {
    if (this.platform.is('cordova')) {
      this.moblieLogin().then(value => {
      }).catch(err => {
        this.errorMessage = "Invalid Credentials";
      });
    } else {
      this.webLogin().then(value => {
      }).catch(err => {
        console.log(`${this.email} ${this.password}`);
        this.errorMessage = "Invalid Credentials";
      });
    }
  }

  private async moblieLogin(): Promise<any> {
    return await this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(res => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password);
    });
  }

  private async webLogin(): Promise<any> {
    return await this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password);
  }

  private createAccount(): void {
    this.navCtrl.push(CreateAccountPage);
  }
}
