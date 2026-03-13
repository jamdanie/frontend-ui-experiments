# RidgeRelay Roadmap / Concept Whiteboard

This document tracks what’s implemented in the wireframe, what’s being refined, and what we want to explore next.

---

## ✅ Implemented in Wireframe (Clickable) https://jamdanie.github.io/RidgeRelay/

### Core UX Flows
- [x] Landing → Plan Trip → Guardrails → Emergency Profile → Active Trip
- [x] Notification examples (boundary, hazard, check-in, crowd assist)
- [x] Escalation transparency screen

### System Concepts Represented
- [x] Intent-based trip planning (trail estimate vs personal estimate)
- [x] Boundary guardrails: trail corridor + zones (stay/no-go)
- [x] Session-based monitoring (temporary permission model)
- [x] Offline maps concept + probable service zones overlay
- [x] Anonymous trail occupancy concept
- [x] Opt-in crowd assist safety signals concept
- [x] Staged escalation model + SOS path
- [x] Privacy-by-design principles (no always-on tracking, emergency-only disclosure)

---

## 🛠️ In Progress (Actively Refining)

### UX & Interaction
- [ ] Mobile-first layout refinements (thumb-friendly, glove-friendly)
- [ ] Accessibility pass (contrast, font size scaling, reduced motion)
- [ ] Improve “Active Trip” clarity (status hierarchy, primary actions)

### Safety Logic (Concept Refinement)
- [ ] Define check-in timing rules (inactivity thresholds tied to intent)
- [ ] Boundary alerts: nudge vs repeat vs escalation criteria
- [ ] Reduce false positives (intent-aware calm UX)

### Privacy & Consent
- [ ] Opt-in wording for crowd assist + emergency profile disclosure
- [ ] Data retention policy draft (wireframe-level assumptions)

---

## 🧪 Research / Exploration Backlog

### Offline + Low Signal Realities
- [ ] Battery-aware sampling strategies
- [ ] Offline-first sync model (store-and-forward events)
- [ ] “Service zone” data sourcing options (probabilistic overlay)

### Crowd Assist System
- [ ] Abuse prevention & rate limits
- [ ] “Is this still there?” confirmation UX patterns
- [ ] Coarse location granularity defaults (segment vs radius)

### Integrations (Future)
- [ ] Weather alerts feed model (NOAA + park alerts)
- [ ] Wearables (Apple Watch / Garmin) event signals
- [ ] Responder workflows (what info helps SAR most)

---

## 🚀 Future Phases (Beyond Wireframe)

### Phase 2 — Prototype (MVP)
- [ ] Real map tiles + offline download
- [ ] Local state machine for trip monitoring
- [ ] Real push notification testing (simulated)
- [ ] Exportable “emergency packet” for POC (shareable summary)

### Phase 3 — Partnerships / High Stakes
- [ ] Verified responder integration (jurisdiction-specific)
- [ ] Park / ranger integration options
- [ ] Liability boundaries + compliance review

---

## Notes
RidgeRelay is intentionally **not** a social app or fitness leaderboard.
It is a safety layer focused on **intent, privacy, and predictable escalation**.
