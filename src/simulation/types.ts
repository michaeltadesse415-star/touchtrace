
export interface FingerPosition {
  x: number;
  y: number;
}

export interface SensorCell {
  x: number;
  y: number;

  // Ideal touch-induced signal, known only to our simulator.
  idealAttenuation: number;

  // Injected random measurement error.
  noise: number;

  // Simulated electrical measurement.
  measured: number;

  // Observed deviation from the baseline, including noise.
  delta: number;
}

export interface SensorFrame {
  columns: number;
  rows: number;
  cells: SensorCell[];
}

export interface DetectedTouch {
  x: number;
  y: number;
  signalStrength: number;
  activeCells: number;
}

export interface DetectionResult {
  detected: boolean;
  touches: DetectedTouch[];
  x: number | null;
  y: number | null;
}