import { NgModule } from '@angular/core';
import { CampaignPreviewComponent } from './campaign-preview/campaign-preview';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [CampaignPreviewComponent],
  imports: [IonicModule],
	exports: [CampaignPreviewComponent]
})
export class ComponentsModule {}
