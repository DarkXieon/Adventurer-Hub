import { Injectable } from '@angular/core';
import { Geolocation, Coordinates, Geoposition } from '@ionic-native/geolocation';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(private geoLocation: Geolocation) {

  }

  public getCurrentCoordinates(): Promise<Geoposition> {
    return this.geoLocation.getCurrentPosition();
  }
  
  public getDistanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
    console.log(lat1);
    console.log(lat2);
    console.log(lon1);
    console.log(lon2);
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return +d.toFixed(2);
  }

  private toRad(degreeAngle: number): number {
    return degreeAngle * (Math.PI / 180);
  }
}
