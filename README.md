# Bloom — Botanical CAD Symbol Generator (Scripted Plants)

![Bloom Banner](https://img.shields.io/badge/Bloom-Botanical%20CAD%20Generator-059669?style=for-the-badge&logo=sprout)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)
![CAD Vector SVG/DXF](https://img.shields.io/badge/Export-SVG%20%7C%20DXF-10B981?style=for-the-badge)

**Bloom** is a Next.js application that allows landscape architects, urban planners, and CAD designers to generate custom 2D plant vector symbols (side profiles, front elevations, and top/plan canopy views). Instead of static vector files, Bloom generates **"scripted plants"**—lightweight, deterministic, recursively calculated code algorithms (leveraging fractal branching geometry and botanical scattering) that output clean, layered SVG & DXF vector graphics.

---

## 🌟 Key Features

### 1. 🤖 Conversational AI Botanical Assistant
- Translates natural language prompt queries (e.g., *"a weeping Japanese maple, front view, delicate branching pattern"* or *"columnar Italian cypress with dense foliage"*) into precise parametric botanical definitions.
- Generates intelligent explanations and real-time parameter tuning breakdowns.

### 2. 🌿 Procedural Botanical Engine
- **Seeded PRNG**: Mulberry32 Pseudo-Random Number Generator ensures 100% reproducible, deterministic plant geometry for any given seed.
- **Recursive Fractal Geometry**: Configurable recursion depth (1 to 7), base branching angles, angle randomness (jitter), branch length decay ratios, and trunk tapering.
- **Gravity & Orientation Effects**: Simulates weeping/drooping gravity bias (e.g., Willows, Maples) or strict upright orientation (e.g., Cypress, Pines).
- **8 Botanical Foliage Renderers**:
  - 🍃 Deciduous Leaves
  - 🌲 Conifer / Pine Needles
  - 🌾 Weeping Tendrils
  - 🌴 Palm Fronds
  - 🌿 Broadleaf Ovals
  - ⭕ Architectural Circles
  - ░ CAD Stipple Hatching
  - 🪵 Bare Winter Branches
- **Color Palettes**: Japanese Maple Red, Emerald Forest, Architect Blueprint, Deep Pine, Autumn Gold, Zen Garden, and Architectural Monochrome.

### 3. 📐 Dual-View & Multi-Viewport Canvas
- **Real-Time Previews**: Front Elevation, Side Profile, and Top/Plan Canopy View.
- **Dual Viewport**: Side-by-side elevation previews.
- **CAD Drafting Environment**: Interactive grid paper background, metric height dimension lines ($H: 4.5\text{m}$, $W: 3.8\text{m}$), and scale block indicators ($1:50$).

### 4. 📤 Export & Download Pipeline
- **Layered SVG Export**: Outputs clean, standard CAD layer groups (`<g id="layer-trunk">`, `<g id="layer-branches">`, `<g id="layer-foliage">`, `<g id="layer-dimensions">`) ready for **Rhino, Revit, AutoCAD, and Adobe Illustrator**.
- **AutoCAD DXF Vector Download**: Exports R12-compatible DXF files with `LINE` and `CIRCLE` vector entities grouped by CAD layer names (`TRUNK_BRANCHES`, `FOLIAGE`).
- **Scripted Code Snippet Generator**: Copy or download executable TypeScript procedural scripts rendering the plant symbol.
- **JSON Preset Storage**: Save and load plant configuration presets.

---

## 🏗️ Architecture & File Structure

```
Bloom/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── README.md
├── src/
│   ├── app/
│   │   ├── globals.css          # CAD blueprint grid tokens & theme styles
│   │   ├── layout.tsx           # App metadata & layout container
│   │   └── page.tsx             # Main split-screen application & viewport state
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CodeViewer.tsx   # Live TypeScript & SVG script viewer
│   │   │   ├── DualViewport.tsx # Synchronized dual front/side previews
│   │   │   └── PlantCanvas.tsx  # Interactive SVG preview canvas with CAD grid
│   │   ├── chat/
│   │   │   └── ChatPanel.tsx    # Conversational AI prompt interface
│   │   ├── controls/
│   │   │   └── ParameterPanel.tsx # Fine-tuning sliders & color palettes
│   │   ├── export/
│   │   │   └── ExportModal.tsx  # Multi-layer SVG, DXF, and JSON download pipeline
│   │   └── layout/
│   │       └── Header.tsx       # Navigation bar with view mode switchers
│   └── lib/
│       ├── engine/
│       │   ├── aiParser.ts      # Natural language prompt parameter parser
│       │   ├── foliage.ts       # Foliage rendering algorithms
│       │   ├── fractalPlant.ts  # Core 2D/3D recursive branching engine
│       │   ├── palettes.ts      # Botanical color palette configurations
│       │   ├── presets.ts       # Preset plant definitions
│       │   └── prng.ts          # Mulberry32 deterministic PRNG
│       └── types/
│           └── plant.ts         # TypeScript interface definitions
```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4 + Custom Architect Blueprint CSS Tokens
- **Icons**: Lucide React (`lucide-react`)
- **Graphics Engine**: Native SVG + Pure Client-Side Procedural Math Engine (Zero external heavy graphics libraries required)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rajahbose/bloom.git
   cd bloom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Production Build

To test and compile the production build:
```bash
npm run build
npm run start
```

---

## 💡 Quick Usage Examples

- **Weeping Japanese Maple**: Type `"delicate weeping Japanese maple, crimson foliage"` into the AI Chat Assistant.
- **Italian Cypress**: Select *"Italian Cypress"* from the load preset dropdown in the header bar.
- **Architectural Elevation**: Toggle foliage style to *"Architectural Circles"* in the Parameter panel for clean elevation line art symbols.
- **Exporting for CAD**: Click **"Export CAD Symbol"** in the top-right header and select **"Download SVG Vector"** or **"Download CAD DXF"**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
