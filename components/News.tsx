import { useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import Loading from '~/components/Loading';

export default function SocialFeed() {
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const twitterAccount = 'F1';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;">
        <a class="twitter-timeline" data-theme="dark" data-chrome="noheader nofooter noborders" href="https://twitter.com/${twitterAccount}">
          Tweets by ${twitterAccount}
        </a> 
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </body>
    </html>
  `;

  const handleLoadEnd = () => {
    if (!loading) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Conditionally render based on the loading state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      )}

      {/* Render the WebView with fade-in animation */}
      <Animated.View
        style={[
          styles.webViewContainer,
          { opacity: fadeAnim, display: loading ? 'none' : 'flex' },
        ]}>
        <WebView
          source={{ html: htmlContent }}
          onLoadEnd={handleLoadEnd}
          startInLoadingState={false}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11100f',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11100f',
  },
  webViewContainer: {
    flex: 1,
  },
});
