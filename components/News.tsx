import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function News() {
  return (
    <View className="flex-1">
      <WebView
        source={{ uri: 'https://www.bbc.com/sport/formula1?/section=news' }}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    </View>
  );
}
