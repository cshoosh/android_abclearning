import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'assets/play-store/abc-friends-landscape-preview.mp4');
const work = join(tmpdir(), 'abc-friends-landscape-preview');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
mkdirSync(work, { recursive: true });

const files = {
  logo: 'assets/play-store/app-icon-512.png',
  badge: 'public/google-play-badge.png',
  home: 'assets/play-store/screenshots/01-home.png',
  letters: 'assets/play-store/screenshots/02-learn-abc.png',
  tracing: 'assets/play-store/screenshots/04-trace-letters-screen.png',
  animals: 'assets/play-store/screenshots/06-animal-friends-screen.png',
  games: 'assets/play-store/screenshots/03-colors-shapes.png',
  lion: 'assets/animals/lion.png',
  heroLion: 'assets/branding/lion-abc-transparent.png',
  rabbit: 'assets/animals/rabbit.png',
  elephant: 'assets/animals/elephant.png',
  bear: 'assets/animals/bear.png',
};
const uri = (name) => `data:image/png;base64,${readFileSync(join(root, files[name])).toString('base64')}`;
const badge = uri('badge');
const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const slides = [
  {
    id: 'welcome', eyebrow: 'ABC FRIENDS  ·  PLAY & LEARN',
    title: ['Meet your new', 'learning crew.'],
    body: ['A joyful ABC adventure for curious', 'little learners.'], screen: 'home',
    characters: [{ key: 'heroLion', size: 540, x: 450, y: 510 }],
    narration: "Hi, little learner! I'm Leo. Ready to explore ABC Friends?",
  },
  {
    id: 'letters', eyebrow: 'LEARN THE ABCS',
    title: ['Every letter', 'has a story.'],
    body: ['See A to Z, hear each sound, and', 'discover a word for every letter.'], screen: 'letters',
    chips: ['A–Z letters', 'Words & sounds'],
    characters: [{ key: 'lion', size: 430, x: 530, y: 565 }],
    narration: 'See letters A to Z, hear each sound, and discover a new word.',
  },
  {
    id: 'trace', eyebrow: 'TRACE AT THEIR OWN PACE',
    title: ['Little fingers.', 'Big progress.'],
    body: ['Practise uppercase and lowercase', 'letters with easy finger tracing.'], screen: 'tracing',
    chips: ['Trace', 'Listen', 'Earn stars'],
    characters: [{ key: 'rabbit', size: 400, x: 570, y: 585 }],
    narration: 'Trace uppercase and lowercase letters with your finger, then earn a star.',
  },
  {
    id: 'friends', eyebrow: 'ANIMAL FRIENDS',
    title: ['Every sound', 'brings a friend.'],
    body: ['Tap an animal to hear its sound,', 'then play, match, and explore.'], screen: 'animals',
    chips: ['Animal sounds', 'Matching games'],
    characters: [
      { key: 'elephant', size: 280, x: 500, y: 655 },
      { key: 'bear', size: 260, x: 735, y: 675 },
      { key: 'rabbit', size: 240, x: 930, y: 685 },
    ],
    narration: 'Meet animal friends, play their sounds, and enjoy colors, shapes, and matching games.',
  },
  {
    id: 'download', eyebrow: 'TAP  ·  TRACE  ·  LISTEN  ·  PLAY',
    title: ['Small moments.', 'Happy discoveries.'],
    body: ['A little learning adventure,', 'ready whenever you are.'], screen: 'games',
    characters: [
      { key: 'lion', size: 255, x: 600, y: 680 },
      { key: 'elephant', size: 250, x: 820, y: 680 },
      { key: 'rabbit', size: 235, x: 1020, y: 695 },
    ], badge: true,
    narration: 'Learn a little every day. Download ABC Friends on Google Play!',
  },
];

function phone(screen) {
  return `<g filter="url(#shadow)">
    <rect x="1260" y="34" width="570" height="1012" rx="70" fill="#19364F"/>
    <rect x="1274" y="49" width="542" height="982" rx="58" fill="#FFFFFF"/>
    <image href="${uri(screen)}" x="1287" y="62" width="516" height="918" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen)"/>
    <rect x="1485" y="991" width="118" height="8" rx="4" fill="#263849" opacity=".62"/>
  </g>`;
}

