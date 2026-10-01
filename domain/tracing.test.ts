import { isTraceComplete, type TracePoint } from './tracing';

function line(points: number, length: number): TracePoint[] {
  return Array.from({ length: points }, (_, index) => ({
    x: 20,
    y: (index / (points - 1)) * length,
  }));
}

describe('isTraceComplete', () => {
  it('does not complete after a few taps', () => {
    expect(isTraceComplete(line(14, 180), 90)).toBe(false);
  });

  it('does not complete after many tiny marks in one spot', () => {
    const taps = Array.from({ length: 30 }, () => ({ x: 20, y: 20 }));
    expect(isTraceComplete(taps, 90)).toBe(false);
  });

  it('completes after a sufficiently long traced stroke', () => {
    expect(isTraceComplete(line(24, 120), 90)).toBe(true);
  });
});
