import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CampaignInfoProvider, CampaignInfo, DatabaseCampaignContract } from '../../providers/campaign-info/campaign-info';
import { AccountInfoProvider, UserInfo } from '../../providers/account-info/account-info';
import { CampaignPage } from '../campaign/campaign';
import { CampaignFinderPage } from '../campaign-finder/campaign-finder';
import { Observable } from 'rxjs/Observable';
import { CreateCampaignPage } from '../create-campaign/create-campaign';

@IonicPage()
@Component({
  selector: 'page-your-campaigns',
  templateUrl: 'your-campaigns.html',
})
export class YourCampaignsPage {

  private yourCampaigns: CampaignInfo[];
  private userInfo: UserInfo;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private campaignInfo: CampaignInfoProvider,
    private accountInfo: AccountInfoProvider) {
  }
  
  private findNewCampaign() {
    this.navCtrl.push(CampaignFinderPage);
  }

  private logout(): void {
    this.accountInfo.logout();
  }

  private createCampaign(): void {
    this.navCtrl.push(CreateCampaignPage, this.accountInfo.getUid());
  }

  ionViewWillEnter() {
    this.accountInfo.getUserInfo(this.accountInfo.getUid()).then(info => {
      this.userInfo = info;
      this.campaignInfo.getUserCampaigns(this.accountInfo.getUid()).then(info => {
        if (info != null) {
          this.yourCampaigns = info;
        } else {
          this.yourCampaigns = [];
        }

        this.yourCampaigns.forEach(campaign => {

          this.campaignInfo.populateImage(campaign);
          console.log("Image for " + campaign.contract.name + " = " + campaign.contract.image);
        });
      });
    });

    console.log(this.accountInfo.getUid());
  }

  ionViewDidLoad() {

    console.log(this.accountInfo.getUid());
    
    //let campaign1: DatabaseCampaignContract = {
    //  ownerUid: this.accountInfo.getUid(),
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The Legends of Dragmore",
    //  description: "The Legends of Dragmore campaign is super fun!",
    //  currentPlayers: [this.accountInfo.getUid()],
    //  playersWanted: 4,
    //  latitude: 42.4631,
    //  longitude: 78.9359,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};

    //let campaign2: DatabaseCampaignContract = {
    //  ownerUid: this.accountInfo.getUid(),
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The mystery lost to time",
    //  description: "Join our group!",
    //  currentPlayers: [this.accountInfo.getUid()],
    //  playersWanted: 5,
    //  latitude: 42.4810,
    //  longitude: 79.0080,
    //  meetingTimes: [{
    //    meetingDay: 6,
    //    meetingStartTime: '13:00',
    //    meetingEndTime: '23:00'
    //  }]
    //};

    //let campaign3: DatabaseCampaignContract = {
    //  ownerUid: "",
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The Legends of Dragmore",
    //  description: "The Legends of Dragmore campaign is super fun!",
    //  currentPlayers: [this.accountInfo.getUid(), ""],
    //  playersWanted: 4,
    //  latitude: 42.4631,
    //  longitude: 78.9359,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};

    //let campaign4: DatabaseCampaignContract = {
    //  ownerUid: this.accountInfo.getUid(),
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The Legends of Dragmore",
    //  description: "The Legends of Dragmore campaign is super fun!",
    //  currentPlayers: [this.accountInfo.getUid()],
    //  playersWanted: 4,
    //  latitude: 42.4631,
    //  longitude: 78.9359,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};

    //let campaign5: DatabaseCampaignContract = {
    //  ownerUid: "",
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "Test",
    //  description: "Test",
    //  currentPlayers: [""],
    //  playersWanted: 4,
    //  latitude: 42.7159,
    //  longitude: 78.8295,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};

    //let campaign6: DatabaseCampaignContract = {
    //  ownerUid: "",
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The Legends of Dragmore",
    //  description: "The Legends of Dragmore campaign is super fun!",
    //  currentPlayers: [""],
    //  playersWanted: 4,
    //  latitude: 42.4631,
    //  longitude: 78.9359,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};


    //let campaign7: DatabaseCampaignContract = {
    //  ownerUid: "",
    //  image: "assets/imgs/five-headed-dragon.jpg",
    //  name: "The Legends of Dragmore",
    //  description: "The Legends of Dragmore campaign is super fun!",
    //  currentPlayers: [""],
    //  playersWanted: 4,
    //  latitude: 42.4631,
    //  longitude: 78.9359,
    //  meetingTimes: [{
    //    meetingDay: 3,
    //    meetingStartTime: '18:00',
    //    meetingEndTime: '22:00'
    //  }]
    //};

    //this.campaignInfo.addCampaign(campaign1);
    //this.campaignInfo.addCampaign(campaign2);
    //this.campaignInfo.addCampaign(campaign3);
    //this.campaignInfo.addCampaign(campaign4);
    //this.campaignInfo.addCampaign(campaign5);
    //this.campaignInfo.addCampaign(campaign6);
    //this.campaignInfo.addCampaign(campaign7);
  }
}
