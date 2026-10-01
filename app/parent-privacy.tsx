import { Linking, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../components/AppText';
import { ParentPage } from '../components/ParentPage';
import { BigButton, Header } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { translateText } from '../localization';

export default function Privacy() {
  const language = useAppStore(state => state.language);

  return (
    <ParentPage>
      <Header title="Privacy & Help" />
      <View style={{ width: '100%', padding: 20, borderRadius: 23, backgroundColor: '#E2F5E5', gap: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#19334D' }}>Privacy-first by design</Text>
        <Text style={{ fontSize: 14, color: '#526E7E', lineHeight: 21 }}>
          {translateText('No child account is required. A child’s optional nickname, avatar, settings, and learning progress stay on this device.', language)}
        </Text>
      </View>
      <BigButton
        label={translateText('Read Privacy Policy', language)}
        emoji="📄"
        onPress={() => router.push('/privacy-policy')}
        color="#DFF3FC"
      />
      <BigButton
        label={translateText('Email privacy support', language)}
        emoji="✉️"
        onPress={() => void Linking.openURL('mailto:info@021labs.online?subject=ABC%20Kids%20Privacy%20Request')}
        color="#FFF0C5"
      />
      <Text style={{ fontSize: 13, color: '#526E7E', textAlign: 'center' }}>info@021labs.online</Text>
    </ParentPage>
  );
}
