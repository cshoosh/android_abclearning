import { Text } from './AppText';
import { AnimalIllustration } from './AnimalIllustration';
import React, { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useLocales } from 'expo-localization';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { BounceIn, cancelAnimation, Easing, FadeInUp, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, space } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { gridColumns } from '../domain/access';
import { getLanguageOptions, isRTL, translateText } from '../localization';
import { playUiSound } from '../services/uiSoundEvents';

export function Screen({children, scroll=true}:React.PropsWithChildren<{scroll?:boolean}>) {
  const language = useAppStore(state => state.language);
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const direction = isRTL(language) ? 'rtl' : 'ltr';
  return <SafeAreaView style={[s.screen,{direction}]}><View pointerEvents="none" style={s.sun}/><View pointerEvents="none" style={s.cloudA}/><View pointerEvents="none" style={s.cloudB}/>
    {scroll ? <ScrollView contentContainerStyle={[s.content,landscape&&s.landscapeContent]} showsVerticalScrollIndicator={false}>{children}</ScrollView> : <View style={[s.content,landscape&&s.landscapeContent,{flex:1}]}>{children}</View>}
  </SafeAreaView>;
}
export function Header({title, back=true, right, onHome}: {title:string;back?:boolean;right?:React.ReactNode;onHome?:()=>void}) {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const language = useAppStore(state => state.language);
  const buttonLabel = translateText(back ? 'Back' : 'Home', language);
  const buttonHint = translateText(back ? 'Returns to the previous screen' : 'Returns to the home screen', language);
  return <View style={[s.header,landscape&&s.landscapeHeader]}><Pressable accessibilityRole="button" accessibilityLabel={buttonLabel} accessibilityHint={buttonHint} onPress={()=>back?router.back():onHome?onHome():router.replace('/')} style={({pressed})=>[s.back,landscape&&s.landscapeBack,{transform:[{scale:pressed?0.96:1}]}]}>{back
    ? <Svg width={24} height={24} viewBox="0 0 24 24"><Path d={isRTL(language)?'M9 5l7 7-7 7':'M15 5l-7 7 7 7'} fill="none" stroke={colors.navy} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>
    : <Text style={s.backArrow}>🏠</Text>}<Text style={s.backText}>{buttonLabel}</Text></Pressable><Text style={s.headerTitle}>{title}</Text><View style={s.headerRight}>{right}</View></View>;
}
export function BigButton({label,emoji,onPress,color=colors.yellow,small=false,attention=false}: {label:string;emoji?:string;onPress:()=>void;color?:string;small?:boolean;attention?:boolean}) {
  const button = <Pressable accessibilityRole="button" onPress={()=>{playUiSound('pop');onPress();}} style={({pressed})=>[s.button,{backgroundColor:color,minHeight:small?50:64,transform:[{scale:pressed?0.97:1}]}]}><Text style={s.buttonText}>{emoji?`${emoji}  `:''}{label}</Text></Pressable>;
  return attention ? <AttentionPulse>{button}</AttentionPulse> : button;
}
function AttentionPulse({children}:React.PropsWithChildren) {
  const scale = useSharedValue(1);
  useEffect(() => {
    const beat = withRepeat(withSequence(
      withTiming(1.07,{duration:550,easing:Easing.inOut(Easing.ease)}),
      withTiming(1,{duration:550,easing:Easing.inOut(Easing.ease)}),
    ),-1);
    scale.value = beat;
    return () => cancelAnimation(scale);
  },[scale]);
  const pulseStyle = useAnimatedStyle(() => ({transform:[{scale:scale.value}]}));
  return <Animated.View style={pulseStyle}>{children}</Animated.View>;
}
export function ActivityTile({title,subtitle,emoji,color,onPress,index=0,animalName}: {title:string;subtitle?:string;emoji:string;color:string;onPress:()=>void;index?:number;animalName?:string}) {
  const {width,height}=useWindowDimensions(); const columns=gridColumns(width); const language=useAppStore(state=>state.language); const landscape=width>height;
  return <Animated.View entering={FadeInUp.delay(Math.min(index, 8)*35).duration(240)} exiting={FadeOut.duration(120)} layout={LinearTransition.duration(180)} style={{width:`${100/columns-2}%`,minHeight:landscape?145:width>600?182:148,margin:'1%'}}>
    <Pressable accessibilityRole="button" accessibilityLabel={translateText(title,language)} onPress={()=>{playUiSound('pop');onPress();}} onLongPress={()=>speak(title,true,language)} style={({pressed})=>[s.tile,{backgroundColor:color,flex:1,transform:[{scale:pressed?0.97:1}]}]}>
      <View style={s.tileArt}>{animalName ? <AnimalIllustration name={animalName} emoji={emoji} size={width>600?64:56} /> : <Text style={{fontSize:width>600?56:48}}>{emoji}</Text>}</View><Text style={s.tileTitle}>{title}</Text>{subtitle&&<Text style={s.tileSubtitle}>{subtitle}</Text>}
    </Pressable>
  </Animated.View>;
}
export function SectionTitle({children}:React.PropsWithChildren) {return <Text style={s.section}>{children}</Text>}
export function WrongAnswerMessage({message}: {message:string}) {
  if (!message) return null;
  return <View style={{ width:'100%', padding:14, borderRadius:20, backgroundColor:'#FFE6E3', borderWidth:2, borderColor:'#F6B6AE', alignItems:'center' }}>
    <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={{ fontSize:17, fontWeight:'900', color:'#8B3D36', textAlign:'center' }}>🔁  {message}</Text>
  </View>;
}
export function RewardBanner({onPress}: {onPress?:()=>void}) { const stars=useAppStore(state=>state.stars); return <Pressable onPress={onPress} style={s.reward}><Text style={s.rewardEmoji}>⭐</Text><Animated.View key={stars} entering={BounceIn.duration(260)}><Text style={s.rewardText}>{stars} stars</Text></Animated.View></Pressable> }
export function Pill({label,active,onPress}: {label:string;active?:boolean;onPress?:()=>void}) {return <Pressable onPress={onPress?()=>{playUiSound('pop');onPress();}:undefined} style={[s.pill,active&&s.pillActive]}><Text style={[s.pillText,active&&s.pillActiveText]}>{label}</Text></Pressable>}
export function BottomSheet({visible,onClose,title,children}:React.PropsWithChildren<{visible:boolean;onClose:()=>void;title:string}>) {
  const language = useAppStore(state=>state.language);
  const insets = useSafeAreaInsets();
  return <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
    <View style={s.sheetRoot} accessibilityViewIsModal>
      <Pressable accessibilityRole="button" accessibilityLabel={translateText('Close',language)} onPress={onClose} style={s.sheetBackdrop}/>
      <View style={[s.sheetPanel,{direction:isRTL(language)?'rtl':'ltr',paddingBottom:24+insets.bottom}]}>
        <View style={s.sheetHandle}/>
        <View style={s.sheetHeader}><Text style={s.sheetTitle}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel={translateText('Close',language)} onPress={onClose} style={s.sheetClose}><Text style={s.sheetCloseText}>✕</Text></Pressable></View>
        {children}
      </View>
    </View>
  </Modal>;
}
export function LanguageSwitcher() {
  const { language, patch } = useAppStore();
  const [open,setOpen] = React.useState(false);
  const locales = useLocales();
  const regionCode = locales[0]?.regionCode ?? locales[0]?.languageRegionCode;
  const languageOptions = getLanguageOptions(regionCode);
  const urduAvailable = languageOptions.some(option => option.code === 'ur');
  const currentLanguage = languageOptions.find(option => option.code === language) ?? languageOptions[0];
  useEffect(() => {
    if (language === 'ur' && !urduAvailable) {
      patch({ language: 'en' });
      setOpen(false);
    }
  }, [language, patch, urduAvailable]);
  return <>
    {languageOptions.length > 1 && <>
      <View style={{ width:'100%', alignItems:'flex-end' }}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${translateText('Language',language)}: ${currentLanguage.nativeLabel}`} accessibilityHint={translateText('Opens language choices',language)} accessibilityState={{ expanded:open }} onPress={()=>setOpen(true)} style={s.languageButton}>
          <Text style={s.languageIcon}>🌐</Text><Text style={s.languageButtonLabel}>{translateText('Language',language)}</Text><Text translate={false} style={s.languageCurrent}>{currentLanguage.nativeLabel}</Text>
          <Svg width={16} height={16} viewBox="0 0 16 16" style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
            <Path d="m4 6 4 4 4-4" fill="none" stroke={colors.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      </View>
      <BottomSheet visible={open} onClose={()=>setOpen(false)} title={translateText('Choose app language',language)}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flexShrink:1}} contentContainerStyle={{ gap:10, paddingBottom:8 }}>
          {languageOptions.map(option => {
            const active = language === option.code;
            return <Pressable key={option.code} accessibilityRole="button" accessibilityState={{ selected:active }} onPress={()=>{patch({ language:option.code });setOpen(false);}} style={[s.languageOption,active&&s.languageOptionActive]}>
              <View style={{flex:1,gap:3}}><Text translate={false} style={s.languageOptionNative}>{option.nativeLabel}</Text><Text style={s.languageOptionEnglish}>{option.label}</Text></View>
              <Text style={s.languageOptionCheck}>{active?'✓':''}</Text>
            </Pressable>;
          })}
        </ScrollView>
      </BottomSheet>
    </>}
  </>;
}
const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.paper},content:{paddingHorizontal:space.md,paddingTop:12,paddingBottom:38,alignItems:'center',width:'100%',alignSelf:'center',maxWidth:1320,gap:14},landscapeContent:{paddingHorizontal:22,paddingTop:5,paddingBottom:12,gap:8},
  sun:{position:'absolute',top:-65,right:-55,width:170,height:170,borderRadius:100,backgroundColor:'#FFF0B4',opacity:.75},cloudA:{position:'absolute',top:100,left:-32,width:110,height:36,borderRadius:30,backgroundColor:'#fff',opacity:.62},cloudB:{position:'absolute',top:250,right:-40,width:125,height:42,borderRadius:30,backgroundColor:'#fff',opacity:.48},
  header:{flexDirection:'row',alignItems:'center',width:'100%',minHeight:64,marginBottom:5},landscapeHeader:{minHeight:48,marginBottom:0},back:{minWidth:88,height:58,paddingHorizontal:12,borderRadius:18,backgroundColor:'#FFF0C5',borderWidth:2,borderColor:'#F4D979',flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',shadowColor:'#7698A8',shadowOpacity:.12,shadowRadius:8,elevation:2},landscapeBack:{height:44,minWidth:80},backArrow:{width:28,height:30,fontSize:23,color:colors.navy,lineHeight:28,fontWeight:'900',textAlign:'center',textAlignVertical:'center',includeFontPadding:false},backText:{fontSize:15,color:colors.navy,lineHeight:20,fontWeight:'900',textAlignVertical:'center',includeFontPadding:false},headerTitle:{flex:1,fontSize:22,fontWeight:'900',color:colors.ink,marginLeft:8},headerRight:{minWidth:44,alignItems:'flex-end'},
  button:{paddingHorizontal:22,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',minWidth:144,shadowColor:'#5E7F8E',shadowOpacity:.16,shadowRadius:9,elevation:3},buttonText:{fontSize:18,fontWeight:'900',color:colors.ink},
  languageButton:{minHeight:48,paddingHorizontal:14,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EDF0',flexDirection:'row',alignItems:'center',gap:8},languageIcon:{fontSize:17},languageButtonLabel:{fontSize:13,fontWeight:'800',color:colors.muted},languageCurrent:{fontSize:14,fontWeight:'900',color:colors.ink},
  sheetRoot:{flex:1,justifyContent:'flex-end'},sheetBackdrop:{...StyleSheet.absoluteFill,backgroundColor:'rgba(20,40,55,0.42)'},sheetPanel:{width:'100%',maxHeight:'78%',paddingHorizontal:22,paddingTop:12,paddingBottom:24,backgroundColor:colors.paper,borderTopLeftRadius:28,borderTopRightRadius:28,gap:16},sheetHandle:{width:42,height:5,borderRadius:4,backgroundColor:'#C5D6DE',alignSelf:'center'},sheetHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sheetTitle:{fontSize:21,fontWeight:'900',color:colors.ink},sheetClose:{width:42,height:42,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},sheetCloseText:{fontSize:18,fontWeight:'900',color:colors.ink},languageOption:{minHeight:68,paddingHorizontal:16,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EDF0',flexDirection:'row',alignItems:'center'},languageOptionActive:{backgroundColor:'#DDF4FF',borderWidth:2,borderColor:'#5AA6C1'},languageOptionNative:{fontSize:18,fontWeight:'900',color:colors.ink},languageOptionEnglish:{fontSize:12,fontWeight:'700',color:colors.muted},languageOptionCheck:{fontSize:22,fontWeight:'900',color:'#23708D',minWidth:24,textAlign:'center'},
  tile:{borderRadius:radius.lg,padding:13,alignItems:'center',justifyContent:'center',margin:'1%',shadowColor:'#6B8D9C',shadowOpacity:.15,shadowRadius:10,elevation:3},tileArt:{flex:1,minHeight:65,alignItems:'center',justifyContent:'center'},tileTitle:{width:'100%',flexShrink:1,fontSize:14,lineHeight:19,fontWeight:'900',color:colors.ink,textAlign:'center'},tileSubtitle:{width:'100%',flexShrink:1,fontSize:10,lineHeight:14,fontWeight:'700',color:'#405E72',marginTop:3,textAlign:'center'},section:{fontSize:19,fontWeight:'900',color:colors.ink,alignSelf:'flex-start',marginTop:9},reward:{flexDirection:'row',backgroundColor:'#fff',paddingHorizontal:14,paddingVertical:8,borderRadius:20,alignItems:'center',gap:6},rewardEmoji:{fontSize:18},rewardText:{fontSize:14,fontWeight:'900',color:colors.ink},pill:{paddingHorizontal:19,paddingVertical:11,borderRadius:20,backgroundColor:'#fff',borderWidth:2,borderColor:'#E6EFF3'},pillActive:{backgroundColor:colors.ink,borderColor:colors.ink},pillText:{fontSize:18,fontWeight:'900',color:colors.ink},pillActiveText:{color:'#fff'},
});
export const uiStyles=s;
