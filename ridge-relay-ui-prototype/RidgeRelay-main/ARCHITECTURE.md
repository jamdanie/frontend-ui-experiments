# RidgeRelay — Architecture (Concept-Level)

This repo is a static wireframe. This document describes a **future production architecture** at a high level to show system boundaries, data minimization, and safety-grade escalation thinking.

RidgeRelay is designed as **session-based safety**, not always-on tracking.

---

## 1) System Overview (Concept)

RidgeRelay can be thought of as four cooperating layers:

1. **Client (User Device)**
   - planning UI (intent declaration)
   - offline map packs
   - boundary monitoring + check-ins (best-effort)
   - local session timer + risk scoring (best-effort)

2. **Session Service (Backend)**
   - stores the active trip session state (ephemeral)
   - maintains escalation stage and timestamps
   - applies retention limits and strict access rules

3. **Notification Service**
   - push notifications (mobile)
   - optional SMS/email for emergency contacts (Phase 2+)
   - sends structured prompts (nudge → check-in → escalation)

4. **Responder / Partner Handoff (Phase 3, verified only)**
   - only with explicit partnerships
   - shares emergency profile + last known context during escalation
   - never exposes user data to the public or other hikers

---

## 2) Primary Data Objects (Minimal by Design)

### Trip Session (ephemeral)
- trail/route reference
- corridor / boundary boxes
- expected duration + completion window
- planned stops / stay zones
- opt-in settings (crowd assist ON/OFF)
- escalation stage + timestamps
- last-known location “breadcrumbs” (short retention, coarse if needed)

### Emergency Profile (opt-in)
- primary/secondary contact
- vehicle / trailhead notes
- optional medical notes

**Disclosure rule:** shared only during escalation, not during normal use.

---

## 3) Session Lifecycle (Trust Model)

### Start
- user plans trip and enables session monitoring
- system confirms the session is active

### Active Monitoring (best-effort)
- boundary drift detection (client-side)
- inactivity checks (client-side)
- signal-loss handling using last-known location (client-side)

### Auto-End (trust feature)
Tracking ends automatically when:
- user completes A → B route, OR
- user returns to trailhead (A → A), OR
- user manually ends the trip

The UI must confirm:
> **“Tracking ended — you are no longer being monitored.”**

---

## 4) Escalation Pipeline (Concept)

RidgeRelay avoids “panic-first.” It escalates progressively and transparently.

1. **Nudge**
   - “Did you mean to cross your boundary?”
   - “Weather hazard ahead”

2. **Check-in**
   - “Are you still active?”
   - “No movement detected for X minutes”

3. **Risk stacking**
   - deviation + inactivity + signal loss increases confidence of distress
   - reduces false alarms by requiring multiple signals

4. **Notify POC**
   - sends last-known context: location, time, trail segment, intent summary
   - does not share sensitive history

5. **Responder handoff (Phase 3)**
   - only with verified partnerships
   - shares emergency profile + last-known context

---

## 5) Offline-First Strategy (Concept)

Low/no-signal is expected.

Client should support:
- offline trail packs (tiles/vector + route corridor)
- cached “exit routes” and trailheads
- connectivity probability overlay (decision support, not guarantee)

Backend should:
- tolerate missing pings
- treat offline periods as normal unless risk signals stack up

---

## 6) Privacy & Security Guardrails

### Data minimization defaults
- no persistent location history by default
- no social identity sharing
- no public “live dot” tracking

### Retention (future policy)
- session state is ephemeral and expires
- escalation logs kept only as needed for safety traceability (limited)

### Access control
- emergency profile is encrypted and disclosed only during escalation stages
- strict audit trail for any escalation data access

---

## 7) What This Wireframe Implements Today

This prototype does **not** implement any backend architecture.
It only simulates:
- session flow screens
- status prompts
- escalation stages
- dev layout grid tooling

The architecture above exists to guide future implementation and academic review.
