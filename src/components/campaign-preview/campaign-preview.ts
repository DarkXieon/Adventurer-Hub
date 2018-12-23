import { Component, Input } from '@angular/core';
import { CampaignInfo } from '../../providers/campaign-info/campaign-info';
import { UserInfo, AccountInfoProvider } from '../../providers/account-info/account-info';
import { CampaignPage } from '../../pages/campaign/campaign';
import { NavController } from 'ionic-angular';

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

  private showMeetingTime(): string {

    let message: string = "";

    for (let i = 0; i < this.campaignPreviewInfo.campaign.contract.meetingTimes.length; i++) {

      let currentTime = this.campaignPreviewInfo.campaign.contract.meetingTimes[i];
      let startDay: string;
      let startTime: string;
      let endTime: string;

      switch (currentTime.meetingDay) {
        case 0:
          startDay = "Sunday";
          break;
        case 1:
          startDay = "Monday";
          break;
        case 2:
          startDay = "Tuesday";
          break;
        case 3:
          startDay = "Wednesday";
          break;
        case 4:
          startDay = "Thursday";
          break;
        case 5:
          startDay = "Friday";
          break;
        case 6:
          startDay = "Saturday";
          break;
      }

      let brokenStartTime = currentTime.meetingStartTime.split(':');
      let brokenEndTime = currentTime.meetingEndTime.split(':');

      brokenStartTime[1] = +brokenStartTime[0] > 11
        ? brokenStartTime[1] + ' p.m.'
        : brokenStartTime[1] + ' a.m.';

      brokenStartTime[0] = +brokenStartTime[0] > 12
        ? (+brokenStartTime[0] - 12) + ""
        : +brokenStartTime[0] == 0
          ? "12"
          : brokenStartTime[0];

      brokenEndTime[1] = +brokenEndTime[0] > 11
        ? brokenEndTime[1] + ' p.m.'
        : brokenEndTime[1] + ' a.m.';

      brokenEndTime[0] = +brokenEndTime[0] > 12
        ? (+brokenEndTime[0] - 12) + ""
        : +brokenEndTime[0] == 0
          ? "12"
          : brokenEndTime[0];

      startTime = brokenStartTime[0] + ":" + brokenStartTime[1];
      endTime = brokenEndTime[0] + ":" + brokenEndTime[1];

      message += `${startDay}s from ${startTime} to ${endTime}`;

      if (i < this.campaignPreviewInfo.campaign.contract.meetingTimes.length - 1) {
        message += " , ";
      }
    }

    return message;
  }
}

export interface CampaignPreviewInfo {
  campaign: CampaignInfo;
  distance?: number;
}
