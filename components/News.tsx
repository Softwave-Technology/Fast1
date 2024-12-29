import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  const [url, setUrl] = useState('https://www.formula1.com/en/latest/all.html');

  const reloadPage = () => {
    setUrl('https://www.formula1.com/en/latest/all.html');
  };

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={25}
              color="white"
              style={{ paddingLeft: 20 }}
              onPress={reloadPage}
            />
          ),
        }}
      />
      <WebView
        key={url}
        source={{ uri: url }}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      />
    </View>
  );
}
