# AI_WORKSPACE_V2_PLAN.md
## VigilX — AI Investigation Workspace V2 Transformation Plan
### Architecture: Full-Viewport Crime Intelligence Operating System | Build Target: ✅ Frontend Only

---

## Executive Summary

The current AI page features a traditional chatbot layout (separate sidebar panels, floating chat bubbles, right-hand evidence tabs).

This redesign transforms the AI workspace into an **AI Investigation Operating System**. Every query produces a unified, multi-section **Intelligence Investigation Report** rendered sequentially from top to bottom.

---

## Key Architecture & UX Decisions

1. **Full Viewport Distraction-Free Layout**:
   - `/ai` is decoupled from the global `DashboardLayout` sidebar.
   - Occupies 100% of the viewport.
   - Includes a sleek top header bar with quick navigation back to `/dashboard` or `/landing`.

2. **2-Column Structure**:
   - **Left Panel (220px)**: **Investigation History ONLY**. Contains past case investigations (e.g. `FIR-2026-101 Summary`, `Rajesh Kumar Investigation`, `Cyber Crime Analysis`). No platform links, no CRUD navigation.
   - **Right Panel (Flex-1)**: **Unified Investigation Workspace**.

3. **Dynamic View States**:
   - **State A (Entry/Welcome)**: Centered "Welcome, Officer" header, large visual investigation search box, 6 suggested prompt cards. No previous messages or metadata preloaded.
   - **State B (Active Workspace)**: Input smoothly docks to the bottom. Each response renders as a complete **Investigation Report** streaming above the input.

4. **Unified Investigation Report Format (Vertical Stream)**:
   Each response is rendered inside a single, beautifully structured official report card following this exact order:
   ```
   ┌──────────────────────────────────────────────────────────────────┐
   │ 🔒 OFFICIAL CRIME INTELLIGENCE REPORT                            │
   │ REPORT ID: REP-2026-X892 | TIMESTAMP: 2026-07-21 | CONFIDENTIAL  │
   ├──────────────────────────────────────────────────────────────────┤
   │ 1. EXECUTIVE INVESTIGATION SUMMARY                               │
   │    Structured narrative explanation with high readability.        │
   ├──────────────────────────────────────────────────────────────────┤
   │ 2. KEY INVESTIGATION DETAILS                                     │
   │    Grid of structured detail cards (Name, Role, FIR, Status,     │
   │    Location, Convictions, Crime Category, Last Activity).       │
   ├──────────────────────────────────────────────────────────────────┤
   │ 3. EVIDENCE & REASONING ANALYSIS                                 │
   │    Confidence Score bar, Evidence Sources badge, Retrieved DBs,   │
   │    LangGraph status, and expandable citation snippets.           │
   ├──────────────────────────────────────────────────────────────────┤
   │ 4. GRAPH RELATIONSHIPS (NEO4J / CYTOSCAPE)                       │
   │    Embedded Cytoscape canvas with color-coded nodes & links.     │
   ├──────────────────────────────────────────────────────────────────┤
   │ 5. CHRONOLOGICAL INVESTIGATION TIMELINE                          │
   │    Vertical event flow (Incident → Complaint → Evidence →       │
   │    Suspect Identified → Arrest → Current Status).               │
   ├──────────────────────────────────────────────────────────────────┤
   │ 6. CONTEXTUAL FOLLOW-UP INVESTIGATIONS                           │
   │    Clickable action chips that immediately populate search box.  │
   └──────────────────────────────────────────────────────────────────┘
   ```

---

## Phase Breakdown

### Phase 1 — Dedicated Full-Viewport Workspace Layout
- **Routing**: Update `src/routes/index.jsx` to render `/ai` in a dedicated route without wrapping in `DashboardLayout`.
- **Top Header**: Include VigilX Intelligence logo, session title, classification badge (`CONFIDENTIAL // RESTRICTED`), system telemetry status, and a button to switch back to Command Center (`/dashboard`).
- **Sidebar**: Include only Investigation History sessions with search filtering and `+ New Investigation`.

