# Fast1 Formula 1 App

Seasonally updated Formula 1 races content with races, drivers, and information about races with race results. Current standings for drivers and constructors championship. Social media posts from official F1 X account. Now available for Closed Testing on Google Play Store. Soon to be published...

## API Reference

### Ergast API Reference

#### Overview
The Ergast API provides a comprehensive database of historical Formula 1 data, including race results, driver and constructor standings, circuit information, and more. It is a valuable resource for developers looking to access detailed information about Formula 1.

#### API Base URL
- **Base URL**: `https://api.jolpi.ca/ergast/f1`
The Ergast API has been deprecated, and the base url has been changed to api.jolpi.ca starting from 2025 season.

#### Common Endpoints
Here are some of the commonly used endpoints for accessing specific data:

- **Current Season Races**
  - **Endpoint**: `/current.json`
  - **Description**: Retrieves data about the current season's races.

- **Race Results**
  - **Endpoint**: `/current/{raceId}/results.json`
  - **Description**: Fetches results for a specific race in the current season.
  - **Example**: To get results for the Australian Grand Prix, use `/current/1/results.json`.

- **Driver Standings**
  - **Endpoint**: `/current/driverStandings.json`
  - **Description**: Retrieves the current standings of drivers.

- **Constructor Standings**
  - **Endpoint**: `/current/constructorStandings.json`
  - **Description**: Retrieves the current standings of constructors.

- **Historical Data**
  - **Endpoint**: `/season/{year}/race/{round}.json`
  - **Description**: Fetches data for a specific race in a specific season.

---

## Features

- Live race list of current season
- Live race rankings and race results
- Live drivers championship standings
- Live constructors championship standings
- Social media contents from F1 X account

## Screenshots

[Watch the video](https://github.com/user-attachments/assets/dac3d2e3-9405-4dbc-a97f-7f5c44eaaf0e)

<img width="332" alt="Screenshot 2024-10-11 at 17 43 36" src="https://github.com/user-attachments/assets/ece353de-aac1-4d00-8aaf-cfb68e97c79d">

<img width="332" alt="Screenshot 2024-10-11 at 17 40 18" src="https://github.com/user-attachments/assets/314b6241-1759-42c1-ab30-057f312ba272">

<img width="332" alt="Screenshot 2024-10-11 at 17 40 29" src="https://github.com/user-attachments/assets/a5906d84-add3-4831-be49-ab8d0cc40b56">

<img width="332" alt="Screenshot 2024-10-11 at 17 40 33" src="https://github.com/user-attachments/assets/7905adbc-7b88-4c67-9723-70693aaf0303">

<img width="332" alt="Screenshot 2024-10-11 at 17 40 37" src="https://github.com/user-attachments/assets/ab20b1c1-d5ef-4206-8349-8b1d6ea27c0e">

