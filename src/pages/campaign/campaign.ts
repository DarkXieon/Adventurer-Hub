import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CampaignInfo, CampaignInfoProvider } from '../../providers/campaign-info/campaign-info';
import { AccountInfoProvider, UserInfo } from '../../providers/account-info/account-info';
import { CalendarProvider } from '../../providers/calendar/calendar';

@IonicPage()
@Component({
  selector: 'page-campaign',
  templateUrl: 'campaign.html',
})
export class CampaignPage {

  private campaignInfo: CampaignInfo;
  private campaignPlayers: UserInfo[];
  private isCampaignOwner: boolean;
  private isInCampaign: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userInfoProvider: AccountInfoProvider,
    private campaignInfoProvider: CampaignInfoProvider,
    private calendarProvider: CalendarProvider) {

    this.campaignInfo = this.navParams.data.campaignInfo;
    this.campaignPlayers = this.navParams.data.campaignPlayers;
    this.isCampaignOwner = this.campaignInfo.contract.ownerUid == userInfoProvider.getUid();
    this.isInCampaign = this.campaignInfo.contract.currentPlayers.find(player => player == userInfoProvider.getUid()) != null;
  }

  private addToCampaign(): void {
    this.campaignInfo.contract.currentPlayers.push(this.userInfoProvider.getUid());
    this.campaignInfoProvider.updateCampaign(this.campaignInfo);
    this.isInCampaign = true;

    this.calendarProvider.scheduleCampaign(this.campaignInfo.contract);
  }

  private removeFromCampaign(): void {
    this.campaignInfo.contract.currentPlayers = this.remove(this.campaignInfo.contract.currentPlayers, this.userInfoProvider.getUid());
    this.campaignInfoProvider.updateCampaign(this.campaignInfo);
    this.isInCampaign = false;
  }

  private deleteCampaign(): void {
    this.campaignInfoProvider.deleteCampaign(this.campaignInfo);
    this.navCtrl.pop();
  }

  private remove<T>(array: T[], element: T): T[] {
    let newArray: T[] = [];
    let removed: boolean = false;

    array.forEach(current => {
      if (current == element && !removed)
        removed = true;
      else
        newArray.push(current);
    });

    return newArray;
  }

  ionViewDidLoad() {
    console.log(this.campaignInfo);
    console.log(this.campaignPlayers);
  }

}