### Phase 2 — Dynamic Entry & Docking Search Experience
- **State A**: Large, dominant centered search console with welcome copy and prompt chips.
- **State B**: Docked bottom search bar with auto-resizing text field, send button, and model telemetry tags.

### Phase 3 — Investigation Report Header & Executive Summary
- Create `InvestigationReportCard.jsx` to wrap each report.
- Top institutional banner with report serial number, timestamps, and confidentiality status.
- Section 1: Executive Summary styled with high-readability typography.

### Phase 4 — Key Investigation Details Grid
- Extract key entities from query and response (Name, Role, FIR, Location, Convictions, Status, Crime Category, Last Activity).
- Render as a clean 2x4 responsive grid of intelligence metric cards with monochrome borders and clear values. Filter out null/empty attributes.

### Phase 5 — Visual Evidence & Reasoning Analysis
- Integrated directly into the report card (not a separate tab).
- Visual Confidence Bar (High = 90% Emerald, Medium = 55% Amber, Low = 30% Red).
- Metric chips: Sources count, Citations count, LangGraph reasoning state.
- Expandable retrieved database snippets with source badges.

### Phase 6 — Embedded Neo4j Graph Visualization
- Cytoscape.js interactive graph canvas rendered directly inside the report card.
- Node color mapping: Suspect (Red `#ef4444`), FIR (Blue `#3b82f6`), Victim (Amber `#f59e0b`), Evidence (Purple `#8b5cf6`), Location (Emerald `#10b981`), Officer (Indigo `#6366f1`).
- Interactive controls: Zoom in/out, reset fit, click-node detail tooltip, and legend.

### Phase 7 — Chronological Investigation Timeline
- Rendered vertically below the graph when temporal data exists.
- Vertical step nodes: Incident Occurred → Complaint Registered → Witness Statement → Suspect Identified → Apprehended → Case Pending.

### Phase 8 — Contextual Follow-up Prompt Generator
- Rendered at the bottom of each report.
- Clickable chips (e.g., "Explain previous convictions", "Show connected suspects", "Reconstruct crime timeline", "Summarize FIR-123").
- Clicking a prompt populates the search box and focuses input.

### Phase 9 — Government Command Center Styling & Build Verification
- Enforce deep navy/slate tokens (`#07090f`, `#0d1117`, `#1e2d3d`, `#2563eb`), Inter typography, crisp borders, and zero gaming/neon UI elements.
- Verify `npm run build` passes with zero errors.

---

## File Structure Plan

```
src/
├── features/
│   └── ai/
│       ├── components/
│       │   ├── WelcomeConsole.jsx        (Centered entry screen)
│       │   ├── InvestigationReportCard.jsx (Unified report container & sections)
│       │   ├── ReportSummary.jsx         (Section 1)
│       │   ├── ReportKeyDetails.jsx      (Section 2)
│       │   ├── ReportEvidenceAnalysis.jsx(Section 3)
│       │   ├── ReportGraphView.jsx       (Section 4 - Cytoscape graph)
│       │   ├── ReportTimeline.jsx        (Section 5 - Vertical timeline)
│       │   └── ReportFollowUps.jsx       (Section 6 - Action chips)
│       └── pages/
│           └── AIChatPage.jsx            (Full-screen AI Operating System view)
```

---

## Verification Strategy

- **Build**: Run `npm run build` to verify zero compilation errors.
- **Routing**: Test accessing `/ai` directly — verify no global platform sidebar is shown, and left panel contains only investigation history.
- **Entry State**: Confirm opening `/ai` shows clean welcome screen with centered input and prompt chips.
- **Active State**: Confirm submitting a query smoothly transitions input to bottom, and generates a unified vertical report card containing Summary, Key Details, Evidence Metrics, Cytoscape Graph, Timeline, and Follow-ups.
- **Documentation**: Write `AI_WORKSPACE_V2_WALKTHROUGH.md` detailing architecture, component tree, design decisions, and build results.
