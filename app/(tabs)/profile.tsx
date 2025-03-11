import { User } from '@supabase/supabase-js';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, SafeAreaView } from 'react-native';

import { supabase } from '../../utils/supabase';

import Loading from '~/components/Loading';
import { useAuth } from '~/context/AuthContext';

export default function Profile() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user }: User | any = useAuth();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        Alert.alert('Error', 'User is not logged in');
        return;
      }

      // Sign in with old password (to verify the user)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        Alert.alert('Error', 'Old password is incorrect');
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert('Error', updateError.message);
      } else {
        Alert.alert('Success', 'Password updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#11100f]">
      <View className="flex-1 bg-[#11100f] p-5">
        <View className="mb-4 rounded-lg bg-[#1a1a1a] p-4">
          {/* User Information */}
          <Text className="text-lg text-white">Email: {user.email}</Text>
        </View>

        {/* Password Change Form */}
        <View className="rounded-lg bg-[#1a1a1a] p-4">
          <Text className="mb-2 text-white">Old Password</Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            placeholder="Enter old password"
            placeholderTextColor="gray"
            className="mb-4 rounded bg-[#333333] p-3 text-white"
          />

          <Text className="mb-2 text-white">New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
            placeholderTextColor="gray"
            className="mb-4 rounded bg-[#333333] p-3 text-white"
          />

          <Text className="mb-2 text-white">Confirm New Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor="gray"
            className="mb-4 rounded bg-[#333333] p-3 text-white"
          />

          <Pressable
            onPress={handlePasswordChange}
            className="items-center rounded-lg bg-red-600 p-4"
            disabled={loading}>
            {loading ? <Loading /> : <Text className="font-bold text-white">Change Password</Text>}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
