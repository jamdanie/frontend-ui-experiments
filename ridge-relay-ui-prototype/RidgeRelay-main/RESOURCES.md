# RidgeRelay — Resources, Integrations, and Build Requirements

This repo is a static wireframe prototype. This document outlines what RidgeRelay would need to become a real, safety-grade product while preserving the project’s privacy-first, session-only model.

---

## 1) Maps, Trails, and Offline Packs

### What RidgeRelay needs
- **Base maps + trail geometry** (pre-existing trails) with a fallback for **custom routes**
- **Offline “Trail Packs”** (download before going out):
  - map tiles for the planned area + buffer
  - the selected route corridor + boundary boxes
  - exits / trailheads / points of interest (POIs)
  - optional elevation context (helpful for rescue planning)

### Likely approaches (future)
- Map rendering SDK (web now; mobile later)
- Cached tiles / vector tiles + offline storage
- Trail data import pipeline (public sources + park-provided data)

> Goal: The user can plan with signal, then rely on the pack offline without needing new downloads.

---

## 2) Connectivity Awareness (Service Probability Overlay)

### Why it matters
In many incidents, the difference between “hurt but recoverable” and “fatal” is whether the user can place a call or send a message. RidgeRelay should help users find likely service zones without exposing them or tracking them indefinitely.

### What RidgeRelay needs
- A **“probable service zone” overlay** (best-effort hints, not guarantees)
- Suggested “get-signal” points (ridge lines / trail junctions / known coverage areas)
- Clear UX language:
  - “Likely better signal here”
  - “Signal may be unreliable in this valley”
  - “Last confirmed service zone: X”

> Goal: Provide a practical decision aid when seconds and battery matter.

---

## 3) Weather and Hazard Intelligence

### Weather
- Forecast by trail corridor / region
- Alerts (wind, lightning risk, heat/cold exposure)
- Time-window awareness (“conditions expected to worsen after 3pm”)

### Hazard reports (community + park)
- Wildlife sightings
- Closures / washouts / unsafe bridges
- Trail conditions (ice, fallen trees, avalanche risk in backcountry zones)

### Verification concept (to reduce noise)
- Time decay (“report expires unless reconfirmed”)
- Photo confirmation (optional)
- Multi-confirmation (“3 reports within 45 minutes”)

> Goal: Surface risks early, reduce surprise, prevent “silent failures.”

---

## 4) Trip Sessions and Escalation Engine

RidgeRelay is not “always-on tracking.” It is a **session-based safety layer** with a transparent escalation model.

### Key components
- **Trip session state** (ephemeral)
  - route + corridor + boundary boxes
  - expected duration and completion window
  - planned stops / stay zones
  - user consent status (active monitoring ON/OFF)

### Escalation stages (concept)
1. **Nudge** (boundary drift, hazard warning)
2. **Check-in** (inactivity, late progress, time-window mismatch)
3. **Risk stacking** (offline + deviation + prolonged inactivity)
4. **Notify POC** (emergency contact receives last-known location/time/segment)
5. **Responder handoff (future partnerships only)**

> Goal: Ask first. Escalate predictably. Provide context to reduce wasted search time.

---

## 5) Automatic “End Tracking” Trust Model

A core trust feature is that RidgeRelay **stops monitoring automatically** when it is no longer needed.

### Auto-end scenarios (concept)
- **A → B completion:** user reaches the defined endpoint
- **A → A completion:** user returns to trailhead/parking area
- **User ends trip:** explicit “End Trip” + confirmation prompt

### UX requirement
- Display a clear confirmation:
  - **“Tracking ended — you are no longer being monitored.”**
- Remove permissions / stop background pings for that session

> Goal: Give the user peace of mind without extra steps and reduce “surveillance feel.”

---

## 6) Notifications and Messaging

### What RidgeRelay needs
- In-app notifications (web/mobile UI)
- Push notifications (mobile)
- Optional SMS/email for escalation to POC (Phase 2+)

### Design rules (safety UX)
- Short, unambiguous prompts:
  - “Did you mean to leave your corridor?”
  - “Are you still hiking?”
  - “No updates for 25 minutes — confirm status”
- A clear “I’m OK / Still Resting / Need Help” pattern
- Never reveal PII to other hikers

> Goal: Reduce false alarms while still surfacing real risk quickly.

---

## 7) Crowd Assist (Anonymous, Opt-In, No PII)

RidgeRelay’s crowd feature is modeled more like a safety “verification prompt” than social networking.

### What RidgeRelay needs
- Anonymous **occupancy counts** by trail/segment (no identities)
- Opt-in “nearby assist” prompts:
  - “A device stopped updating near Junction B at 2:14pm. If you pass, confirm conditions.”
- Response options:
  - “Area normal”
  - “Hazard seen”
  - “Possible distress”

### Privacy requirements
- No names, photos, profiles, or direct messaging
- No exact “live dot” sharing of individuals
- Crowd prompts must be:
  - rate-limited
  - time-limited
  - proximity-limited

> Goal: Let the crowd confirm reality (“is this still there?”) without turning the trail into social surveillance.

---

## 8) Emergency Profile and Identity Minimization

### What RidgeRelay needs
- Minimal account identity (enough to secure sessions)
- Optional emergency profile fields (opt-in):
  - Primary/secondary POC
  - Vehicle / trailhead notes
  - Medical notes (optional)
  - Equipment notes (optional)

### Disclosure rule
- Emergency profile is shared **only during escalation**
- Never shared to other hikers
- No persistent location history by default

> Goal: Provide responders and family a “complete picture” only when necessary.

---

## 9) Backend and Infrastructure (Future Build)

This wireframe is static. A production RidgeRelay would likely need:

### Core services
- Authentication (privacy-first; minimal data)
- Session service (trip state, timers, escalation logic)
- Notification service (push/SMS/email)
- Hazard ingestion (park sources + validated community reports)

### Storage strategy
- Ephemeral session data with retention limits
- Strict access controls + audit logs for escalation actions
- Opt-in storage for user history (default OFF)

### Reliability requirements (safety-grade mindset)
- Clear failure modes (what happens if backend is down)
- Offline-first fallback for the user interface
- Transparent UX when monitoring cannot be guaranteed

> Goal: If the system can’t do safety-grade monitoring, it must say so clearly.

---

## 10) Potential Integration Partners (Phase 3 Concepts)

These are conceptual integration directions, not implemented in this prototype:
- Parks / ranger stations (optional check-in safety layer)
- Search-and-rescue workflows (handoff only with verified partnerships)
- Weather/hazard feeds (region-specific)
- Mapping providers and trail datasets

> Goal: Partnerships only when they improve outcomes and do not compromise privacy.

---

## Summary

RidgeRelay’s differentiation is not “better maps.”  
It’s **intent-aware safety**, **session-only monitoring**, **predictable escalation**, and **anonymous crowd verification**—designed to prevent accidents, reduce search time, and give peace of mind to users, families, and responders.
