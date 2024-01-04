
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { HashService } from '../../services/hash.service';
import { ReportLocation, Report } from '../../models/report.model';
import { v4 as uuidv4 } from 'uuid';
import { ValidatorFn } from '@angular/forms';

interface LocationWithId {
  name: string;
  longitude: number;
  latitude: number;
  id: string;
}


@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements AfterViewInit{
  reportForm: FormGroup;
  showPopup: boolean = false;
  locationList: LocationWithId[];
  createdLocations: ReportLocation[];
  @Output() reportSubmitted = new EventEmitter();

  constructor(private fb: FormBuilder, private reportService: ReportService, private hashService: HashService) {
    this.locationList = [];
    this.createdLocations = [];
    this.reportForm = this.fb.group({
      reporterInfo: this.fb.group({
        name: ['', Validators.required],
        phoneNumber: new FormControl("", [Validators.required, this.phoneNumberValidator as ValidatorFn])
      }),
      troublemakerName: ['', Validators.required],
      location: this.fb.group({
        name: ['', Validators.required],
        longitude: ['', Validators.required],
        latitude: ['', Validators.required]
      }),
      pictureUrl: [''],
      extraInfo: [''],
      timeDate: [''],
    });
  }

  // Define a custom validator function for phone number
  phoneNumberValidator(control: FormControl): ValidationErrors | null {
    let phoneNumber = control.value;
    if (!phoneNumber) {
      return null; // Return null if phoneNumber is null or undefined
    }
    phoneNumber = phoneNumber.replace(/\D/g, '').substring(0, 10);
    if (phoneNumber.length === 10) {
      return null; // Phone number is valid
    } else {
      return { invalidPhoneNumber: true }; // Phone number is invalid
    }
  };

  onSubmit() {
    // Set the reportForm's location to the corresponding location of the selected id
    const selectElement = document.getElementById('locationName') as HTMLSelectElement;
    const selectedOption: string = selectElement.options[selectElement.selectedIndex].value;
    const selectedLocation: LocationWithId | undefined = this.locationList.find(location => location.id === selectedOption);
    if (selectedLocation) {
      const { id, ...locationWithoutId } = selectedLocation;
      this.reportForm.patchValue({ location: locationWithoutId });
    }

    // Format the phone number
    const phoneNumber = this.formatPhoneNumber(this.reportForm.get('reporterInfo.phoneNumber')?.value);
    this.reportForm.patchValue({ reporterInfo: { phoneNumber: phoneNumber } });

    console.log('Report form:', this.reportForm.value);

    if (this.reportForm.valid) {
      const password = prompt('Please enter the password:');
      if (password) {
        // this.locationsList.push({name: this.reportForm.value.location, longitude: this.reportForm.value.longitude, latitude: this.reportForm.value.latitude});

        this.hashService.hashPassword(password).subscribe((hashedPassword: string) => {
          if (hashedPassword === 'c9fc20c27a5e29813e54ada78dce6c8f') {
            this.reportForm.patchValue({ timeDate: new Date() }); // Set timeDate to current time
            
            console.log('Submitting report:', this.reportForm.value);
            
            this.reportService.createReport(this.reportForm.value).subscribe(
              (response: any) => {
                // Handle the response by resetting the form
                this.reportForm.reset();
                console.log('Report submitted successfully.');
                this.reportSubmitted.emit();
              },
              (error: any) => {
                // Handle the error
                console.error('There was an error submitting the report:', error);
              }
            );
          } else {
            alert('Incorrect password. Report submission canceled. ');// + hashedPassword + ' \'' + password + '\'');
          }
        });
      }
    } else {
      alert('The report is not valid. Please fill in all required fields.');
    }
  }

  onLocationCreated(newLocation: ReportLocation) {
    this.reportForm.patchValue({ location: newLocation });
    this.createdLocations.push(newLocation);
    this.loadReports(true);
  }

  ngAfterViewInit(): void {
    this.loadReports();
  }

  loadReports(addRecentToStart: Boolean = false): void {
    this.reportService.pull().then(
      (reports: Report[]) => {
        const reportLocations = reports.map(report => report.location);
        const uniqueLocations = Array.from(new Set(reportLocations.map(location => JSON.stringify(location)))).map(location => JSON.parse(location));
        this.locationList = [...uniqueLocations, ...this.createdLocations].map(location => ({
          ...location,
          id: uuidv4()
        }));

        // Make alphabetical, and if addRecentToStart is true, move the last created location to the start of the list
        const lastCreatedLocationId = this.locationList[this.locationList.length - 1].id;
        this.locationList.sort((a, b) => a.name.localeCompare(b.name)); // Sort the locationList alphabetically by name
        if (addRecentToStart) {
          const lastCreatedLocationIndex = this.locationList.findIndex(location => location.id === lastCreatedLocationId);
          if (lastCreatedLocationIndex !== -1) {
            const lastCreatedLocation = this.locationList.splice(lastCreatedLocationIndex, 1)[0];
            this.locationList.unshift(lastCreatedLocation);
          }
        }
      }
        

        // console.log("LocationList: ", this.locationList);
        
        
        // const { id, ...reportLocation } = this.locationList[this.locationList.length - 1];
        // this.reportForm.controls['location'].setValue(reportLocation);

        // this.reportForm.controls['location'].setValue(this.locationList[this.locationList.length - 1], 7);


        // const selectElement = document.getElementById('locationName') as HTMLSelectElement;
        // selectElement.selectedIndex = this.locationList.length - 1;
        // console.log(selectElement.selectedIndex, this.locationList.length - 1); // always equal returns -1, then the correct number

        // Set the selected option to the last id in the location list
        // const selectElement = document.getElementById('locationName') as HTMLSelectElement;
        // selectElement.selectedIndex = this.locationList.length - 1;
        // console.log("EQUAL: ", this.locationList.length - 1, selectElement.selectedIndex);
        // console.log("SelectElement: ", selectElement.options, selectElement.options.selectedIndex);

        // console.log('Controls:', this.reportForm.controls['location']);
        // if (newLocation) {
        //   this.reportForm.controls['location'].setValue(null);
        // }
        // reports.forEach(report => console.log('Report:', report));
      // }
    );
  }

  formatPhoneNumber(phoneNumber?: string): string | undefined {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '').substring(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '($1) - $2 - $3'); // Format to (xxx) - xxx - xxxx
    } else {
      const element = document.getElementById('phone-number') as HTMLInputElement;
      element.value = element.value.replace(/\D/g, '').substring(0, 10); // Remove non-numeric characters and limit to 10 digits
      element.value = element.value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) - $2 - $3'); // Format to (xxx) - xxx - xxxx
      return undefined;
    }
  }
}