import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Reference } from '@firebase/database';
import { DataSnapshot } from '@firebase/database/dist/esm/src/api/DataSnapshot';
import { Predicate } from '@angular/core/src/debug/debug_node';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';

@Injectable()
export class CampaignInfoProvider {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase,
    private firebaseStorage: AngularFireStorage) {

  }

  private getDatabaseVersion(campaignInfo: DatabaseCampaignContract): DatabaseCampaignContract {

    let toPush: DatabaseCampaignContract = {
      ownerUid: campaignInfo.ownerUid,
      name: campaignInfo.name,
      description: campaignInfo.description,
      currentPlayers: campaignInfo.currentPlayers,
      playersWanted: campaignInfo.playersWanted,
      latitude: campaignInfo.latitude,
      longitude: campaignInfo.longitude,
      meetingTimes: campaignInfo.meetingTimes
    };

    return toPush;
  }

  public addCampaign(campaignInfo: DatabaseCampaignContract): void {

    let toPush = this.getDatabaseVersion(campaignInfo);

    this.firebaseDatabase.list<DatabaseCampaignContract>('campaigns/').push(toPush);
    this.firebaseStorage.ref('campaigns/' + campaignInfo.ownerUid + '/' + campaignInfo.name).putString(<string>campaignInfo.image, 'data_url');
  }

  public updateCampaign(campaign: CampaignInfo): void {

    let toPush = this.getDatabaseVersion(campaign.contract);

    this.firebaseDatabase.database.ref('campaigns/' + campaign.key).update(toPush);
  }

  public deleteCampaign(campaign: CampaignInfo): void {
    this.firebaseDatabase.database.ref('campaigns/' + campaign.key).remove();
  }

  public populateImage(info: CampaignInfo): void {
    info.contract.image = this.firebaseStorage
      .ref('campaigns/' + info.contract.ownerUid + '/' + info.contract.name)
      .getDownloadURL();
  }

  public async getUserCampaigns(uid: string): Promise<CampaignInfo[]> {
    return await this.firebaseDatabase.database.ref('campaigns/').once('value').then(value => {
      let info = value.val();

        try {

          let propertyNames: string[] = Object.getOwnPropertyNames(info);
          let campaignInfos: CampaignInfo[] = propertyNames.map(propertyName => {
            return { key: propertyName, contract: info[propertyName] };
          }).filter(campaignInfo => {
            return campaignInfo.contract.currentPlayers.find(current => {
              console.log(current);
              return current == uid;
            }) != null;
          });
          
        for (let i; i < campaignInfos.length; i++) {
          campaignInfos[i].contract.image = this.firebaseStorage
            .ref('campaigns/' + campaignInfos[i].contract.ownerUid + '/' + campaignInfos[i].contract.name)
            .getDownloadURL();
        }
          
        return campaignInfos;
      }
      catch (err) {
        console.error(err);
        return [];
      }
    });
  }

  public async getUnjoinedCampaigns(uid: string): Promise<CampaignInfo[]> {
    return await this.firebaseDatabase.database.ref('campaigns/').once('value').then(value => {
      let info = value.val();
      
      try {

        let propertyNames: string[] = Object.getOwnPropertyNames(info);
        let campaignInfos: CampaignInfo[] = propertyNames.map(propertyName => {
          return { key: propertyName, contract: info[propertyName] };
        }).filter(campaignInfo => {
          return campaignInfo.contract.currentPlayers.find(current => {
            return current == uid;
          }) == null;
        });

        campaignInfos.forEach(campaignInfo => campaignInfo.contract.image = this.firebaseStorage
          .ref('campaigns/' + campaignInfo.contract.ownerUid + '/' + campaignInfo.contract.name)
          .getDownloadURL());

        return campaignInfos;
      }
      catch {
        return [];
      }
    });
  }
}

export interface DatabaseCampaignContract {
  ownerUid: string;
  image?: string | Observable<string>;
  name: string;
  description: string;
  currentPlayers: string[];
  playersWanted: number;
  latitude: number;
  longitude: number;
  meetingTimes: MeetingTime[];
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
