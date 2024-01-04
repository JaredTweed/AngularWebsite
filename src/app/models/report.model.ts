export interface ReporterInfo {
    name: string;
    phoneNumber: string;
}

export interface ReportLocation {
    name: string;
    longitude: number;
    latitude: number;
}

export interface Report {
    id: string;
    reporterInfo: ReporterInfo;
    // reporterName: string;
    // reporterPhoneNumber: string;
    troublemakerName: string;
    location: ReportLocation;
    // longitude: number;
    // latitude: number;
    pictureUrl?: string;
    extraInfo?: string;
    timeDate: Date;
    status: 'OPEN' | 'RESOLVED';
}

/*Testing*/
// const reportString = `{'id': '2342', 'reporterInfo': {name: 'bobby', phoneNumber: '1234567890'}, 'troublemakerName': jim, 'location': 'bobbyville', 'longitude': '123', 'latitude': '123', 'pictureUrl': 'https://www.google.com/url?sa=i&url'}}`;
// const report = JSON.parse(reportString) as Report;
// console.log(report);
// const convertedReportString = JSON.stringify(report);
// console.log(convertedReportString);

