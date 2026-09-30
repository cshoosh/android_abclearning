import React from 'react';
import Svg,{Circle,Ellipse,Path} from 'react-native-svg';

export function LionMascot({size=118}:{size?:number}){return <Svg width={size} height={size} viewBox="0 0 140 140" accessibilityLabel="A friendly lion mascot">
  <Circle cx="70" cy="70" r="61" fill="#F4A340"/>
  <Circle cx="70" cy="70" r="49" fill="#FFD978"/>
  <Ellipse cx="47" cy="49" rx="13" ry="17" fill="#FFD978"/><Ellipse cx="93" cy="49" rx="13" ry="17" fill="#FFD978"/>
  <Ellipse cx="47" cy="51" rx="6" ry="9" fill="#EC8A5B"/><Ellipse cx="93" cy="51" rx="6" ry="9" fill="#EC8A5B"/>
  <Ellipse cx="54" cy="69" rx="4" ry="6" fill="#28415A"/><Ellipse cx="86" cy="69" rx="4" ry="6" fill="#28415A"/>
  <Circle cx="70" cy="83" r="20" fill="#FFF0C7"/><Circle cx="70" cy="78" r="6" fill="#744A41"/>
  <Path d="M70 83c-3 8-11 8-15 3M70 83c3 8 11 8 15 3" fill="none" stroke="#744A41" strokeWidth="3.5" strokeLinecap="round"/>
  <Ellipse cx="39" cy="82" rx="10" ry="6" fill="#F49B8E" opacity=".72"/><Ellipse cx="101" cy="82" rx="10" ry="6" fill="#F49B8E" opacity=".72"/>
  <Path d="M37 108c12 11 54 11 66 0" fill="none" stroke="#D78536" strokeWidth="4" strokeLinecap="round"/>
  <Path d="M103 28l7-10M112 40l12-6M31 32l-5-10" fill="none" stroke="#FFF1B9" strokeWidth="4" strokeLinecap="round"/>
</Svg>}
