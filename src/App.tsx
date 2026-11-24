import { useMemo, useState } from "react";
import {
  Activity,
  Cpu,
  Crosshair,
  Eye,
  EyeOff,
  Gauge,
  Waves,
  Zap,
} from "lucide-react";

import { scanSensor } from "@/simulation/engine";
import { detectTouch } from "@/simulation/detector";
import type { FingerPosition } from "@/simulation/types";

import { SensorGrid } from "@/components/dashboard/sensor-grid";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ExperimentControls } from "@/components/dashboard/experiment-controls";

const COLUMNS = 16;
const ROWS = 10;

export default function App() {
  const [activePointers, setActivePointers] = useState<
    Record<number, FingerPosition>
  >({});
  const [sensitivity, setSensitivity] = useState(0.16);
  const [noise, setNoise] = useState(0.02);
  const [showInternals, setShowInternals] = useState(false);

  const frame = useMemo(
    () =>
      scanSensor({
        columns: COLUMNS,
        rows: ROWS,
        fingers: Object.values(activePointers),
        noise,
        strength: 0.42,
        spread: 1.35,
      }),
    [activePointers, noise],
  );

  const detection = useMemo(
    () => detectTouch(frame, sensitivity, noise),
    [frame, sensitivity],
  );

  const activeCells = detection.touches.reduce(
    (sum, touch) => sum + touch.activeCells,
    0,
  );

  const strongestSignal = Math.max(
    0,
    ...detection.touches.map((touch) => touch.signalStrength),
  );

  function resetExperiment() {
    setActivePointers({});
    setSensitivity(0.16);
    setNoise(0.02);
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#080d17] text-white">
      <div className="mx-auto w-full min-w-0 max-w-[1440px] px-4 py-5 sm:px-5 sm:py-7 md:px-9">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
              <Zap className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-[-0.06em]">
                TOUCH<span className="text-cyan-400">TRACE</span>
              </h1>
              <p className="text-xs tracking-wide text-slate-500">
                Interactive Capacitive Touchscreen Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300">
              Simulation active
            </span>
          </div>
        </header>

        <section className="py-7 sm:py-9">
          <p className="text-xs font-medium tracking-[0.2em] text-cyan-400">
            UNDERSTANDING EVERYDAY TECHNOLOGY
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            How does a touchscreen detect your finger?
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
            A capacitive touchscreen measures changes in electrical coupling
            across a network of electrodes. When a finger approaches the
            surface, it changes the measured signal. The touchscreen
            controller uses these changes to estimate the touch position.
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Touch and move across the display to explore the simulation.
            Select <span className="text-cyan-300">Show internals</span> to
            reveal the sensor measurements. Adjust the controls to see how
            detection threshold and electrical noise affect the result.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="SENSOR ARRAY"
            value={`${COLUMNS} × ${ROWS}`}
            detail={`${COLUMNS * ROWS} simulated intersections`}
            icon={<Cpu size={18} />}
          />

          <MetricCard
            label="TOUCH STATUS"
            value={detection.detected ? "DETECTED" : "NOT DETECTED"}
            detail={
              detection.detected
                ? "Signal exceeds the threshold"
                : "No signal exceeds the threshold"
            }
            icon={<Crosshair size={18} />}
          />

          <MetricCard
            label="ACTIVE CELLS"
            value={String(activeCells)}
            detail="Measurements above adjusted threshold"
            icon={<Activity size={18} />}
          />

          <MetricCard
            label="SIGNAL STRENGTH"
            value={strongestSignal.toFixed(2)}
            detail="Strongest detected signal"
            icon={<Gauge size={18} />}
          />
        </section>

        <section className="mt-6 grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
          <div className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4 md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-cyan-400">
                  INTERACTIVE EXPERIMENT
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  Touchscreen surface
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowInternals((current) => !current)}
                aria-pressed={showInternals}
                className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {showInternals ? (
                  <>
                    <EyeOff size={16} />
                    Hide internals
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Show internals
                  </>
                )}
              </button>
            </div>

            <SensorGrid
              frame={frame}
              detection={detection}
              showInternals={showInternals}
              activePointerCount={Object.keys(activePointers).length}
              onPointerMove={(pointerId, x, y) =>
                setActivePointers((current) => ({
                  ...current,
                  [pointerId]: { x, y },
                }))
              }
              onPointerEnd={(pointerId) =>
                setActivePointers((current) => {
                  const next = { ...current };
                  delete next[pointerId];
                  return next;
                })
              }
            />

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-black/20 p-3">
                <p className="text-xs text-slate-500">Estimated X position</p>
                <p className="mt-1 font-mono text-lg text-cyan-300">
                  {detection.x === null ? "—" : detection.x.toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg bg-black/20 p-3">
                <p className="text-xs text-slate-500">Estimated Y position</p>
                <p className="mt-1 font-mono text-lg text-cyan-300">
                  {detection.y === null ? "—" : detection.y.toFixed(2)}
                </p>
              </div>

              <div className="col-span-2 rounded-lg bg-black/20 p-3 sm:col-span-1">
                <p className="text-xs text-slate-500">Measurement state</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                  <Waves size={15} className="text-cyan-400" />
                  {detection.detected ? "Signal change" : "Baseline"}
                </p>
              </div>
            </div>
          </div>

          <ExperimentControls
            sensitivity={sensitivity}
            noise={noise}
            onSensitivityChange={setSensitivity}
            onNoiseChange={setNoise}
            onReset={resetExperiment}
          />
        </section>

        <footer className="mt-8 border-t border-white/[0.08] pt-5 text-center text-xs text-slate-500">
          TOUCHTRACE · Simplified engineering model · Not a physical device
        </footer>
      </div>
    </main>
  );
}
