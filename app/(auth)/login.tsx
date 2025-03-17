import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useAuth } from '~/context/AuthContext'; // Import AuthContext
import { supabase } from '~/utils/supabase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInAnonymously } = useAuth(); // Get anonymous sign-in function

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

      Alert.alert('Success!', isSignUp ? 'Account created. Logged in!' : 'Logged in!');
      if (!isSignUp) router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymously();
      Alert.alert('Signed in as Guest');
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        <Text className="mb-5 text-2xl font-bold text-white">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>

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
          className={`w-full items-center rounded-lg p-4 ${loading ? 'bg-gray-600' : 'bg-red-600'}`}
          onPress={handleAuth}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-bold text-white">{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
          )}
        </TouchableOpacity>

        {/* Continue as Guest Button */}
        <TouchableOpacity
          className="mt-4 w-full items-center rounded-lg bg-gray-700 p-4"
          onPress={handleAnonymousSignIn}
          disabled={loading}>
          <Text className="text-white">{loading ? 'Loading...' : 'Continue as Guest'}</Text>
        </TouchableOpacity>

        {/* Toggle Sign In / Sign Up */}
        <TouchableOpacity className="mt-4" onPress={() => setIsSignUp(!isSignUp)}>
          <Text className="text-gray-400">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
