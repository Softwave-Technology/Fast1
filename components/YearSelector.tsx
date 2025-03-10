import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Modal, Pressable, FlatList, Text } from 'react-native';

export default function YearSelector({
  selectedYear,
  setSelectedYear,
}: {
  selectedYear: string;
  setSelectedYear: any;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const years = Array.from({ length: 25 }, (_, i) => (2025 - i).toString());

  return (
    <View>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between rounded-lg bg-[#222] px-4 py-3">
        <Text className="text-lg text-white">
          {selectedYear ? `Season: ${selectedYear}` : 'Select a season'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="white" />
      </Pressable>
      {/* Year selection modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center bg-transparent bg-opacity-80">
          <View className="mx-5 rounded-lg bg-[#111] p-5">
            <Text className="mb-4 text-xl font-bold text-white">Select Season</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item}
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="p-4">
                  <Pressable
                    className="border-b border-gray-600 py-3"
                    onPress={() => {
                      setSelectedYear(item);
                      setModalVisible(false);
                    }}>
                    <Text className="text-center text-lg text-white">{item}</Text>
                  </Pressable>
                </View>
              )}
            />

            {/* Close Button */}
            <Pressable
              className="mt-4 items-center rounded-lg bg-red-600 p-3"
              onPress={() => setModalVisible(false)}>
              <Text className="text-lg font-bold text-white">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
