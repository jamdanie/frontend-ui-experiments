# RidgeRelay — Differentiation & Safety Philosophy

RidgeRelay is designed to complement—not replace—existing outdoor safety tools.

This document explains how RidgeRelay differs fundamentally from check-in systems, trail apps, and emergency beacons, and why those differences matter for user safety, trust, and real-world rescue outcomes.

---

## 1. Acknowledging the Existing Landscape

Current outdoor safety tools (e.g., itinerary sharing, check-in timers, satellite messengers) provide real value by:

- letting users share plans with trusted contacts
- notifying others after a missed check-in
- enabling emergency alerts once an incident occurs

These tools are effective at **post-failure notification**.

RidgeRelay addresses a **different phase of the safety timeline**.

---

## 2. Core Difference: Timing of Intervention

### Existing Model (Deadline-Based Safety)
1. User files a plan
2. System waits
3. Action occurs after a missed check-in or deadline

This model assumes:
- silence equals emergency
- no intervention until a threshold is crossed

### RidgeRelay Model (Intent-Aware Safety)
1. User declares intent (not just a return time)
2. System monitors deviation from that intent
3. Intervention begins **before silence**

RidgeRelay is designed to detect early warning signals such as:
- unplanned route deviation
- prolonged inactivity outside declared stop zones
- unexpected signal loss
- environmental risk changes

This allows the system to **ask questions before escalating**, rather than assuming failure.

---

## 3. Intent-Aware Safety vs Deadline-Based Safety

### Deadline-Based Systems
- know when a user should return
- do not know what the user intended to do along the way

They cannot distinguish between:
- photography stops
- hunting glassing periods
- weather delays
- navigation errors
- injury-related immobility

### RidgeRelay
RidgeRelay explicitly models intent, including:
- planned route corridor
- personal pace vs trail averages
- planned stops and stay zones
- acceptable deviation areas

This enables RidgeRelay to:
- reduce false alarms
- ask clarifying questions instead of assuming emergency
- preserve user autonomy while still providing safety coverage

---

## 4. Boundary Awareness: Preventing Navigation Errors Early

Many outdoor incidents begin with small navigation mistakes that compound over time.

### Existing Tools
- no awareness of route deviation
- no feedback when a user makes a wrong turn

### RidgeRelay
- defines trail corridors or boundary guardrails
- gently nudges users when they drift:

> “Did you mean to cross your boundary?”

This helps users self-correct early—before becoming lost, exhausted, or injured.

---

## 5. Offline-First Design & Connectivity Awareness

Low-signal environments are the norm, not the exception.

RidgeRelay incorporates:
- downloadable offline maps
- exit routes and trailhead references
- **probable cellular service zones** (decision support, not guarantees)

If a user is injured but mobile, RidgeRelay can help them decide:
- whether to stay put
- whether moving toward a likely service area is reasonable

This supports **in-the-moment decision-making**, not just post-incident alerts.

---

## 6. Environmental Awareness (Weather & Conditions)

RidgeRelay is designed to integrate contextual environmental data, such as:
- weather changes
- wind exposure on ridgelines
- incoming storms or temperature drops

These signals can:
- adjust expected completion windows
- trigger proactive safety nudges
- reduce risk before conditions deteriorate

This mirrors how pilots adapt flight plans to weather—not how timers operate.

---

## 7. Flight Plan–Inspired Safety Model

RidgeRelay borrows from aviation and maritime safety concepts:

- file an intent-based plan
- monitor deviations from plan
- escalate progressively
- avoid unnecessary emergency responses

Key principles:
- ask before assuming failure
- escalate only when confidence drops
- make escalation transparent to the user

This balances safety with trust.

---

## 8. Automatic Trust-Based Shutdown

A common concern with safety apps is:
> “Am I being tracked forever?”

RidgeRelay explicitly avoids this.

Tracking automatically ends when:
- the user completes the planned route
- the user returns to the trailhead
- the user manually ends the trip

The system confirms:
> **“Tracking ended — you are no longer being monitored.”**

No extra steps. No lingering permissions. No ambiguity.

---

## 9. Crowd Awareness Without Surveillance

RidgeRelay introduces anonymous crowd awareness inspired by confirmation patterns such as:
> “Is this accident still there?”

How this works:
- no identities or profiles are shared
- no precise GPS pins are exposed
- notifications are coarse, temporary, and opt-in

Example:
> “A device stopped updating near Trail Junction B at 2:14 PM.  
> If you pass this area, can you confirm conditions?”

Responses are limited to structured signals:
- area appears normal
- hazard observed
- possible distress

This enables situational awareness without social tracking or vigilantism.

---

## 10. Privacy as a First-Class Design Constraint

RidgeRelay is intentionally designed to avoid:
- always-on tracking
- persistent location histories
- social exposure of sensitive data

Safeguards include:
- session-limited permissions
- emergency profile disclosure only during escalation
- anonymous participation by default
- clear user visibility into escalation logic

Safety should not require surveillance.

---

## 11. National Park Check-In Use Case

A real-world entry point:

> A national park could offer RidgeRelay at visitor check-in as an optional safety layer:
> offline trail maps, intent-based trip planning, and staged escalation if a user goes offline or deviates unexpectedly—designed to speed rescue and reduce silent failures without exposing PII to other hikers.

This supports:
- visitors
- families
- rangers
- search-and-rescue teams

without introducing surveillance.

---

## 12. Why This Matters

Many outdoor fatalities are not caused by instant catastrophe, but by:
- delayed awareness
- unnoticed deviation
- unchecked deterioration
- silence before anyone knows there’s a problem

RidgeRelay shortens the gap between:
> “Something feels off”  
and  
> “Someone knows and can help.”

---

## Summary

RidgeRelay does not compete with check-in tools.  
It addresses what happens **before** a missed check-in.

In short:
- existing tools notify others after failure
- RidgeRelay reduces the chance of silent failure in the first place

This difference in timing, intent modeling, and user trust is the foundation of the project.
