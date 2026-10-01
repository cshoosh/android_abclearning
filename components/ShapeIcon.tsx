import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

type ShapeName = 'Circle' | 'Square' | 'Triangle' | 'Star' | 'Rectangle' | 'Heart';

type ShapeIconProps = {
  name: string;
  size: number;
};

const fill = '#68469D';
const outline = '#FFFFFF';

export function ShapeIcon({ name, size }: ShapeIconProps) {
  const common = { fill, stroke: outline, strokeWidth: 5, strokeLinejoin: 'round' as const };

  let shape: React.ReactNode;
  switch (name as ShapeName) {
    case 'Circle':
      shape = <Circle cx="56" cy="44" r="29" {...common} />;
      break;
    case 'Square':
      shape = <Rect x="28" y="16" width="56" height="56" rx="5" {...common} />;
      break;
    case 'Triangle':
      shape = <Polygon points="56,12 92,73 20,73" {...common} />;
      break;
    case 'Star':
      shape = <Polygon points="56,8 68,33 95,36 75,54 80,80 56,67 32,80 37,54 17,36 44,33" {...common} />;
      break;
    case 'Rectangle':
      shape = <Rect x="16" y="27" width="80" height="34" rx="5" {...common} />;
      break;
    case 'Heart':
      shape = <Path d="M56 77 21 44C2 22 28 5 45 20L56 30 67 20C84 5 110 22 91 44Z" {...common} />;
      break;
    default:
      return null;
  }

  return <Svg width={size} height={size * 0.8} viewBox="0 0 112 88" accessibilityElementsHidden>{shape}</Svg>;
}
