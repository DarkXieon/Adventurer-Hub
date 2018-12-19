import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourCampaignsPage } from './your-campaigns';

@NgModule({
  declarations: [
    YourCampaignsPage,
  ],
  imports: [
    IonicPageModule.forChild(YourCampaignsPage),
  ],
})
export class YourCampaignsPageModule {}
