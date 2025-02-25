import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  const handleAuth = async () => {};

  const handleGoogleAuth = React.useCallback(async () => {
    try {
      const { createdSessionId } = await googleAuth();

      if (createdSessionId) {
        if (setActive) {
          await setActive({ session: createdSessionId });
        }
        router.push('/(tabs)');
      } else {
        throw new Error('Google sign-in failed to create a session.');
      }
    } catch (error) {
      console.error('Error while logging in with Google', error);
      setError('Google sign-in failed. Please try again.');
    }
  }, [googleAuth, setActive, router]);

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#ff0000', '#1a1a1a']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center">
          <Text>Auth page</Text>
          <Pressable
            className="border-hairline w-3/4 flex-row items-center justify-center gap-4 rounded-lg bg-white p-2"
            onPress={handleGoogleAuth}>
            <Text className="text-lg font-bold">Sign in with Google</Text>
            <FontAwesome name="google" size={20} color="black" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
