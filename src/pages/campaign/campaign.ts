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
    console.log(this.campaignInfo.contract.image);
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

  private showMeetingTime(): string {

    let message: string = "";

    for (let i = 0; i < this.campaignInfo.contract.meetingTimes.length; i++) {

      let currentTime = this.campaignInfo.contract.meetingTimes[i];
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

      if (i < this.campaignInfo.contract.meetingTimes.length - 1) {
        message += " , ";
      }
    }

    return message;
  }

  ionViewDidLoad() {
    console.log(this.campaignInfo);
    console.log(this.campaignPlayers);
  }
}
