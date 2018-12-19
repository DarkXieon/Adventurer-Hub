import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { AccountInfoProvider } from '../../providers/account-info/account-info';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  private email: string;
  private password: string;
  private displayName: string;
  private profileImage: string;
  private errorMessage: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private angularFireAuth: AngularFireAuth,
    private firebaseAuth: FirebaseAuthentication,
    private camera: Camera,
    private accountInfoProvider: AccountInfoProvider) {
  }

  private pickImage(): void {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then(res => {
      this.profileImage = "data:image/jpeg;base64," + res;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.profileImage);
    }, err => alert(err));
    
    console.log(this.profileImage);
  }

  private tryCreateAccount(): void {
    this.angularFireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((res: any) => this.accountInfoProvider.setUserInfo({ displayName: this.displayName, imagePath: this.profileImage }))
      .catch((error: any) => this.errorMessage = "Email is invalid");
  }
}
