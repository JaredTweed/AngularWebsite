
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
    if(selectedOption != '0') {
      const selectedLocation: LocationWithId | undefined = this.locationList.find(location => location.id === selectedOption);
      if (selectedLocation) {
        const { id, ...locationWithoutId } = selectedLocation;
        this.reportForm.patchValue({ location: locationWithoutId });
      }
    }

    // Format the phone number
    const phoneNumber = this.formatPhoneNumber(this.reportForm.get('reporterInfo.phoneNumber')?.value);
    this.reportForm.patchValue({ reporterInfo: { phoneNumber: phoneNumber } });

    // Set timeDate to current time
    this.reportForm.patchValue({ timeDate: new Date() }); 

    console.log('Report form:', this.reportForm.value);

    
    // Check if the same troublemakerName already exists at the exact coordinates
    const troublemakerName = this.reportForm.get('troublemakerName')?.value;
    const longitude = this.reportForm.get('location.longitude')?.value;
    const latitude = this.reportForm.get('location.latitude')?.value;
    this.reportService.pull().then(
      (reports: Report[]) => {
        const existingReport = reports.find(report => report.troublemakerName === troublemakerName && Math.abs(report.location.longitude - longitude) < 0.01 && Math.abs(report.location.latitude - latitude) < 0.01);
        if (existingReport) {
          alert(`The same troublemaker '${troublemakerName}' has already been reported near that location.`);
        } else{

          if (this.reportForm.valid) {
            const password = prompt('Please enter the password:');
            if (password) {
              // this.locationsList.push({name: this.reportForm.value.location, longitude: this.reportForm.value.longitude, latitude: this.reportForm.value.latitude});
      
              this.hashService.hashPassword(password).subscribe((hashedPassword: string) => {
                if (hashedPassword === 'c9fc20c27a5e29813e54ada78dce6c8f') {
                  
                  
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
                  alert('Incorrect password. Report submission cancelled. ');// + hashedPassword + ' \'' + password + '\'');
                }
              });
            }
          } else {
      
            // Get the names of invalid controls in the reportForm
            const invalidControls = Object.keys(this.reportForm.controls).filter(controlName => this.reportForm.controls[controlName].invalid);
      
            // Map the invalid control names to their corresponding error messages
            const invalidControlNames = invalidControls.map(controlName => {
              const control = this.reportForm.get(controlName);
              if (controlName === 'reporterInfo') {
                // If the invalid control is reporterInfo, get the names of invalid children controls
                const reporterInfoControl = this.reportForm.get('reporterInfo') as FormGroup; // Cast to FormGroup
                const reporterInfoChildren = reporterInfoControl ? Object.keys(reporterInfoControl.controls).filter(childControlName => reporterInfoControl.controls[childControlName].invalid) : [];
                
                // Format the error messages for each invalid child control
                const formattedChildren = reporterInfoChildren.map(childControlName => {
                  if (childControlName === 'phoneNumber') {
                    return 'Phone number must be 10 digits';
                  } else if (childControlName === 'name') {
                    return 'Name is required';
                  } else {
                    return childControlName;
                  }
                });
                
                return formattedChildren.join('\n'); // Join the error messages for invalid children controls
              } else if (controlName === 'location') {
                return 'Location is required';
              } else if (controlName === 'troublemakerName') {
                return 'Troublemaker\'s name is required';
              } else {
                return controlName;
              }
            });
      
            // Display an alert with the invalid control names and error messages
            alert(`Your submission is invalid:\n${invalidControlNames.join('\n')}`);
          }
      }
  }); 
    
    // const existingReport = this.createdLocations.find(report => report.troublemakerName === troublemakerName && report.longitude === longitude && report.latitude === latitude);
    // if (existingReport) {
    //   console.log(`The same troublemaker '${troublemakerName}' has already been reported near that location.`);
    //   return;
    // }
    // const troublemakerLocation = reports.map(report => {report.troublemakerName, report.location.longitude, report.location.latitude});
        



  }

  onLocationCreated(newLocation: ReportLocation) {
    this.reportForm.patchValue({ location: newLocation });
    this.createdLocations.push(newLocation);
    this.loadLocationList(true);
  }

  ngAfterViewInit(): void {
    this.loadLocationList();
  }

  loadLocationList(addRecentToStart: Boolean = false): void {
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
        } else {
          // Prepend the list with a null location
          this.locationList.unshift({ name: 'Select Location', longitude: 0, latitude: 0, id: '0' });
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

  getControlClass(controlName: string): string {
    const control = this.reportForm.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      return 'invalid';
    }
    return '';
  }
}