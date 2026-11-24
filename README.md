# TOUCHTRACE
### Inside the invisible technology beneath your fingertips.

**TOUCHTRACE** is an interactive engineering simulator that explores how capacitive touchscreens detect human touch through changes in electrical capacitance.

A touchscreen doesn't need to feel physical pressure to detect your finger. Instead, it measures changes in an electrical system and uses those measurements to estimate where touch occurs.

TOUCHTRACE makes this invisible process understandable through an interactive, visual simulation.

---

## Overview

Modern capacitive touchscreens rely on electrical fields and changes in capacitance to detect touch.

TOUCHTRACE provides an interactive environment for exploring this process. Users can interact with a simulated touchscreen, observe the resulting sensor measurements, and experiment with the parameters that influence touch detection.

The project focuses on revealing the engineering behind an everyday technology that most people use without thinking about how it works.

## Key Features

- **Interactive Touchscreen:** Touch or click the simulated glass surface to generate touch interactions.
- **Multi-Touch Simulation:** Explore multiple simultaneous touch points.
- **Sensor Visualization:** Reveal the internal sensor grid and observe simulated signal changes.
- **Touch Detection:** Identify active sensor regions and estimate touch coordinates.
- **Noise Simulation:** Introduce measurement noise and investigate its effect on detection.
- **Sensitivity Control:** Adjust the detection threshold and observe how detection behavior changes.
- **Real-Time Feedback:** View detection metrics and sensor responses as interactions occur.
- **Responsive Interface:** Use the simulator across desktop, tablet, and mobile layouts.

## How It Works

TOUCHTRACE models a simplified capacitive touchscreen detection pipeline.

### 1. Touch Interaction

A user interacts with the simulated touchscreen. Each active pointer represents a finger position in the simulation.

### 2. Sensor Scanning

The simulator generates a sensor frame containing individual sensor measurements.

Each sensor cell receives a simulated touch-induced signal based on its distance from active fingers.

### 3. Signal Attenuation

In mutual-capacitance touchscreen systems, a finger can alter the electrical coupling between transmitting and receiving electrodes.

The simulation represents this effect as a reduction in the baseline measurement.

### 4. Measurement Noise

Random measurement noise is introduced to demonstrate how imperfect measurements can influence sensor readings.

### 5. Signal Analysis

The detector compares observed signal deviations against a configurable detection threshold.

### 6. Touch Estimation

Neighboring active sensor cells are grouped into connected regions. A weighted centroid is calculated for each region to estimate its touch position.

The result is a visual demonstration of how sensor measurements can be transformed into estimated touch coordinates.

## Engineering Model

The simulator uses a simplified mathematical model rather than a complete electrostatic simulation.

The signal generated around a finger is approximated using a Gaussian spatial distribution:

\[
A(x,y)=S e^{-\frac{(x-x_f)^2+(y-y_f)^2}{2\sigma^2}}
\]

Where:

- \(A(x,y)\) is the simulated signal attenuation.
- \(S\) is the signal strength.
- \((x_f,y_f)\) represents the finger position.
- \(\sigma\) controls the spatial spread.

The measured signal is modeled as:

\[
M(x,y)=B-A(x,y)+N(x,y)
\]

Where:

- \(B\) is the baseline measurement.
- \(A(x,y)\) is the simulated attenuation.
- \(N(x,y)\) is additive measurement noise.

The detector analyzes the deviation from baseline and identifies regions that exceed its effective threshold.

These equations are illustrative engineering models, not universal physical laws or exact representations of commercial touchscreen controllers.

## Technology Stack

- **React** — Component-based user interface.
- **TypeScript** — Type-safe application and simulation logic.
- **Vite** — Development server and production build tooling.
- **Tailwind CSS** — Responsive interface styling.
- **Motion** — Interface animations.
- **Lucide React** — Interface icons.
- **Vitest** — Automated testing.

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/touchtrace.git
```

Navigate into the project:

```bash
cd touchtrace
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local URL provided by Vite in your browser.

## Testing

Run the automated test suite:

```bash
pnpm test:run
```

## Production Build

Generate the production build:

```bash
pnpm build
```

The generated production files are placed in the `dist/` directory.

## Scope and Limitations

TOUCHTRACE is an educational engineering simulator.

Its signal distribution, noise model, and detection algorithm are simplified representations designed to make the underlying concepts interactive and understandable.

It does not reproduce the complete electrostatic behavior, electrode geometry, firmware, calibration systems, or proprietary algorithms of a commercial touchscreen controller.

It is a software simulation, not a physical touchscreen measurement instrument.

## Project Purpose

TOUCHTRACE explores the technology hidden beneath an everyday interaction.

Its central idea is simple:

**A capacitive touchscreen detects changes in an electrical system, not mechanical pressure from a finger.**

By making those changes visible, the project turns an invisible engineering process into something people can explore, experiment with, and understand.

---

## Team

Created as a collaborative engineering project for the Global Virtual Hackathon.

## License

License information will be added when the project license is selected.