import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CampaignInfoProvider, CampaignInfo } from '../../providers/campaign-info/campaign-info';
import { LocationProvider } from '../../providers/location/location';
import { AccountInfoProvider } from '../../providers/account-info/account-info';

@IonicPage()
@Component({
  selector: 'page-campaign-finder',
  templateUrl: 'campaign-finder.html',
})
export class CampaignFinderPage {

  private sortedCampaigns: DistancedCampaign[];
  private withinMiles: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private campaignInfoProvider: CampaignInfoProvider,
    private accountInfoProvider: AccountInfoProvider,
    private locationProvider: LocationProvider) {
  }
  
  ionViewWillEnter() {
    this.campaignInfoProvider.getUnjoinedCampaigns(this.accountInfoProvider.getUid()).then(result => {
      this.locationProvider.getCurrentCoordinates().then(location => {
        this.sortedCampaigns = result.map(info => {
          return {
            campaign: info,
            distance: this.locationProvider.getDistanceBetween(location.coords.latitude, location.coords.longitude * -1, info.contract.latitude, info.contract.longitude)
          }
        }).sort((a, b) => {
          return a.distance - b.distance;
          });
      });
    });
  }
}

interface DistancedCampaign {
  campaign: CampaignInfo;
  distance: number;
}

