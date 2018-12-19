import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Reference } from '@firebase/database';
import { DataSnapshot } from '@firebase/database/dist/esm/src/api/DataSnapshot';
import { Predicate } from '@angular/core/src/debug/debug_node';

/*
  Generated class for the CampaignInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CampaignInfoProvider {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase) {

  }

  public addCampaign(campaignInfo: DatabaseCampaignContract): void {
    this.firebaseDatabase.list<DatabaseCampaignContract>('campaigns/').push(campaignInfo);
  }

  public updateCampaign(campaign: CampaignInfo): void {
    this.firebaseDatabase.database.ref('campaigns/' + campaign.key).update(campaign.contract);
  }

  public deleteCampaign(campaign: CampaignInfo): void {
    this.firebaseDatabase.database.ref('campaigns/' + campaign.key).remove();
  }

  public async getUserCampaigns(uid: string): Promise<CampaignInfo[]> {
    return await this.firebaseDatabase.database.ref('campaigns/').once('value').then(value => {
      let info = value.val();
      let propertyNames: string[] = Object.getOwnPropertyNames(info);
      let campaignInfos: CampaignInfo[] = propertyNames.map(propertyName => {
        return { key: propertyName, contract: info[propertyName] };
      }).filter(campaignInfo => {
        return campaignInfo.contract.currentPlayers.find(current => {
          return current == uid;
        }) != null;
      });

      return campaignInfos;
    });
  }

  public async getUnjoinedCampaigns(uid: string): Promise<CampaignInfo[]> {
    return await this.firebaseDatabase.database.ref('campaigns/').once('value').then(value => {
      let info = value.val();
      let propertyNames: string[] = Object.getOwnPropertyNames(info);
      let campaignInfos: CampaignInfo[] = propertyNames.map(propertyName => {
        return { key: propertyName, contract: info[propertyName] };
      }).filter(campaignInfo => {
        return campaignInfo.contract.currentPlayers.find(current => {
          return current == uid;
        }) == null;
        //return campaignInfo.contract.ownerUid == uid;
      });

      return campaignInfos;
    });
  }
}

export interface DatabaseCampaignContract {
  ownerUid: string;
  image: string;
  name: string;
  description: string;
  currentPlayers: string[];
  playersWanted: number;
  latitude: number;
  longitude: number;
  meetingTime: MeetingTime;
}

export interface CampaignInfo {
  key: string;
  contract: DatabaseCampaignContract;
}

export interface MeetingTime {
  meetingDay: number;
  meetingStartTime: string;
  meetingEndTime: string;
}
