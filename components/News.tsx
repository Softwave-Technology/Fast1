import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack); // Update back button state
  };

  const goBack = () => {
    if (webviewRef.current && canGoBack) {
      webviewRef.current.goBack(); // Go to the previous page
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={25}
              color={canGoBack ? 'white' : 'gray'} // Disable if can't go back
              style={{ paddingLeft: 20 }}
              onPress={goBack}
            />
          ),
        }}
      />
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.formula1.com/en/latest/all.html' }}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        onNavigationStateChange={handleNavigationStateChange} // Track navigation state
      />
    </View>
  );
}
