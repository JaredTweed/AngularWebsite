// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-map-view',
//   templateUrl: './map-view.component.html',
//   styleUrl: './map-view.component.css'
// })
// export class MapViewComponent {

// }


interface TroublemakersAtLocation {
  troublemakerNames: string[];
  locationName: string;
  longitude: number;
  latitude: number;
}

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Report } from '../../models/report.model';
import { ReportService } from '../../services/report.service';
// import '../../../node_modules/leaflet/dist/leaflet.js'
// import '../../../node_modules/leaflet/dist/leaflet.css'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [49.2600, -123.0000];
  private markersLayer: L.LayerGroup = L.layerGroup(); // Change to use LayerGroup
  reportService: ReportService; // Make sure this is injected properly

  constructor(reportService: ReportService) { // Constructor injection
    this.reportService = reportService;
  }

  ngOnInit(): void {
    this.updateMarkers();
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {center: [49.200, -123.0000], zoom: 10});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.markersLayer.addTo(this.map);
  }

  updateMarkers(): void {
    this.markersLayer.clearLayers(); // Clear existing layers
    this.reportService.getAllReports().subscribe((reports: Report[]) => {

      const groupedReports: TroublemakersAtLocation[] = reports.reduce((result: TroublemakersAtLocation[], report: Report) => {
        const existingGroup = result.find(group => group.latitude === report.location.latitude && group.longitude === report.location.longitude);
        if (existingGroup) {
          existingGroup.troublemakerNames.push(report.troublemakerName);
          existingGroup.troublemakerNames.sort(); // Sort the troublemakerNames alphabetically
        } else {
          result.push({
            troublemakerNames: [report.troublemakerName],
            locationName: report.location.name,
            longitude: report.location.longitude,
            latitude: report.location.latitude
          });
        }
        return result;
      }, []);

      groupedReports.forEach(report => this.addMarker(report));
      console.log(this.markersLayer);
      this.markersLayer.addTo(this.map); // Add the layer to the map once all the markers have been added
    });
  }

  addMarker(info: TroublemakersAtLocation) {
    if (this.map) {
      let currentMarker = L.marker([info.latitude, info.longitude], { riseOnHover: true })
        .bindPopup(`<b>Location:</b> ${info.locationName}<br><b>Troublemaker${info.troublemakerNames.length === 1 ? '' : 's'}: </b>${info.troublemakerNames.join(', ')}`)
        .on('click', async () => {
          this.map!.flyTo([info.latitude, info.longitude], 12);
          currentMarker.openPopup();
        })
        .addTo(this.markersLayer);
    }
  }







  // updateMarkers(): void {
  //   this.markersLayer.clearLayers(); // Clear existing layers
  //   this.reportService.getAllReports().subscribe((reports: Report[]) => {
  //     reports.forEach(report => this.addMarker(report));
  //     console.log(this.markersLayer);
  //     this.markersLayer.addTo(this.map); // Add the layer to the map once all the markers have been added
  //   });
  // }

  // addMarker(report: Report): void {
  //   if(report.longitude != null && report.latitude != null) { // Change to '&&' for proper checking
  //     const marker = L.marker([report.latitude, report.longitude])
  //       .bindPopup(this.createPopupContent(report));
  //     this.markersLayer.addLayer(marker); // Add marker to the layer group
  //   }
  // }


  // private createPopupContent(report: Report): string {
  //   return `<div>
  //             <h4>${report.troublemakerName}</h4>
  //             <p>Reported by: ${report.reporterInfo.name}</p>
  //             <p>Location: ${report.location}</p>
  //             <p>Details: ${report.extraInfo}</p>
  //           </div>`;
  // }

  

}









/*

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../services/map.service';
import { ReportService } from '../services/report.service';
import { Subscription } from 'rxjs';
import { Report } from '../models/report.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
// export class MapViewComponent {
// }

export class MapViewComponent  implements OnInit, OnDestroy {

  private reportsSubscription: Subscription = new Subscription();

  constructor(
    private mapService: MapService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.initializeMap();
    this.subscribeToReportUpdates();
  }

  ngOnDestroy(): void {
    if (this.reportsSubscription) {
      this.reportsSubscription.unsubscribe();
    }
  }

  private initializeMap(): void {
    const initialCoordinates: L.LatLngExpression = [39.8283, -98.5795]; // Adjust as necessary
    this.mapService.initializeMap('map', initialCoordinates, 13);
  }

  private subscribeToReportUpdates(): void {
    this.reportsSubscription = this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        this.mapService.updateMarkers(reports);
      },
      (error) => {
        console.error('Error fetching reports: ', error);
      }
    );
  }
}
*/