import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Image, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../components/AppText';
import { BigButton, Header, Pill, Screen } from '../components/ui';
import { getLearningLetters, getSpokenLearningWord, getSpokenLetterName } from '../data/learningLetters';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { colors } from '../theme/tokens';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { decodeTraceMask, getTraceFill, isTraceFillComplete, paintTraceCoverage, paintTraceSegmentCoverage, thinTraceMask, traceMaskToSvgPath, TRACE_FILL_THRESHOLD, TRACE_GRID_SIZE, type TracePoint } from '../domain/tracing';
import { traceGlyphAssets, type TraceGlyphKey } from '../domain/tracingGlyphs';
import { traceGlyphMasks } from '../domain/tracingGlyphMasks';

export default function Tracing() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const [index, setIndex] = useState(0);
  const [lower, setLower] = useState(false);
  const [marks, setMarks] = useState<TracePoint[]>([]);
  const [done, setDone] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const pointsRef = useRef<TracePoint[]>([]);
  const paintedRef = useRef(new Uint8Array(64 * 64));
  const doneRef = useRef(false);
  const state = useAppStore();
  const alphabet = getLearningLetters(state.language);
  const item = alphabet[index];
  const locked = !state.premium && index > 2;
  const letter = lower ? item.lower : item.upper;
  const boardHeight = landscape ? Math.max(205, Math.min(320, height - 115)) : 350;
  const baseLetterSize = landscape ? Math.min(190, height * 0.53) : 220;
  // Lowercase letters use x-height, so render and score them at the same
  // smaller size instead of stretching them to uppercase height.
  const letterSize = baseLetterSize * (lower ? 0.72 : 1);
  const glyphKey: TraceGlyphKey = state.language === 'ur'
    ? `ur:u${letter.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`
    : `${lower ? 'lower' : 'upper'}:${letter}`;
  const glyphMask = useMemo(() => decodeTraceMask(traceGlyphMasks[glyphKey]), [glyphKey]);
  const glyphTraceMask = useMemo(() => thinTraceMask(glyphMask), [glyphMask]);
  const glyphClipPath = useMemo(() => traceMaskToSvgPath(glyphMask), [glyphMask]);
  const tracePath = marks.map((point, pointIndex) => `${pointIndex === 0 || point.strokeStart ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const progressPercent = Math.min(100, Math.round((fillProgress / TRACE_FILL_THRESHOLD) * 100));
  const casePicker = state.language === 'en' && <View style={{ flexDirection: 'row', gap: 10 }}>
    <Pill label="ABC" active={!lower} onPress={() => selectCase(false)} />
    <Pill label="abc" active={lower} onPress={() => selectCase(true)} />
  </View>;
  const prompt = <Text style={{ fontSize: 15, fontWeight: '800', color: '#607989', textAlign: 'center' }}>
    {done ? 'You earned a star! Trace the next letter.' : `Trace the ${lower ? 'small' : 'big'} letter with your finger to earn a star!`}
  </Text>;
  const instructions = <View style={{ width: '100%', alignItems: 'center', gap: 6 }}>
    <Text style={{ fontSize: 13, color: '#607989', fontWeight: '700', textAlign: 'center' }}>
      Trace the letter to fill it in!
    </Text>
    <View style={{ width: '100%', maxWidth: 360, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 12, color: '#607989', fontWeight: '800' }}>Trace progress</Text>
      <Text style={{ fontSize: 12, color: done ? '#398A55' : '#607989', fontWeight: '900' }}>{progressPercent}%</Text>
    </View>
    <View style={{ width: '100%', maxWidth: 360, height: 10, borderRadius: 6, overflow: 'hidden', backgroundColor: '#DFEFF4' }}>
      <View style={{ width: `${progressPercent}%`, height: '100%', borderRadius: 6, backgroundColor: done ? '#70CC91' : '#FFB84E' }} />
    </View>
  </View>;
  const actions = <>
    <View style={{ width: '100%', flexDirection: landscape ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <BigButton small={landscape} label="Clear" emoji="↻" color="#DFF3FC" onPress={clearTrace} />
      <BigButton small={landscape} label="Next" emoji="➡️" color={colors.yellow} attention onPress={nextLetter} />
    </View>
    <BigButton small={landscape} label={state.language === 'ur' ? `حرف ${getSpokenLetterName(item, state.language)} سنیں` : `Hear ${item.upper}`} emoji="🔊" color={colors.green} onPress={() => speak(`${getSpokenLetterName(item, state.language)}. ${getSpokenLearningWord(item.word, state.language)}.`, state.voice, state.language)} />
  </>;
  const board = <View
    onLayout={event => setBoardSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
    onStartShouldSetResponder={() => true}
    onMoveShouldSetResponder={() => true}
    onResponderTerminationRequest={() => false}
    onResponderGrant={event => mark(event, true)}
    onResponderMove={mark}
    style={{ width: '100%', height: boardHeight, borderRadius: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#DFEFF4' }}
  >
    <View pointerEvents="none" style={{ position: 'absolute', width: letterSize, height: letterSize }}>
      <Image key={glyphKey} source={traceGlyphAssets[glyphKey]} resizeMode="contain" style={{ width: '100%', height: '100%', tintColor: done ? '#70CC91' : undefined }} />
    </View>
    <View pointerEvents="none" style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Svg key={glyphKey} width="100%" height="100%" viewBox={`0 0 ${Math.max(1, boardSize.width)} ${Math.max(1, boardSize.height)}`}>
        <Defs>
          <ClipPath id="traceGlyphClip">
            <G transform={`matrix(${letterSize / TRACE_GRID_SIZE},0,0,${letterSize / TRACE_GRID_SIZE},${(boardSize.width - letterSize) / 2},${(boardSize.height - letterSize) / 2})`}>
              <Path d={glyphClipPath} />
            </G>
          </ClipPath>
        </Defs>
        {!done && <Path d={tracePath} fill="none" stroke="#FFB84E" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#traceGlyphClip)" />}
      </Svg>
    </View>
    {done && <Text pointerEvents="none" style={{ position: 'absolute', top: 18, fontSize: 34 }}>✨</Text>}
  </View>;

  function mark(event: GestureResponderEvent, strokeStart = false) {
    if (doneRef.current) return;
    const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY, strokeStart };
    if (!boardSize.width || !boardSize.height) return;
    const previous = pointsRef.current[pointsRef.current.length - 1];
    const next = [...pointsRef.current, point];
    pointsRef.current = next;
    setMarks(next);

    const changed = previous && !strokeStart
      ? paintTraceSegmentCoverage(glyphTraceMask, paintedRef.current, previous, point, boardSize.width, boardSize.height, letterSize, 8)
      : paintTraceCoverage(glyphTraceMask, paintedRef.current, point, boardSize.width, boardSize.height, letterSize, 8);
    if (!changed) return;
    const fill = getTraceFill(glyphTraceMask, paintedRef.current);
    setFillProgress(fill);
    if (isTraceFillComplete(fill)) {
      doneRef.current = true;
      setDone(true);
      state.reward('trace', state.language === 'ur' ? `ur:${item.upper}` : item.upper);
      speak('Wonderful tracing!', state.voice, state.language);
    }
  }

  function clearTrace() {
    pointsRef.current = [];
    paintedRef.current = new Uint8Array(64 * 64);
    doneRef.current = false;
    setMarks([]);
    setDone(false);
    setFillProgress(0);
  }

  function nextLetter() {
    setIndex(current => (current + 1) % alphabet.length);
    clearTrace();
  }

  function selectCase(value: boolean) {
    setLower(value);
    clearTrace();
  }

  return <Screen>
    <Header
      title="Trace a Letter"
      right={<Text style={{ fontSize: 14, fontWeight: '900', color: colors.ink }}>{index + 1}/{alphabet.length}  ·  ⭐ {state.stars}</Text>}
    />
    {locked
      ? <View style={{ height: 330, width: '100%', backgroundColor: '#FFF1C7', borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <Text style={{ fontSize: 70 }}>🔒</Text>
        <BigButton label="Ask a grown-up" onPress={() => router.push('/parent-gate')} />
      </View>
      : landscape
        ? <View style={{ width: '100%', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', gap: 14 }}>
          <View style={{ width: '29%', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {casePicker}
            {prompt}
            {instructions}
            <View style={{ width: '100%', alignItems: 'center', gap: 8 }}>{actions}</View>
          </View>
          <View style={{ width: '69%' }}>{board}</View>
        </View>
        : <>
          {casePicker}
          {prompt}
          {board}
          {instructions}
          {actions}
        </>}
  </Screen>;
}
