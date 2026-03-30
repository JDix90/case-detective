# Case Detective - Russian Pronoun Cases

**Case Detective** is an interactive web application for mastering Russian personal pronoun declensions across all six grammatical cases. It features six distinct game modes, an adaptive review engine, and full local-storage persistence with no backend or external dependencies required.

---

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (bundled with Node)

Check your versions: `node -v` and `npm -v`
If needed, install or update Node.js at https://nodejs.org

### Step-by-Step Setup

**1. Open the project in Visual Studio Code**

Unzip the downloaded archive, then open the `case-detective` folder in VS Code:
```
File > Open Folder > select the case-detective folder
```

**2. Open the integrated terminal**
```
Terminal > New Terminal  (or Ctrl+` / Cmd+`)
```

**3. Install dependencies**
```bash
npm install
```
This installs all required packages into `node_modules/`. Only needs to be run once.

**4. Start the development server**
```bash
npm run dev
```
The terminal will display a local URL, typically:
```
  Local: http://localhost:5173/
```

**5. Open in your browser**

Navigate to `http://localhost:5173` in any modern browser (Chrome, Firefox, Safari, Edge).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Compile TypeScript and build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for final testing |
| `npm run lint` | Run ESLint across all TypeScript/TSX files |

---

## Game Modes

| Mode | Description |
|------|-------------|
| Learn Table | Interactive declension table with row/column/cell highlighting and mastery dots |
| Practice | Adaptive fill-in-the-blank questions that focus on your weakest forms |
| Speed Round | 60-second timed blitz - wrong answers cost 2 seconds |
| Boss Battle | Team vs. boss - deal damage with correct answers, boss heals on mistakes |
| Memory Match | Flip-card matching across three match types and three grid sizes |
| Grid Challenge | Complete the full declension grid with virtual Cyrillic keyboard or answer palette |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand 5 |
| Routing | React Router v7 |
| Persistence | Browser localStorage (no backend) |

---

## Project Structure

```
src/
  App.tsx                    - Root router
  main.tsx                   - Entry point
  index.css                  - Tailwind + CSS variables
  types/index.ts             - Canonical TypeScript types
  data/
    pronounForms.ts          - 48 pronoun forms (8 pronouns x 6 cases)
    caseMetadata.ts          - Case labels, colors, helper words
    confusionPairs.ts        - High-confusion form pairs
    questionTemplates.ts     - Question bank with distractors and explanations
    gameConfigs.ts           - Boss HP, speed round, adaptive thresholds
  lib/
    adaptiveEngine.ts        - Mastery scoring, queue management
    bossEngine.ts            - HP math, shield, damage/heal calculations
    questionGenerator.ts     - Question selection with filters
    storage.ts               - localStorage schema and helpers
  store/gameStore.ts         - Zustand global store
  components/
    ui/                      - Shared UI primitives
    game/                    - Game-specific components
  screens/
    home/                    - HomeScreen, SettingsScreen
    learn/                   - LearnScreen (Learn Table)
    practice/                - PracticeScreen
    speed/                   - SpeedScreen (Speed Round)
    boss/                    - BossScreen (Boss Battle)
    memory/                  - MemoryScreen (Memory Match)
    grid/                    - GridScreen (Grid Challenge)
    results/                 - ResultsScreen
```

---

## Data Persistence

All progress is stored in the browser `localStorage` under these keys:

| Key | Contents |
|-----|---------|
| `cd_mastery_records` | Per-form mastery scores, accuracy, streaks |
| `cd_adaptive_queue` | Prioritized review queue (max 20 items) |
| `cd_settings` | Difficulty, display preferences |
| `cd_session_history` | Last 50 session summaries |

To clear all data, go to **Settings > Clear All Progress** within the app.

---

## Deployment

To deploy as a static site (Netlify, Vercel, GitHub Pages, etc.):

```bash
npm run build
```

Upload the contents of the `dist/` folder to any static hosting provider.

---

## License

This project is provided for educational use.
