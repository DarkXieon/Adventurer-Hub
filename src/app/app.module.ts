import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { Platform } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CampaignPage } from '../pages/campaign/campaign';
import { CampaignFinderPage } from '../pages/campaign-finder/campaign-finder';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { YourCampaignsPage } from '../pages/your-campaigns/your-campaigns';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AccountInfoProvider } from '../providers/account-info/account-info';
import { CampaignInfoProvider } from '../providers/campaign-info/campaign-info';
import { CalendarProvider } from '../providers/calendar/calendar';
import { Calendar } from '@ionic-native/calendar';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationProvider } from '../providers/location/location';
import { ComponentsModule } from '../components/components.module';
import { Camera } from '@ionic-native/camera';
import { CreateCampaignPageModule } from '../pages/create-campaign/create-campaign.module';
import { CreateCampaignPage } from '../pages/create-campaign/create-campaign';

const config = {
  apiKey: "AIzaSyDFng8GwVcZiYtfv8F7CYtU9T88KmbLo00",
  authDomain: "adventurer-hub.firebaseapp.com",
  databaseURL: "https://adventurer-hub.firebaseio.com",
  projectId: "adventurer-hub",
  storageBucket: "adventurer-hub.appspot.com",
  messagingSenderId: "247558624907"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CampaignPage,
    CampaignFinderPage,
    CreateAccountPage,
    YourCampaignsPage,
    CreateCampaignPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CampaignPage,
    CampaignFinderPage,
    CreateAccountPage,
    YourCampaignsPage,
    CreateCampaignPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseAuthentication,
    Calendar,
    Geolocation,
    Camera,
    //Platform,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccountInfoProvider,
    CampaignInfoProvider,
    CalendarProvider,
    LocationProvider
  ]
})
export class AppModule {}
