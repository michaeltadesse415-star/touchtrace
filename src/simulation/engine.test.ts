
import { describe, expect, it } from "vitest";
import { scanSensor } from "./engine";

describe("scanSensor", () => {
  it("creates the requested sensor dimensions", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: null,
      noise: 0,
      strength: 0.42,
      spread: 1.35,
    });

    expect(frame.columns).toBe(16);
    expect(frame.rows).toBe(10);
    expect(frame.cells).toHaveLength(160);
  });

  it("produces no ideal touch signal when no finger is present", () => {
    const frame = scanSensor({
      finger: null,
      noise: 0,
      strength: 0.42,
      spread: 1.35,
      seed: 42,
    });

    for (const cell of frame.cells) {
      expect(cell.idealAttenuation).toBe(0);
      expect(cell.noise).toBe(0);
      expect(cell.measured).toBe(1);
      expect(cell.delta).toBe(0);
    }
  });

  it("produces maximum ideal attenuation at the finger position", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 8, y: 5 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
    });

    const center = frame.cells.find(
      (cell) => cell.x === 8 && cell.y === 5,
    );

    expect(center).toBeDefined();
    expect(center!.idealAttenuation).toBeCloseTo(0.42);
  });

  it("produces a weaker ideal signal farther from the finger", () => {
    const frame = scanSensor({
      columns: 16,
      rows: 10,
      finger: { x: 8, y: 5 },
      noise: 0,
      strength: 0.42,
      spread: 1.35,
    });

    const center = frame.cells.find(
      (cell) => cell.x === 8 && cell.y === 5,
    )!;

    const nearby = frame.cells.find(
      (cell) => cell.x === 9 && cell.y === 5,
    )!;

    const distant = frame.cells.find(
      (cell) => cell.x === 13 && cell.y === 5,
    )!;

    expect(center.idealAttenuation).toBeGreaterThan(
      nearby.idealAttenuation,
    );

    expect(nearby.idealAttenuation).toBeGreaterThan(
      distant.idealAttenuation,
    );
  });

  it("produces identical measurements for identical seeds", () => {
    const options = {
      finger: { x: 8, y: 5 },
      noise: 0.05,
      strength: 0.42,
      spread: 1.35,
      seed: 42,
    };

    const first = scanSensor(options);
    const second = scanSensor(options);

    expect(first).toEqual(second);
  });

  it("produces different noise patterns for different seeds", () => {
    const first = scanSensor({
      finger: null,
      noise: 0.05,
      strength: 0.42,
      spread: 1.35,
      seed: 42,
    });

    const second = scanSensor({
      finger: null,
      noise: 0.05,
      strength: 0.42,
      spread: 1.35,
      seed: 99,
    });

    expect(first.cells.map((cell) => cell.noise)).not.toEqual(
      second.cells.map((cell) => cell.noise),
    );
  });

  it("rejects invalid sensor dimensions", () => {
    expect(() =>
      scanSensor({
        columns: 0,
        finger: null,
        noise: 0,
        strength: 0.42,
        spread: 1.35,
      }),
    ).toThrow(RangeError);
  });

  it("rejects negative noise", () => {
    expect(() =>
      scanSensor({
        finger: null,
        noise: -0.1,
        strength: 0.42,
        spread: 1.35,
      }),
    ).toThrow(RangeError);
  });

  it("rejects invalid strength", () => {
    expect(() =>
      scanSensor({
        finger: null,
        noise: 0,
        strength: 1.5,
        spread: 1.35,
      }),
    ).toThrow(RangeError);
  });

  it("rejects invalid spread", () => {
    expect(() =>
      scanSensor({
        finger: null,
        noise: 0,
        strength: 0.42,
        spread: 0,
      }),
    ).toThrow(RangeError);
  });
});
