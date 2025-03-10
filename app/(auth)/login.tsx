import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { supabase } from '../../utils/supabase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      Alert.alert(
        'Success!',
        isSignUp ? 'Account created. Check your email to verify.' : 'Logged in!'
      );
      if (!isSignUp) router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-5">
      <Text className="mb-5 text-2xl font-bold text-white">{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

      {/* Email Input */}
      <TextInput
        className="mb-3 w-full rounded-lg bg-gray-800 p-4 text-white"
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        className="mb-3 w-full rounded-lg bg-gray-800 p-4 text-white"
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login/Signup Button */}
      <TouchableOpacity
        className="w-full items-center rounded-lg bg-red-600 p-4"
        onPress={handleAuth}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-bold text-white">{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        )}
      </TouchableOpacity>

      {/* Toggle Sign In / Sign Up */}
      <TouchableOpacity className="mt-4" onPress={() => setIsSignUp(!isSignUp)}>
        <Text className="text-gray-400">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
