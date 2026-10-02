import { Share } from 'react-native';

const appStoreLink = 'https://play.google.com/store/apps/details?id=com.abckids.learning';

export function shareInvite() {
  return Share.share({
    title: 'ABC Friends',
    message: `Try ABC Friends, a playful app for learning letters and animals! Find it on Google Play: ${appStoreLink}`,
  }, { dialogTitle: 'Invite a friend to ABC Friends' });
}

export function shareCelebration(stars: number) {
  return Share.share({
    title: 'ABC Friends celebration',
    message: `We earned ${stars} stars in ABC Friends! 🎉 Come celebrate and learn with us: ${appStoreLink}`,
  }, { dialogTitle: 'Celebrate with friends' });
}