function svg(slide, index) {
  const title = slide.title.map((line, i) => `<text x="105" y="${300 + i * 94}" class="title">${xml(line)}</text>`).join('');
  const chips = (slide.chips ?? []).map((label, i) => {
    const x = 105 + i * 245;
    const w = label.length > 12 ? 224 : 198;
    return `<g filter="url(#soft)"><rect x="${x}" y="588" width="${w}" height="58" rx="29" fill="#FFFFFF"/><text x="${x + w / 2}" y="625" class="chip" text-anchor="middle">${xml(label)}</text></g>`;
  }).join('');
  const body = slide.body.map((line, i) => `<text x="112" y="${495 + i * 48}" class="body">${xml(line)}</text>`).join('');
  const badgeSvg = slide.badge ? `<g filter="url(#soft)"><rect x="105" y="740" width="470" height="164" rx="28" fill="#FFFFFF"/><text x="140" y="782" class="cta">GET ABC FRIENDS ON</text><image href="${badge}" x="130" y="785" width="420" height="108" preserveAspectRatio="xMidYMid meet"/></g>` : '';
  const dots = slides.map((_, i) => `<circle cx="${835 + i * 28}" cy="1000" r="6" fill="${i === index ? '#183B5B' : '#B6CAD7'}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#E8F8FF"/><stop offset=".55" stop-color="#F7FAFF"/><stop offset="1" stop-color="#F5F0FF"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFFFFF" stop-opacity=".82"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".35"/></linearGradient>
  <filter id="shadow" x="-20%" y="-15%" width="140%" height="140%"><feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#183B5B" flood-opacity=".2"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="9" stdDeviation="12" flood-color="#183B5B" flood-opacity=".12"/></filter>
  <clipPath id="screen"><rect x="1287" y="62" width="516" height="918" rx="40"/></clipPath>
  <style>
    .brand{font:800 26px Arial,sans-serif;fill:#183B5B;letter-spacing:.2px}
    .eyebrow{font:800 19px Arial,sans-serif;fill:#52728A;letter-spacing:3px}
    .title{font:900 78px Arial,sans-serif;fill:#183B5B;letter-spacing:-2px}
    .body{font:600 30px Arial,sans-serif;fill:#58768A}
    .chip{font:800 18px Arial,sans-serif;fill:#315A75}
    .cta{font:800 15px Arial,sans-serif;fill:#5F788A;letter-spacing:2px}
  </style>
</defs>
<rect width="1920" height="1080" fill="url(#bg)"/>
<circle cx="1760" cy="45" r="230" fill="#FFF0A8" opacity=".64"/>
<circle cx="85" cy="1000" r="210" fill="#C8F2D5" opacity=".56"/>
<circle cx="1170" cy="1050" r="190" fill="#D5C7FF" opacity=".38"/>
<circle cx="1030" cy="140" r="7" fill="#8FC7E5" opacity=".6"/><circle cx="1112" cy="190" r="10" fill="#FFD84D" opacity=".8"/>
<g filter="url(#soft)"><rect x="96" y="62" width="58" height="58" rx="17" fill="#FFFFFF"/><image href="${uri('logo')}" x="98" y="64" width="54" height="54" preserveAspectRatio="xMidYMid meet"/></g>
<text x="174" y="101" class="brand">ABC Friends</text>
<rect x="101" y="180" width="425" height="42" rx="21" fill="url(#glass)" stroke="#FFFFFF" stroke-opacity=".75"/>
<text x="126" y="208" class="eyebrow">${xml(slide.eyebrow)}</text>
${title}${body}${chips}${badgeSvg}
${phone(slide.screen)}
<rect x="690" y="965" width="475" height="52" rx="26" fill="url(#glass)" stroke="#FFFFFF" stroke-opacity=".76"/>
<text x="928" y="998" text-anchor="middle" style="font:700 16px Arial,sans-serif;fill:#668093">A LITTLE LEARNING ADVENTURE</text>
${dots}
</svg>`;
}

function run(cmd, args) { execFileSync(cmd, args, { stdio: 'inherit' }); }

function renderScene(slide, index) {
  const svgPath = join(work, `${slide.id}.svg`);
  const platePath = join(work, `${slide.id}.png`);
  writeFileSync(svgPath, svg(slide, index));
  run(chrome, ['--headless', '--disable-gpu', `--screenshot=${platePath}`, '--window-size=1920,1080', `file://${svgPath}`]);

  const duration = 5.6;
  const videoPath = join(work, `${slide.id}.mp4`);
  const inputs = ['-y', '-loop', '1', '-framerate', '30', '-t', String(duration), '-i', platePath];
  for (const character of slide.characters) {
    inputs.push('-loop', '1', '-framerate', '30', '-t', String(duration), '-i', join(root, files[character.key]));
  }
  const graphs = [
    `[0:v]zoompan=z='min(1.035,1+on*0.0002)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,setsar=1,format=rgba[bg]`,
  ];
  let previous = 'bg';
  slide.characters.forEach((character, i) => {
    const inputNo = i + 1;
    const scaled = `c${i}`;
    const composed = `v${i}`;
    const size = character.size;
    const settle = character.x;
    const start = settle + (i % 2 === 0 ? 180 : -180);
    const endY = character.y;
    graphs.push(`[${inputNo}:v]scale=${size}:${size}:force_original_aspect_ratio=decrease,format=rgba[${scaled}]`);
    const x = `if(lt(t\\,0.65)\\,${start}+(${settle}-${start})*(0.5-0.5*cos(PI*t/0.65))\\,${settle}+7*sin(2*PI*(t-0.65)/2.7))`;
    const y = `${endY}+10*sin(2*PI*t/2.4+${i * 0.8})`;
    graphs.push(`[${previous}][${scaled}]overlay=x='${x}':y='${y}':shortest=1:format=auto[${composed}]`);
    previous = composed;
  });
  graphs.push(`[${previous}]format=yuv420p[outv]`);
  inputs.push('-filter_complex', graphs.join(';'), '-map', '[outv]', '-t', String(duration), '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', videoPath);
  run('ffmpeg', inputs);
  return videoPath;
}

const clips = slides.map(renderScene);
const narration = slides.map((slide) => slide.narration).join('  ');
const narrationFile = join(work, 'narration.aiff');
run('say', ['-v', 'Samantha', '-r', '170', '-o', narrationFile, narration]);

const ff = ['-y'];
for (const clip of clips) ff.push('-i', clip);
ff.push('-stream_loop', '-1', '-i', join(root, 'assets/music/abc-friends-gentle-loop.mp3'), '-i', narrationFile);
const xfadeOffsets = [5.25, 10.5, 15.75, 21.0];
const graph = [
  ...clips.map((_, i) => `[${i}:v]settb=AVTB,fps=30,setpts=PTS-STARTPTS[v${i}]`),
  `[v0][v1]xfade=transition=fade:duration=0.35:offset=${xfadeOffsets[0]}[x1]`,
  `[x1][v2]xfade=transition=fade:duration=0.35:offset=${xfadeOffsets[1]}[x2]`,
  `[x2][v3]xfade=transition=fade:duration=0.35:offset=${xfadeOffsets[2]}[x3]`,
  `[x3][v4]xfade=transition=fade:duration=0.35:offset=${xfadeOffsets[3]},format=yuv420p[v]`,
  '[5:a]volume=0.16,afade=t=in:st=0:d=0.7,afade=t=out:st=26.4:d=1.1[music]',
  '[6:a]volume=1.18,afade=t=out:st=24.8:d=0.55[voice]',
  '[music][voice]amix=inputs=2:duration=longest:dropout_transition=1,alimiter=limit=0.92[a]',
].join(';');
ff.push('-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-t', '26.6', '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-metadata', 'title=ABC Friends — A Little Learning Adventure', '-metadata', 'artist=ABC Friends', output);
run('ffmpeg', ff);
console.log(output);
