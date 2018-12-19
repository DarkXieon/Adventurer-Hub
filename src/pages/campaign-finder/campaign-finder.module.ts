import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CampaignFinderPage } from './campaign-finder';

@NgModule({
  declarations: [
    CampaignFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(CampaignFinderPage),
  ],
})
export class CampaignFinderPageModule {}
