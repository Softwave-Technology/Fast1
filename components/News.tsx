import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  const injectedJavaScript = `
    // Hide unwanted parts of the page
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    true; // Required for Android to signal the script completed
  `;
  return (
    <View className="flex-1">
      <WebView
        source={{ uri: 'https://www.formula1.com/en/latest/all' }}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
}
