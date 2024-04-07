# Project Overview

To see the website, go to https://jaredtweed.github.io/AngularProject-webpage

## Technical Highlights

This project is a web application that uses [Angular](https://github.com/angular/angular-cli) version 17.0.5 for the frontend and [Leaflet](https://leafletjs.com/) for map visualization.

1. **Angular**: This project uses Angular for building the frontend. Components were created for different parts of the application, such as the report form and the map view. Services were used to share data between these components.

2. **Angular Routing**: The application uses Angular's routing module to navigate between different components. This was used to create a single-page application experience, with seamless navigation to the data details.

3. **HttpClient**: Angular's HttpClient is used for making HTTP requests to a backend service. This was used to store reports submitted through the report form, and to access the Hashify API which maintains a secure password.

4. **Event Emitters**: Angular's EventEmitter class is used for emitting custom events in components. This was used to signal the map view to update its markers whenever a new report was submitted.

5. **Leaflet API**: Leaflet is used for map visualization. This includes creating and customizing maps, adding markers to the map, and handling map events. The Leaflet API was used to interact with the map and perform operations such as zooming to a specific location when a marker is clicked.

6. **TypeScript**: The application is written in TypeScript, which adds static types to JavaScript, improving the development experience and making the code more robust. TypeScript features such as interfaces and type annotations were used to ensure type safety throughout the application.

7. **HTML/CSS**: The layout and styling of the application are done using HTML and CSS. This includes creating responsive layouts and custom styles. CSS was used to style the report form and the map view, and to create a consistent look and feel across the application.

8. **RxJS**: This project uses RxJS for handling asynchronous operations and event-based programs by using observables. Observables were used to handle HTTP requests and to manage event emissions between components.

  

The compressed build is here: https://github.com/JaredTweed/AngularProject-webpage/
