import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  const goBack = () => {
    if (webviewRef.current && canGoBack) {
      webviewRef.current.goBack();
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
              color={canGoBack ? 'white' : 'gray'}
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
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
}
