import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocationProvider } from '../../providers/location/location';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { CampaignInfoProvider, DatabaseCampaignContract } from '../../providers/campaign-info/campaign-info';
import { Geoposition } from '@ionic-native/geolocation';
import { CalendarProvider } from '../../providers/calendar/calendar';

@IonicPage()
@Component({
  selector: 'page-create-campaign',
  templateUrl: 'create-campaign.html',
})
export class CreateCampaignPage {

  private image: string;
  private description: string;
  private name: string;
  private playerUid: string;
  private playersWanted: number;
  private errorMessage: string;
  private selectedDays: string[];
  private geoPosition: Geoposition;
  private meetings: WeeklyMeetings;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private camera: Camera,
    private location: LocationProvider,
    private campaignProvider: CampaignInfoProvider,
    private campaignCalendar: CalendarProvider) {
  }
  
  ionViewWillEnter() {

    this.playerUid = this.navParams.data;
    this.image = "";
    this.description = "";
    this.name = "";
    this.errorMessage = "";
    this.playersWanted = 5;
    this.selectedDays = ["Friday"];
      this.meetings = {
        Sunday: this.newMeeting(),
        Monday: this.newMeeting(),
        Tuesday: this.newMeeting(),
        Wednesday: this.newMeeting(),
        Thursday: this.newMeeting(),
        Friday: this.newMeeting(),
        Saturday: this.newMeeting()
      };

    this.location.getCurrentCoordinates().then(position => this.geoPosition = position);
  }

  private pickImage(): void {

    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then(res => {
      this.image = "data:image/jpeg;base64," + res;
      let cameraImageSelector = document.getElementById('camera-image');
      cameraImageSelector.setAttribute('src', this.image);
    }, err => alert(err));
  }

  private tryCreateAccount(): void {

    if (!this.detectErrors()) {
      
      let databaseCampaignContract: DatabaseCampaignContract = {
        ownerUid: this.playerUid,
        image: this.image,
        name: this.name,
        description: this.description,
        currentPlayers: [this.playerUid],
        playersWanted: this.playersWanted,
        latitude: this.geoPosition.coords.latitude,
        longitude: this.geoPosition.coords.longitude,
        meetingTimes: this.selectedDays.map(day => {
          return {
            meetingDay: this.convertDay(day),
            meetingStartTime: this.convertTime(this.meetings[day].StartTime, this.meetings[day].StartTimeType),
            meetingEndTime: this.convertTime(this.meetings[day].EndTime, this.meetings[day].EndTimeType)
          };
        })
      };

      this.campaignProvider.addCampaign(databaseCampaignContract);
      this.campaignCalendar.scheduleCampaign(databaseCampaignContract);
      this.navCtrl.pop();
    }
  }

  private detectErrors(): boolean {

    if (this.name == "") {
      this.errorMessage = "You need to enter a name";
      return true;
    }
    if (this.playersWanted < 2) {
      this.errorMessage = "You have to have a minimum of two people to find a group";
      return true;
    }
    if (this.selectedDays.length == 0) {
      this.errorMessage = "You must select at least one day out of the week to have your meetings";
      return true;
    }
    
    this.selectedDays.forEach(day => {
      if (!this.isValidTime(this.meetings[day].StartTime)) {
        this.errorMessage = `${day}'s start time is invalid or missing`;
        return true;
      }
      if (!this.isValidTime(this.meetings[day].EndTime)) {
        this.errorMessage = `${day}'s end time is invalid or missing`;
        return true;
      }
    });

    if (this.geoPosition == null) {
      this.errorMessage = "We are unable to retrieve your location at this time. Make sure we have permission to access your location.";
      return true;
    }

    return false;
  }

  private isValidTime(time: string): boolean {
    let values: string[] = time.split(':');
    
    if (values.length != 2
      || isNaN(+values[0])
      || isNaN(+values[1])
      || Math.trunc(+values[0]) < 1
      || Math.trunc(+values[0]) > 12
      || Math.trunc(+values[1]) < 0
      || Math.trunc(+values[1]) > 59) {

      return false;
    }

    return true;
  }

  private convertTime(time: string, timeType: 'a.m.' | 'p.m.'): string {

    let timeMod: number = timeType == 'a.m.'
      ? 0
      : 12;

    let values: string[] = time.split(':');

    return `${+values[0] + timeMod}:${values[1]}`;
  }

  private convertDay(day: string): number {

    switch (day) {
      case 'Sunday': return 0;
      case 'Monday': return 1;
      case 'Tuesday': return 2;
      case 'Wednesday': return 3;
      case 'Thursday': return 4;
      case 'Friday': return 5;
      case 'Saturday': return 6;
      default: console.error('incorrect day passed into conversion function');
    }
  }

  private newMeeting(): MeetingDay {
    return {
      StartTime: "",
      StartTimeType: "p.m.",
      EndTime: "",
      EndTimeType: "p.m."
    }
  }
}

interface WeeklyMeetings {
  Sunday: MeetingDay;
  Monday: MeetingDay;
  Tuesday: MeetingDay;
  Wednesday: MeetingDay;
  Thursday: MeetingDay;
  Friday: MeetingDay;
  Saturday: MeetingDay;
}

interface MeetingDay {
  StartTime: string;
  StartTimeType: string;
  EndTime: string;
  EndTimeType: string;
}
