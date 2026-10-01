import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../components/AppText';
import { Header, Screen } from '../components/ui';
import { privacyPolicyContent } from '../data/privacyPolicy';
import { isRTL } from '../localization';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, space } from '../theme/tokens';

export default function PrivacyPolicy() {
  const language = useAppStore(state => state.language);
  const rtl = isRTL(language);
  const copy = (value: { en: string; ur: string }) => language === 'ur' ? value.ur : value.en;

  return (
    <Screen>
      <Header title={copy(privacyPolicyContent.title)} />
      <View style={[styles.intro, rtl && styles.rtlView]}>
        <Text translate={false} style={[styles.updated, rtl && styles.rtlText]}>{copy(privacyPolicyContent.updated)}</Text>
        <Text translate={false} style={[styles.summary, rtl && styles.rtlText]}>{copy(privacyPolicyContent.summary)}</Text>
      </View>

      {privacyPolicyContent.sections.map(section => (
        <View key={section.title.en} style={[styles.card, rtl && styles.rtlView]}>
          <Text translate={false} style={[styles.sectionTitle, rtl && styles.rtlText]}>{copy(section.title)}</Text>
          {section.paragraphs.map((paragraph, index) => (
            <Text key={`${section.title.en}-${index}`} translate={false} style={[styles.body, rtl && styles.rtlText]}>{copy(paragraph)}</Text>
          ))}
        </View>
      ))}

      <View style={[styles.contact, rtl && styles.rtlView]}>
        <Text translate={false} style={[styles.sectionTitle, rtl && styles.rtlText]}>{copy(privacyPolicyContent.contactTitle)}</Text>
        <Text translate={false} style={[styles.body, rtl && styles.rtlText]}>{copy(privacyPolicyContent.contactBody)}</Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={privacyPolicyContent.email}
          onPress={() => void Linking.openURL(`mailto:${privacyPolicyContent.email}?subject=${encodeURIComponent(privacyPolicyContent.emailSubject)}`)}
          style={styles.emailButton}
        >
          <Text translate={false} style={styles.email}>{privacyPolicyContent.email}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { width: '100%', padding: 20, borderRadius: radius.lg, backgroundColor: '#DFF4FC', gap: 10 },
  updated: { fontSize: 13, fontWeight: '800', color: '#527082' },
  summary: { fontSize: 16, lineHeight: 25, fontWeight: '700', color: colors.ink },
  card: { width: '100%', padding: 20, borderRadius: radius.lg, backgroundColor: '#FFFFFF', gap: 11 },
  sectionTitle: { fontSize: 18, lineHeight: 25, fontWeight: '900', color: colors.ink },
  body: { fontSize: 14, lineHeight: 22, color: '#405E72' },
  contact: { width: '100%', padding: 20, borderRadius: radius.lg, backgroundColor: '#FFF0C5', gap: 10, marginBottom: space.lg },
  emailButton: { alignSelf: 'flex-start', minHeight: 48, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  email: { fontSize: 16, lineHeight: 24, fontWeight: '900', color: '#155D7B', textDecorationLine: 'underline' },
  rtlView: { direction: 'rtl' },
  rtlText: { writingDirection: 'rtl', textAlign: 'right' },
});
