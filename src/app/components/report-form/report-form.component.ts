
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
export class ReportFormComponent implements AfterViewInit {
  reportForm: FormGroup;
  showPopup: boolean = false;
  locationList: LocationWithId[];
  createdLocations: ReportLocation[];
  @Output() reportSubmitted = new EventEmitter();
  @Output() themeChange = new EventEmitter();

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

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
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
    if (selectedOption != '0') {
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
    this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        const existingReport = reports.find(report => report.troublemakerName === troublemakerName && Math.abs(report.location.longitude - longitude) < 0.01 && Math.abs(report.location.latitude - latitude) < 0.01);
        if (existingReport) {
          alert(`The same troublemaker '${troublemakerName}' has already been reported near that location.`);
        } else {

          if (this.reportForm.valid) {
            // const password = prompt('Please enter the password:');
            // if (password) {
            // this.locationsList.push({name: this.reportForm.value.location, longitude: this.reportForm.value.longitude, latitude: this.reportForm.value.latitude});

            // this.hashService.hashPassword(password).subscribe((hashedPassword: string) => {
            // if (hashedPassword === 'c9fc20c27a5e29813e54ada78dce6c8f') {


            console.log('Submitting report:', this.reportForm.value);

            this.reportService.createReport(this.reportForm.value).subscribe(
              (response: any) => {
                // Handle the response by resetting the form
                this.reportForm.reset();
                console.log('Report submitted successfully.');
                this.reportSubmitted.emit(); // Signal to the parent component that a report has been submitted
                this.reportService.reportFormSubmitted.next(); // Signal to the map component that a report has been submitted
              },
              (error: any) => {
                // Handle the error
                console.error('There was an error submitting the report:', error);
              }
            );
            // } else {
            //   alert('Incorrect password. Report submission cancelled. ');// + hashedPassword + ' \'' + password + '\'');
            // }
            // });
            // }
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
    let matchingLocation = undefined;
    matchingLocation = this.locationList.find(location => {
      const latDiff = Math.abs(location.latitude - newLocation.latitude);
      const lngDiff = Math.abs(location.longitude - newLocation.longitude);
      return latDiff <= 0.005 && lngDiff <= 0.005;
    });
    if (matchingLocation) {
      alert('A location with the same coordinates already exists. Location selected.');
      console.log('Matching location:', matchingLocation);
      this.reportForm.patchValue({ location: newLocation });
      // this.loadLocationList(matchingLocation.id);
      this.loadLocationListWithSelectingDesiredLocation(matchingLocation.id);
      return;
    } else {
      this.reportForm.patchValue({ location: newLocation });
      this.createdLocations.push(newLocation);
      this.loadLocationListWithSelectingMostRecentAddition();
    }
  }

  ngAfterViewInit(): void {
    this.loadLocationListWithoutSelection();
  }

  removeId0FromLocationList(): void {
    this.locationList = this.locationList.filter(location => location.id !== '0');
  }

  loadLocationListWithSelectingDesiredLocation(idOfDesiredSelection: string): void {
    const desiredLocation = this.locationList.find(location => location.id === idOfDesiredSelection);
    if (desiredLocation) {
      const longitude = desiredLocation.longitude;
      const latitude = desiredLocation.latitude;
      console.log('Desired Location:', longitude, latitude);
    } else {
      console.log('Desired Location not found');
    }

    this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        const reportLocations = reports.map(report => report.location);
        const uniqueLocations = Array.from(new Set(reportLocations.map(location => JSON.stringify(location)))).map(location => JSON.parse(location));
        this.locationList = [...uniqueLocations, ...this.createdLocations].map(location => ({
          ...location,
          id: uuidv4()
        }));

        console.log('ID of desired selection:', idOfDesiredSelection);
        console.log('LocationList:', this.locationList);

        // Sort the locationList alphabetically by name
        this.locationList.sort((a, b) => a.name.localeCompare(b.name));

        // Find the index of the desired selection
        const indexOfDesiredSelection = this.locationList.findIndex(location => location.latitude === desiredLocation?.latitude && location.longitude === desiredLocation?.longitude);

        // Move the desired selection to the start of the list
        if (indexOfDesiredSelection !== -1) {
          const desiredSelection = this.locationList.splice(indexOfDesiredSelection, 1)[0]; // Remove the desired selection from the list
          this.locationList.unshift(desiredSelection); // Add the desired selection to the start of the list
        }
      }
    );
  }


  loadLocationListWithSelectingMostRecentAddition(): void {
    this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        const reportLocations = reports.map(report => report.location);
        const uniqueLocations = Array.from(new Set(reportLocations.map(location => JSON.stringify(location)))).map(location => JSON.parse(location));
        this.locationList = [...uniqueLocations, ...this.createdLocations].map(location => ({
          ...location,
          id: uuidv4()
        }));

        // Find the id of the last created location
        let idOfDesiredSelection = this.locationList[this.locationList.length - 1].id;

        // Sort the locationList alphabetically by name
        this.locationList.sort((a, b) => a.name.localeCompare(b.name));

        // Move the last created location to the start of the list
        const indexOfDesiredSelection = this.locationList.findIndex(location => location.id == idOfDesiredSelection);
        if (indexOfDesiredSelection !== -1) {
          const removedIndex = this.locationList.splice(indexOfDesiredSelection, 1)[0]; // Removes the item at the index and returns it
          this.locationList.unshift(removedIndex); // Add the item to the start of the list
        }
      }
    );
  }


  loadLocationListWithoutSelection(): void {
    this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        const reportLocations = reports.map(report => report.location);
        const uniqueLocations = Array.from(new Set(reportLocations.map(location => JSON.stringify(location)))).map(location => JSON.parse(location));
        this.locationList = [...uniqueLocations, ...this.createdLocations].map(location => ({
          ...location,
          id: uuidv4()
        }));

        this.locationList.sort((a, b) => a.name.localeCompare(b.name)); // Sort the locationList alphabetically by name
        this.locationList.unshift({ name: 'Select Location', longitude: 0, latitude: 0, id: '0' }); // Prepend the list with a null location
      }
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

  // getControlClass(controlName: string): string {
  //   const control = this.reportForm.get(controlName);
  //   if (control && control.invalid && (control.dirty || control.touched)) {
  //     return 'invalid';
  //   }
  //   return '';
  // }


  toggleTheme() {
    let currentTheme = document.body.getAttribute('data-theme');
    const themes = ['dark', 'clear', 'light'];
    if (currentTheme === null) {
      currentTheme = 'dark';
    }
    const currentIndex = themes.indexOf(currentTheme);
    const newIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[newIndex];
    document.body.setAttribute('data-theme', newTheme);

    // Save to localStorage if needed
    localStorage.setItem('theme', newTheme);
    this.themeChange.emit();
  }
}