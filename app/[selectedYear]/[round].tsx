import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View, Text } from 'react-native';

import {
  fetchRaceResults,
  fetchSprintResults,
  fetchQualifyingResults,
} from '../../utils/fetchResults';

import Loading from '~/components/Loading';
import QualifyingResultsItem from '~/components/QualifyingResultsItem';
import RaceResultsItem from '~/components/RaceResultsItem';
import ResultsSection from '~/components/ResultsSection';
import SprintResultsItem from '~/components/SprintResultsItem';
import { RaceResults, QualifyingResults, SprintResult } from '~/types/types';

export default function RaceResultPage() {
  const [results, setResults] = useState<RaceResults[]>([]);
  const [qualifyingResults, setQualifyingResults] = useState<QualifyingResults[]>([]);
  const [sprintResults, setSprintResults] = useState<SprintResult[]>([]);
  const [raceErrorMessage, setRaceErrorMessage] = useState<string | undefined>(undefined);
  const [sprintErrorMessage, setSprintErrorMessage] = useState<string | undefined>(undefined);
  const [qualifyingErrorMessage, setQualifyingErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<'Race' | 'Sprint' | 'Qualifying'>('Race');
  const { round, selectedYear } = useLocalSearchParams<{ round?: string; selectedYear?: string }>();
  console.log('Year ', selectedYear);
  console.log('round ', round);

  useEffect(() => {
    const fetchData = async () => {
      if (!round || !selectedYear) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const raceData = await fetchRaceResults(selectedYear, round);
        if (raceData.results.length > 0) {
          setResults(raceData.results);
          setRaceErrorMessage(undefined);
        } else {
          setRaceErrorMessage(raceData.errorMessage);
        }

        const sprintData = await fetchSprintResults(selectedYear, round);
        if (sprintData.results.length > 0) {
          setSprintResults(sprintData.results);
          setSprintErrorMessage(undefined);
        } else {
          setSprintErrorMessage(sprintData.errorMessage);
        }

        const qualifyingData = await fetchQualifyingResults(selectedYear, round);
        if (qualifyingData.results.length > 0) {
          setQualifyingResults(qualifyingData.results);
          setQualifyingErrorMessage(undefined);
        } else {
          setQualifyingErrorMessage(qualifyingData.errorMessage);
        }
      } catch (error) {
        setRaceErrorMessage('An error occurred while fetching the race results.');
        setSprintErrorMessage('An error occurred while fetching the sprint race results.');
        setQualifyingErrorMessage('An error occurred while fetching the qualifying results.');
        console.error(error);
      }

      setLoading(false);
    };

    fetchData();
  }, [round]);

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Race and Qualifying Results',
            headerStyle: { backgroundColor: '#FF1E00' },
            headerTitleStyle: { color: 'white', fontWeight: 'bold', fontSize: 20 },
            headerTintColor: 'white',
            headerBackTitle: 'Back',
          }}
        />
        <Loading />
      </>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#11100f]">
      <Stack.Screen
        options={{
          title: 'Race and Qualifying Results',
          headerStyle: { backgroundColor: '#FF1E00' },
          headerTitleStyle: { color: 'white', fontWeight: 'bold', fontSize: 20 },
          headerTintColor: 'white',
          headerBackTitle: 'Back',
        }}
      />
      <View className="flex-row items-center justify-center gap-2 p-4">
        <Pressable
          className="w-1/3 rounded-xl bg-red-600 p-1"
          onPress={() => setSelectedResult('Race')}
          style={
            selectedResult === 'Race' && {
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: '#B91C1C',
            }
          }>
          <Text className="text-center text-xl font-bold text-white">Race</Text>
        </Pressable>
        <Pressable
          className="w-1/3 rounded-xl bg-red-600 p-1"
          onPress={() => setSelectedResult('Sprint')}
          style={
            selectedResult === 'Sprint' && {
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: '#B91C1C',
            }
          }>
          <Text className="text-center text-xl font-bold text-white">Sprint</Text>
        </Pressable>
        <Pressable
          className="w-1/3 rounded-xl bg-red-600 p-1"
          onPress={() => setSelectedResult('Qualifying')}
          style={
            selectedResult === 'Qualifying' && {
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: '#B91C1C',
            }
          }>
          <Text className="text-center text-xl font-bold text-white">Qualifying</Text>
        </Pressable>
      </View>

      {selectedResult === 'Race' && (
        <ResultsSection
          title="Race Results"
          results={results}
          errorMessage={raceErrorMessage}
          renderItem={({ item }) => <RaceResultsItem item={item} />}
          keyExtractor={(item: RaceResults) => item.Driver.familyName}
        />
      )}

      {selectedResult === 'Sprint' && (
        <ResultsSection
          title="Sprint Race Results"
          results={sprintResults}
          errorMessage={sprintErrorMessage}
          renderItem={({ item }) => <SprintResultsItem item={item} />}
          keyExtractor={(item) => `${round}-${item.Driver.driverId}-${item.position}`}
        />
      )}
      {selectedResult === 'Qualifying' && (
        <ResultsSection
          title="Qualifying Results"
          results={qualifyingResults}
          errorMessage={qualifyingErrorMessage}
          renderItem={({ item }) => <QualifyingResultsItem item={item} />}
          keyExtractor={(item: QualifyingResults) => item.Driver.familyName}
        />
      )}

      <StatusBar style="light" />
    </ScrollView>
  );
}
