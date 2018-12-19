import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CampaignInfoProvider, CampaignInfo } from '../../providers/campaign-info/campaign-info';
import { LocationProvider } from '../../providers/location/location';
import { AccountInfoProvider } from '../../providers/account-info/account-info';

/**
 * Generated class for the CampaignFinderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  ionViewDidLoad() {
    console.log(+this.withinMiles);
    console.log(+this.withinMiles == NaN);
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
        console.log(this.sortedCampaigns);
      });
    });
  }
}

interface DistancedCampaign {
  campaign: CampaignInfo;
  distance: number;
}

