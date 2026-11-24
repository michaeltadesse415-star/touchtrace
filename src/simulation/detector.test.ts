
import { describe, expect, it } from "vitest";
import { scanSensor } from "./engine";
import { detectTouches } from "./detector";

describe("detectTouches", () => {
  it("does not detect a touch when no finger is present", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: null,
      noise: 0,
      strength: 0.42,
      spread: 1.35,
});

    const result = detectTouches(frame);

    expect(result.detected).toBe(false);
    expect(result.touches).toHaveLength(0);
  });

  it("detects a finger at its approximate position", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 7, y: 4 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
});

    const result = detectTouches(frame);

    expect(result.detected).toBe(true);
    expect(result.touches).toHaveLength(1);
    expect(result.touches[0].x).toBeCloseTo(7, 0);
    expect(result.touches[0].y).toBeCloseTo(4, 0);
  });

  it("detects fewer active cells with a higher threshold", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 7, y: 4 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
});

    const lowThreshold = detectTouches(frame, 0.05);
    const highThreshold = detectTouches(frame, 0.25);

    expect(lowThreshold.touches[0].activeCells).toBeGreaterThan(
      highThreshold.touches[0].activeCells,
    );
  });

  it("rejects a touch when the threshold is too high", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 7, y: 4 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
});

    const result = detectTouches(frame, 1);

    expect(result.detected).toBe(false);
    expect(result.touches).toHaveLength(0);
  });

  it("returns a positive measured signal strength", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 7, y: 4 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
});

    const result = detectTouches(frame);

    expect(result.touches[0].signalStrength).toBeGreaterThan(0);
  });

  it("rejects noise-only measurements with a noise-aware threshold", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: null,
      noise: 0.2,
      strength: 0.42,
      spread: 1.35,
      seed: 42,
    });

    const result = detectTouches(frame, 0.16, 0.2);

    expect(result.detected).toBe(false);
    expect(result.touches).toHaveLength(0);
  });

});
