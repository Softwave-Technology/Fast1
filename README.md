# 🏎️ Fast1 — Formula 1 App

An all-in-one Formula 1 companion app. Track live race data, driver and constructor standings, and explore up-to-date race information. Stay connected with official F1 news and media — **Now available on App Store! Version 2 coming soon!

---

## 🚀 Features

- 📅 **Live race list** for the current F1 season  
- 🏁 **Real-time race results** with rankings and positions  
- 🧑‍🏎️ **Driver championship standings** updated throughout the season  
- 🏢 **Constructor standings** with live updates  
- 📱 **Social feed** from the official F1 X (Twitter) account

---

## 🔌 API Reference

### 🧩 Ergast API Overview

The [Ergast Developer API](http://ergast.com/mrd/) offers a comprehensive collection of historical and current Formula 1 data, including:

- Race results  
- Driver & constructor standings  
- Circuit details  
- Seasonal statistics  

> ⚠️ **Note**: Starting from the 2025 season, the API has moved to a new base URL due to deprecation of the original Ergast API.

### 📡 Base URL

- **Base URL**: https://api.jolpi.ca/ergast/f1

### 📂 Common Endpoints

| Purpose                  | Endpoint                                           | Example                          |
|--------------------------|----------------------------------------------------|----------------------------------|
| Current Season Races     | `/current.json`                                    | Get all races in the season      |
| Specific Race Results    | `/current/{raceId}/results.json`                   | `/current/1/results.json`        |
| Driver Standings         | `/current/driverStandings.json`                    | -                                |
| Constructor Standings    | `/current/constructorStandings.json`               | -                                |
| Historical Race Data     | `/season/{year}/race/{round}.json`                 | `/season/2023/race/10.json`      |

---

## 📸 Screenshots

🎬 [Watch the Demo Video](https://github.com/user-attachments/assets/dac3d2e3-9405-4dbc-a97f-7f5c44eaaf0e)

<p float="left">
  <img src="https://github.com/user-attachments/assets/ece353de-aac1-4d00-8aaf-cfb68e97c79d" width="32%" />
  <img src="https://github.com/user-attachments/assets/314b6241-1759-42c1-ab30-057f312ba272" width="32%" />
  <img src="https://github.com/user-attachments/assets/a5906d84-add3-4831-be49-ab8d0cc40b56" width="32%" />
</p>
<p float="left">
  <img src="https://github.com/user-attachments/assets/7905adbc-7b88-4c67-9723-70693aaf0303" width="32%" />
  <img src="https://github.com/user-attachments/assets/ab20b1c1-d5ef-4206-8349-8b1d6ea27c0e" width="32%" />
</p>
