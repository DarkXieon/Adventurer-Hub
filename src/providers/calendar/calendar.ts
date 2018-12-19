import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';
import { CampaignInfo, DatabaseCampaignContract } from '../../providers/campaign-info/campaign-info';

/*
  Generated class for the CalendarProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalendarProvider {

  constructor(private calendar: Calendar) {

  }

  public scheduleCampaign(info: DatabaseCampaignContract): void {
    let currentDate: Date = new Date();
    let currentDay: number = currentDate.getDay();

    let splitStartTime: string[] = info.meetingTime.meetingStartTime.split(':');
    let splitEndTime: string[] = info.meetingTime.meetingEndTime.split(':');
    let startDay: number = currentDate.getDate() + (info.meetingTime.meetingDay - currentDate.getDay());
    let endDay: number = +splitStartTime[0] > +splitEndTime[0] ? startDay + 1 : startDay;

    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), startDay, +splitStartTime[0], +splitStartTime[1], 0, 0);
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), endDay, +splitEndTime[0], +splitEndTime[1], 0, 0);

    let options = this.calendar.getCalendarOptions();
    options.recurrence = 'weekly';

    this.calendar.createEventWithOptions(`D&D meeting (${info.name})`, "", "", startDate, endDate, options);
  }
}
