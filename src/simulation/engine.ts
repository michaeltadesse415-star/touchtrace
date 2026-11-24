import type { FingerPosition, SensorFrame } from "./types";

const BASELINE = 1;

interface ScanOptions {
  columns?: number;
  rows?: number;
  finger?: FingerPosition | null;
  fingers?: FingerPosition[];
  noise: number;
  strength: number;
  spread: number;
  seed?: number;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function validateOptions(options: ScanOptions, fingers: FingerPosition[]) {
  const { columns = 16, rows = 10, noise, strength, spread, seed } = options;

  if (!Number.isInteger(columns) || columns < 1) {
    throw new RangeError("columns must be a positive integer");
  }

  if (!Number.isInteger(rows) || rows < 1) {
    throw new RangeError("rows must be a positive integer");
  }

  if (!Number.isFinite(noise) || noise < 0) {
    throw new RangeError("noise must be a finite, non-negative number");
  }

  if (!Number.isFinite(strength) || strength < 0 || strength > 1) {
    throw new RangeError("strength must be between 0 and 1");
  }

  if (!Number.isFinite(spread) || spread <= 0) {
    throw new RangeError("spread must be greater than zero");
  }

  if (seed !== undefined && !Number.isFinite(seed)) {
    throw new RangeError("seed must be a finite number");
  }

  if (!Array.isArray(fingers)) {
    throw new TypeError("fingers must be an array");
  }

  for (const finger of fingers) {
    if (!Number.isFinite(finger.x) || !Number.isFinite(finger.y)) {
      throw new RangeError("finger coordinates must be finite numbers");
    }
  }
}

export function scanSensor({
  columns = 16,
  rows = 10,
  finger = null,
  fingers: suppliedFingers,
  noise = 0.02,
  strength = 0.42,
  spread = 1.35,
  seed,
}: ScanOptions): SensorFrame {
  const fingers = suppliedFingers ?? (finger ? [finger] : []);

  validateOptions(
    { columns, rows, noise, strength, spread, seed },
    fingers,
  );

  const random = seed === undefined
    ? Math.random
    : createSeededRandom(seed);

  const cells = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let idealAttenuation = 0;

      for (const activeFinger of fingers) {
        const dx = x - activeFinger.x;
        const dy = y - activeFinger.y;
        const distanceSquared = dx * dx + dy * dy;

        idealAttenuation +=
          strength *
          Math.exp(-distanceSquared / (2 * spread * spread));
      }

      // Combined response is capped at the normalized maximum.
      idealAttenuation = Math.min(1, idealAttenuation);

      const noiseSample =
        noise === 0 ? 0 : (random() * 2 - 1) * noise;

      const measured =
        BASELINE - idealAttenuation + noiseSample;

      const delta = BASELINE - measured;

      cells.push({
        x,
        y,
        idealAttenuation,
        noise: noiseSample,
        measured,
        delta,
      });
    }
  }

  return { columns, rows, cells };
}
