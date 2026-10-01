export type TracePoint = { x: number; y: number; strokeStart?: boolean };

export const TRACE_GRID_SIZE = 64;
// Leave room for imperfect preschool strokes while requiring most of the
// letter's centerline to be followed.
export const TRACE_FILL_THRESHOLD = 0.78;

/** Decode one hex row per glyph pixel row into the 64×64 target mask. */
export function decodeTraceMask(encoded: string): Uint8Array {
  const expectedLength = TRACE_GRID_SIZE * (TRACE_GRID_SIZE / 4);
  if (encoded.length !== expectedLength) {
    throw new Error(`Invalid trace mask: expected ${expectedLength} hex characters, received ${encoded.length}`);
  }

  const mask = new Uint8Array(TRACE_GRID_SIZE * TRACE_GRID_SIZE);
  for (let y = 0; y < TRACE_GRID_SIZE; y += 1) {
    for (let group = 0; group < TRACE_GRID_SIZE / 4; group += 1) {
      const nibble = Number.parseInt(encoded[y * (TRACE_GRID_SIZE / 4) + group], 16);
      for (let bit = 0; bit < 4; bit += 1) {
        mask[y * TRACE_GRID_SIZE + group * 4 + bit] = (nibble >> (3 - bit)) & 1;
      }
    }
  }
  return mask;
}

/** Reduce a filled letter to its centerline so tracing is scored as a path, not as coloring. */
export function thinTraceMask(mask: Uint8Array): Uint8Array {
  const skeleton = new Uint8Array(mask.length);
  for (let index = 0; index < mask.length; index += 1) skeleton[index] = mask[index] ? 1 : 0;

  let changed = true;
  while (changed) {
    changed = false;
    for (let phase = 0; phase < 2; phase += 1) {
      const remove: number[] = [];
      for (let y = 1; y < TRACE_GRID_SIZE - 1; y += 1) {
        for (let x = 1; x < TRACE_GRID_SIZE - 1; x += 1) {
          const index = y * TRACE_GRID_SIZE + x;
          if (!skeleton[index]) continue;
          const neighbors = [
            skeleton[index - TRACE_GRID_SIZE],
            skeleton[index - TRACE_GRID_SIZE + 1],
            skeleton[index + 1],
            skeleton[index + TRACE_GRID_SIZE + 1],
            skeleton[index + TRACE_GRID_SIZE],
            skeleton[index + TRACE_GRID_SIZE - 1],
            skeleton[index - 1],
            skeleton[index - TRACE_GRID_SIZE - 1],
          ];
          const neighborCount = neighbors.reduce((sum, value) => sum + value, 0);
          if (neighborCount < 2 || neighborCount > 6) continue;
          let transitions = 0;
          for (let neighbor = 0; neighbor < neighbors.length; neighbor += 1) {
            if (!neighbors[neighbor] && neighbors[(neighbor + 1) % neighbors.length]) transitions += 1;
          }
          if (transitions !== 1) continue;

          const north = neighbors[0];
          const east = neighbors[2];
          const south = neighbors[4];
          const west = neighbors[6];
          const preservesConnectedStroke = phase === 0
            ? north * east * south === 0 && east * south * west === 0
            : north * east * west === 0 && north * south * west === 0;
          if (preservesConnectedStroke) remove.push(index);
        }
      }
      if (remove.length) {
        changed = true;
        for (const index of remove) skeleton[index] = 0;
      }
    }
  }
  return skeleton;
}

/** Add the finger's brush footprint to target glyph cells it actually covers. */
export function paintTraceCoverage(
  mask: Uint8Array,
  painted: Uint8Array,
  point: TracePoint,
  boardWidth: number,
  boardHeight: number,
  glyphSize: number,
  brushRadius: number,
): boolean {
  const left = (boardWidth - glyphSize) / 2;
  const top = (boardHeight - glyphSize) / 2;
  const gridX = ((point.x - left) / glyphSize) * TRACE_GRID_SIZE;
  const gridY = ((point.y - top) / glyphSize) * TRACE_GRID_SIZE;
  const radius = (brushRadius / glyphSize) * TRACE_GRID_SIZE;
  const minX = Math.max(0, Math.floor(gridX - radius));
  const maxX = Math.min(TRACE_GRID_SIZE - 1, Math.ceil(gridX + radius));
  const minY = Math.max(0, Math.floor(gridY - radius));
  const maxY = Math.min(TRACE_GRID_SIZE - 1, Math.ceil(gridY + radius));
  const radiusSquared = radius * radius;
  let changed = false;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const offset = y * TRACE_GRID_SIZE + x;
      const dx = x + 0.5 - gridX;
      const dy = y + 0.5 - gridY;
      if (mask[offset] && !painted[offset] && dx * dx + dy * dy <= radiusSquared) {
        painted[offset] = 1;
        changed = true;
      }
    }
  }
  return changed;
}

/** Fill gaps between touch events so fast, correct strokes count continuously. */
export function paintTraceSegmentCoverage(
  mask: Uint8Array,
  painted: Uint8Array,
  from: TracePoint,
  to: TracePoint,
  boardWidth: number,
  boardHeight: number,
  glyphSize: number,
  brushRadius: number,
): boolean {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / Math.max(1, brushRadius * 0.45)));
  let changed = false;
  for (let step = 1; step <= steps; step += 1) {
    const ratio = step / steps;
    changed = paintTraceCoverage(mask, painted, {
      x: from.x + (to.x - from.x) * ratio,
      y: from.y + (to.y - from.y) * ratio,
    }, boardWidth, boardHeight, glyphSize, brushRadius) || changed;
  }
  return changed;
}

export function getTraceFill(mask: Uint8Array, painted: Uint8Array): number {
  let targetCells = 0;
  let filledCells = 0;
  for (let index = 0; index < mask.length; index += 1) {
    if (mask[index]) {
      targetCells += 1;
      if (painted[index]) filledCells += 1;
    }
  }
  return targetCells === 0 ? 0 : filledCells / targetCells;
}

/** Build a vector clip from the same target cells used for completion scoring. */
export function traceMaskToSvgPath(mask: Uint8Array): string {
  const path: string[] = [];
  for (let y = 0; y < TRACE_GRID_SIZE; y += 1) {
    let x = 0;
    while (x < TRACE_GRID_SIZE) {
      while (x < TRACE_GRID_SIZE && !mask[y * TRACE_GRID_SIZE + x]) x += 1;
      const start = x;
      while (x < TRACE_GRID_SIZE && mask[y * TRACE_GRID_SIZE + x]) x += 1;
      if (start < x) path.push(`M${start} ${y}h${x - start}v1h-${x - start}z`);
    }
  }
  return path.join('');
}

export function isTraceFillComplete(fill: number): boolean {
  return fill >= TRACE_FILL_THRESHOLD;
}

/** Retained for callers using the original helper contract; the tracing screen uses glyph fill instead. */
export function isTraceComplete(
  points: readonly TracePoint[],
  minimumTravel: number,
  minimumSamples = 20,
): boolean {
  if (points.length < minimumSamples) return false;

  let travel = 0;
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
    if (index > 0 && !point.strokeStart) {
      const previous = points[index - 1];
      travel += Math.hypot(point.x - previous.x, point.y - previous.y);
    }
  }

  const longestSpan = Math.max(maxX - minX, maxY - minY);
  return travel >= minimumTravel && longestSpan >= minimumTravel * 0.55;
}
