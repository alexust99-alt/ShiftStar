# ShiftStar — AI Recognition Engine for F&B Teams
### MSc-HEI2058 · Glion Institute of Higher Education

---

## What it is
A two-sided AI-powered staff recognition platform for F&B teams.

- **Manager side** — Log shifts, tag standout employees, generate personalized AI recognition messages
- **Employee side** — Personal dashboard with recognition history, badges, streak tracker, and team leaderboard

---

## Setup in Claude Code

### Step 1 — Install frontend dependencies
```bash
npm install
```

### Step 2 — Install backend dependencies
```bash
cp server-package.json package-temp.json
npm install express cors
```

Or manually:
```bash
npm install express cors
```

### Step 3 — Add your API key
Open `server.js` and replace `YOUR_API_KEY_HERE` with your Anthropic API key:
```js
const ANTHROPIC_API_KEY = "sk-ant-...your-key-here...";
```

Or set it as an environment variable:
```bash
export ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

### Step 4 — Run the backend
In one terminal:
```bash
node server.js
```
You should see: `ShiftStar backend running on port 3001`

### Step 5 — Run the frontend
In another terminal:
```bash
npm start
```
Opens at `http://localhost:3000`

---

## Project structure

```
shiftstar-app/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── App.jsx             # Root component, state management
│   ├── index.js            # React entry point
│   ├── styles.css          # Global styles
│   ├── data.js             # Seed data, constants, helpers
│   └── components/
│       ├── UI.jsx          # Shared UI components (Button, Card, Tabs, etc.)
│       ├── ManagerView.jsx # Manager dashboard + shift logging + AI generation
│       └── EmployeeView.jsx# Employee login + personal dashboard + leaderboard
├── server.js               # Express backend (keeps API key secure)
├── package.json            # React dependencies
└── README.md
```

---

## Features

### Manager
- Log shift details (venue, date, covers, shift type, notes)
- Tag employees with performance metrics (upsells, speed, guest praise, etc.)
- AI generates personalized recognition message + badge + reward suggestion per employee
- AI generates shareable team highlight for noticeboard / group chat
- Full shift history — click any past shift to review its recognition

### Employee
- Select your name to access your personal hub
- Stats: badges earned, shift streak, team rank
- 7-dot streak tracker showing recognized shifts
- Full recognition history with dates and venue
- Badge gallery
- Live team leaderboard with points

---

## Seed data
The app launches with 3 pre-loaded shifts and 4 employees (Sofia M., James T., Aisha R., Marco D.) so everything is populated from the first load.

---

## Ethical note
- API key is kept on the backend — never exposed in the browser
- All AI content is reviewed by the manager before sharing
- No employee data is persisted beyond the browser session

---

*Built for MSc-HEI2058 · AI in Hospitality, Entrepreneurship and Innovation · June 2026*
