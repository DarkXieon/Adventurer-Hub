import { Component, Input } from '@angular/core';
import { CampaignInfo } from '../../providers/campaign-info/campaign-info';
import { UserInfo, AccountInfoProvider } from '../../providers/account-info/account-info';
import { CampaignPage } from '../../pages/campaign/campaign';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the CampaignPreviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'campaign-preview',
  templateUrl: 'campaign-preview.html'
})
export class CampaignPreviewComponent {

  @Input()
  private campaignPreviewInfo: CampaignPreviewInfo;
  
  constructor(
    private navCtrl: NavController,
    private accountInfo: AccountInfoProvider) {
  }
  
  private viewCampaign(): void {
    let campaignPlayers: UserInfo[] = [];
    let requiredSize = this.campaignPreviewInfo.campaign.contract.currentPlayers.length;

    this.campaignPreviewInfo.campaign.contract.currentPlayers.forEach(uid => {
      this.accountInfo.getUserInfo(uid).then(info => {
        let length = campaignPlayers.push(info);
        if (length == requiredSize) {
          this.showCampaignPage(this.campaignPreviewInfo.campaign, campaignPlayers);
        }
      });
    });
  }

  private showCampaignPage(campaignInfo: CampaignInfo, campaignPlayers: UserInfo[]): void {
    this.navCtrl.push(CampaignPage, { campaignInfo: campaignInfo, campaignPlayers: campaignPlayers });
  }
}

export interface CampaignPreviewInfo {
  campaign: CampaignInfo;
  distance?: number;
}
