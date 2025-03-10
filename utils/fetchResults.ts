export async function fetchRaceResults(selectedYear: string, round: string) {
  try {
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${selectedYear}/${round}/results.json`
    );
    const data = await response.json();
    const race = data.MRData.RaceTable.Races[0];

    return race && race.Results && race.Results.length > 0
      ? { results: race.Results }
      : { results: [], errorMessage: 'This race has not occurred yet. Please check back later.' };
  } catch (error) {
    console.error('Error fetching race results:', error);
    throw new Error('An error occurred while fetching the race results.');
  }
}

export async function fetchSprintResults(selectedYear: string, round: string) {
  try {
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${selectedYear}/${round}/sprint.json`
    );
    const data = await response.json();
    const race = data.MRData.RaceTable.Races[0];

    return race && race.SprintResults && race.SprintResults.length > 0
      ? { results: race.SprintResults }
      : { results: [], errorMessage: 'Sprint race results are not available for this round.' };
  } catch (error) {
    console.error('Error fetching sprint results:', error);
    throw new Error('An error occurred while fetching the sprint race results.');
  }
}

export async function fetchQualifyingResults(selectedYear: string, round: string) {
  try {
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${selectedYear}/${round}/qualifying.json`
    );
    const data = await response.json();
    const qualifying = data.MRData.RaceTable.Races[0];

    return qualifying && qualifying.QualifyingResults && qualifying.QualifyingResults.length > 0
      ? { results: qualifying.QualifyingResults }
      : { results: [], errorMessage: 'No qualifying data available for this race.' };
  } catch (error) {
    console.error('Error fetching qualifying results:', error);
    throw new Error('An error occurred while fetching the qualifying results.');
  }
}
