import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, radius, space } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { gridColumns } from '../domain/access';

export function Screen({children, scroll=true}:React.PropsWithChildren<{scroll?:boolean}>) {
  return <SafeAreaView style={s.screen}><View pointerEvents="none" style={s.sun}/><View pointerEvents="none" style={s.cloudA}/><View pointerEvents="none" style={s.cloudB}/>
    {scroll ? <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>{children}</ScrollView> : <View style={[s.content,{flex:1}]}>{children}</View>}
  </SafeAreaView>;
}
export function Header({title, back=true, right}: {title:string;back?:boolean;right?:React.ReactNode}) {
  return <View style={s.header}><Pressable accessibilityRole="button" accessibilityLabel={back?'Go back':title} onPress={()=>back?router.back():router.replace('/')} style={s.back}><Text style={s.backText}>{back?'‹':'🏠'}</Text></Pressable><Text style={s.headerTitle}>{title}</Text><View style={s.headerRight}>{right}</View></View>;
}
export function BigButton({label,emoji,onPress,color=colors.yellow,small=false}: {label:string;emoji?:string;onPress:()=>void;color?:string;small?:boolean}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[s.button,{backgroundColor:color,minHeight:small?50:64,transform:[{scale:pressed?0.97:1}]}]}><Text style={s.buttonText}>{emoji?`${emoji}  `:''}{label}</Text></Pressable>;
}
export function ActivityTile({title,subtitle,emoji,color,onPress}: {title:string;subtitle?:string;emoji:string;color:string;onPress:()=>void}) {
  const {width}=useWindowDimensions(); const columns=gridColumns(width);
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} onLongPress={()=>speak(title)} style={({pressed})=>[s.tile,{backgroundColor:color,width:`${100/columns-2}%`,minHeight:width>600?182:148,transform:[{scale:pressed?0.97:1}]}]}>
    <View style={s.tileArt}><Text style={{fontSize:width>600?56:48}}>{emoji}</Text></View><Text style={s.tileTitle}>{title}</Text>{subtitle&&<Text style={s.tileSubtitle}>{subtitle}</Text>}
  </Pressable>;
}
export function SectionTitle({children}:React.PropsWithChildren) {return <Text style={s.section}>{children}</Text>}
export function RewardBanner({onPress}: {onPress?:()=>void}) { const stars=useAppStore(state=>state.stars); return <Pressable onPress={onPress} style={s.reward}><Text style={s.rewardEmoji}>⭐</Text><Text style={s.rewardText}>{stars} stars</Text></Pressable> }
export function Pill({label,active,onPress}: {label:string;active?:boolean;onPress?:()=>void}) {return <Pressable onPress={onPress} style={[s.pill,active&&s.pillActive]}><Text style={[s.pillText,active&&s.pillActiveText]}>{label}</Text></Pressable>}
const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.paper},content:{paddingHorizontal:space.md,paddingTop:12,paddingBottom:38,alignItems:'center',width:'100%',alignSelf:'center',maxWidth:1040,gap:14},
  sun:{position:'absolute',top:-65,right:-55,width:170,height:170,borderRadius:100,backgroundColor:'#FFF0B4',opacity:.75},cloudA:{position:'absolute',top:100,left:-32,width:110,height:36,borderRadius:30,backgroundColor:'#fff',opacity:.62},cloudB:{position:'absolute',top:250,right:-40,width:125,height:42,borderRadius:30,backgroundColor:'#fff',opacity:.48},
  header:{flexDirection:'row',alignItems:'center',width:'100%',minHeight:52,marginBottom:5},back:{width:46,height:46,borderRadius:16,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',shadowColor:'#7698A8',shadowOpacity:.12,shadowRadius:8,elevation:2},backText:{fontSize:30,color:colors.navy,lineHeight:34,fontWeight:'700'},headerTitle:{flex:1,fontSize:22,fontWeight:'900',color:colors.ink,marginLeft:12},headerRight:{minWidth:44,alignItems:'flex-end'},
  button:{paddingHorizontal:22,borderRadius:radius.lg,alignItems:'center',justifyContent:'center',minWidth:144,shadowColor:'#5E7F8E',shadowOpacity:.16,shadowRadius:9,elevation:3},buttonText:{fontSize:18,fontWeight:'900',color:colors.ink},
  tile:{borderRadius:radius.lg,padding:13,alignItems:'center',justifyContent:'center',margin:'1%',shadowColor:'#6B8D9C',shadowOpacity:.15,shadowRadius:10,elevation:3},tileArt:{flex:1,minHeight:65,alignItems:'center',justifyContent:'center'},tileTitle:{fontSize:16,fontWeight:'900',color:colors.ink,textAlign:'center'},tileSubtitle:{fontSize:11,fontWeight:'700',color:'#405E72',marginTop:3,textAlign:'center'},section:{fontSize:19,fontWeight:'900',color:colors.ink,alignSelf:'flex-start',marginTop:9},reward:{flexDirection:'row',backgroundColor:'#fff',paddingHorizontal:14,paddingVertical:8,borderRadius:20,alignItems:'center',gap:6},rewardEmoji:{fontSize:18},rewardText:{fontSize:14,fontWeight:'900',color:colors.ink},pill:{paddingHorizontal:19,paddingVertical:11,borderRadius:20,backgroundColor:'#fff',borderWidth:2,borderColor:'#E6EFF3'},pillActive:{backgroundColor:colors.ink,borderColor:colors.ink},pillText:{fontSize:18,fontWeight:'900',color:colors.ink},pillActiveText:{color:'#fff'},
});
export const uiStyles=s;
