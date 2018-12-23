import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';
import { CampaignInfo, DatabaseCampaignContract, MeetingTime } from '../../providers/campaign-info/campaign-info';

@Injectable()
export class CalendarProvider {

  constructor(private calendar: Calendar) {

  }

  public scheduleCampaign(info: DatabaseCampaignContract): void {

    info.meetingTimes.forEach(meeting => {
      this.scheduleMeetingTime(meeting, info.name);
    });
  }

  private scheduleMeetingTime(meetingTime: MeetingTime, campaignName: string): void {
    let currentDate: Date = new Date();
    let currentDay: number = currentDate.getDay();

    let splitStartTime: string[] = meetingTime.meetingStartTime.split(':');
    let splitEndTime: string[] = meetingTime.meetingEndTime.split(':');
    let startDay: number = currentDate.getDate() + (meetingTime.meetingDay - currentDate.getDay());
    let endDay: number = +splitStartTime[0] > +splitEndTime[0] ? startDay + 1 : startDay;

    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), startDay, +splitStartTime[0], +splitStartTime[1], 0, 0);
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), endDay, +splitEndTime[0], +splitEndTime[1], 0, 0);

    let options = this.calendar.getCalendarOptions();
    options.recurrence = 'weekly';

    this.calendar.createEventWithOptions(`D&D meeting (${campaignName})`, "", "", startDate, endDate, options);
  }
}
