export type Circuit = {
  circuitId: string;
  circuitName: string;
  Location: {
    locality: string;
    country: string;
  };
};
export type Race = {
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  round: string;
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
};
export type Location = {
  lat: string;
  long: string;
  locality?: string;
  country: string;
};

export type Constructor = {
  constructorId: string;
  name: string;
  nationality?: string;
  url?: string;
};

export type Driver = {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
  url?: string;
};
export type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
};

export type ConstructorStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
};

export type RaceResults = {
  position: string;
  status: string;
  Driver: Driver;
  Constructor: Constructor;
  Time?: {
    time: string;
  };
};

export type QualifyingResults = {
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1: string;
  Q2?: string;
  Q3?: string;
};

export type SprintResult = {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
};

export type SprintRace = {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: Location;
  };
  date: string;
  time: string;
  SprintResults: SprintResult[];
};

export type SprintRaceData = {
  MRData: {
    RaceTable: {
      season: string;
      round: string;
      Races: SprintRace[];
    };
  };
};
