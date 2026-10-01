import React from 'react';
import { Text as NativeText, TextProps as NativeTextProps } from 'react-native';
import { isRTL, translateText, type AppLanguage } from '../localization';
import { useAppStore } from '../store/useAppStore';

type AppTextProps = NativeTextProps & { translate?: boolean };

function translateChildren(children: React.ReactNode, language: AppLanguage): React.ReactNode {
  if (typeof children === 'string') return translateText(children, language);
  if (Array.isArray(children)) {
    if (children.every(child => typeof child === 'string' || typeof child === 'number')) {
      return translateText(children.map(String).join(''), language);
    }
    return children.map((child, index) => <React.Fragment key={index}>{translateChildren(child, language)}</React.Fragment>);
  }
  return children;
}

export function Text({ children, style, accessibilityLabel, translate = true, ...props }: AppTextProps) {
  const language = useAppStore(state => state.language);
  const rtl = isRTL(language);
  const translatedLabel = accessibilityLabel && translate ? translateText(accessibilityLabel, language) : accessibilityLabel;

  return (
    <NativeText
      {...props}
      accessibilityLabel={translatedLabel}
      style={[{ writingDirection: rtl ? 'rtl' : 'ltr', textAlign: rtl ? 'right' : 'left' }, style]}
    >
      {translate ? translateChildren(children, language) : children}
    </NativeText>
  );
}
