/* =========================================================
   RidgeRelay Wireframe Logic (Static / Frontend Only)
   ---------------------------------------------------------
   PURPOSE:
   - Simulate navigation between wireframe screens
   - Demonstrate intent-aware safety flows (conceptually)
   - Provide dev-only layout tooling (grid overlay)

   NON-GOALS (by design):
   - No real GPS access
   - No persistent storage
   - No backend calls

   This file is intentionally verbose and commented to:
   - Explain WHAT each section does
   - Explain WHY it exists
   - Leave hooks for future implementation

   IMPORTANT:
   - This file intentionally avoids real GPS access
   - All “events” are simulated for demonstration
   - Backend hooks are documented but not implemented

   This structure mirrors how a real system would be layered,
   even though this prototype is frontend-only.
   ========================================================= */


/* =========================================================
   DEV MODE DETECTION (ONE SOURCE OF TRUTH)
   ---------------------------------------------------------
   Dev mode can be enabled via:
     1) URL param: ?dev=1
     2) Browser toggle: press "D" (saved in localStorage)

   WHY BOTH?
   - ?dev=1 is perfect for sharing a dev link with others
   - "D" toggle is convenient while you iterate locally
   ========================================================= */

const params = new URLSearchParams(window.location.search);

// URL param dev=1 overrides everything
const DEV_FROM_URL = params.get("dev") === "1";

// Browser-stored dev mode (persisted per device/browser)
const DEV_FROM_STORAGE = localStorage.getItem("ridgerelay_dev") === "1";

// Final dev mode flag
const DEV_MODE = DEV_FROM_URL || DEV_FROM_STORAGE;


/* =========================================================
   INTRO GATE (VIDEO) — DISMISS ON ANY INTERACTION
   ---------------------------------------------------------
   Behavior:
   - Show the intro overlay once per browser (localStorage)
   - Autoplay muted so browsers allow it
   - Dismiss on:
     - click/tap/pointer
     - any key press
     - scroll/wheel
     - touch
     - video ended
   - Fade out smoothly, then remove from DOM

   Storage key:
   - ridgerelay_intro_seen = "1"
   ========================================================= */

(function initIntroGate(){
  const gate = document.getElementById("introGate");
  const video = document.getElementById("introVideo");
  if (!gate || !video) return;

  const seen = localStorage.getItem("ridgerelay_intro_seen") === "1";

  // If already seen, remove immediately so it never blocks UI.
  if (seen){
    gate.remove();
    return;
  }

  let dismissed = false;

  function dismissIntro(reason){
    if (dismissed) return;
    dismissed = true;

    // Persist so it doesn’t show again.
    localStorage.setItem("ridgerelay_intro_seen", "1");

    // Fade out (CSS handles transition)
    gate.classList.add("is-hiding");

    // Stop the video to save CPU.
    try { video.pause(); } catch(e) {}

    // Remove after fade
    window.setTimeout(() => {
      gate.remove();
    }, 380);
  }

  // If the video finishes naturally, enter automatically.
  video.addEventListener("ended", () => dismissIntro("ended"));

  // Autoplay can fail on some browsers if rules change; if it fails,
  // we still allow the user to click/press to enter.
  video.play().catch(() => { /* ignore */ });

  // ANY interaction dismisses it.
  // We use capture to ensure dismissal happens even if something else is layered.
  const opts = { capture: true, passive: true };

  function onAnyInput(e){
    // If user is typing into fields (rare during intro, but safe)
    // still dismiss — user said “anything can dismiss it.”
    dismissIntro(e.type);
    removeListeners();
  }

  function removeListeners(){
    window.removeEventListener("pointerdown", onAnyInput, true);
    window.removeEventListener("keydown", onAnyInput, true);
    window.removeEventListener("wheel", onAnyInput, true);
    window.removeEventListener("touchstart", onAnyInput, true);
  }

  window.addEventListener("pointerdown", onAnyInput, true);
  window.addEventListener("keydown", onAnyInput, true);
  window.addEventListener("wheel", onAnyInput, true);
  window.addEventListener("touchstart", onAnyInput, true);

  // Safety fallback: if nothing happens, still allow the UI after 12s.
  // (Prevents a “stuck” feeling on weird autoplay edge cases.)
  window.setTimeout(() => {
    if (!dismissed) dismissIntro("timeout");
  }, 12000);
})();


/* =========================================================
   BASIC SCREEN NAVIGATION
   ---------------------------------------------------------
   Buttons with data-nav="screen-id" switch visible screens.
   This keeps the prototype framework-agnostic.
   ========================================================= */

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-nav]");

function showScreen(id){
  screens.forEach(s => s.classList.remove("show"));

  const target = document.getElementById(id);
  if (target) target.classList.add("show");

  // Update sidebar active state
  document.querySelectorAll(".navitem").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.nav === id);
  });
}

navButtons.forEach(btn=>{
  btn.addEventListener("click", () => {
    showScreen(btn.dataset.nav);
  });
});


/* =========================================================
   INPUT SAFETY (DON'T TRIGGER KEYS WHILE TYPING)
   ---------------------------------------------------------
   Prevents dev hotkeys from firing while editing fields.
   ========================================================= */

function isTypingInField(target){
  const tag = (target && target.tagName) ? target.tagName.toLowerCase() : "";
  return tag === "input" || tag === "textarea" || tag === "select" || (target && target.isContentEditable);
}


/* =========================================================
   DEV MODE TOGGLE (KEY: D)
   ---------------------------------------------------------
   Press D to toggle dev mode for THIS browser.

   - If dev mode is ON via URL (?dev=1), D does NOT turn it off,
     because the URL is explicitly forcing it.
   - If dev mode is ON via localStorage, D flips it and you reload.
   ========================================================= */

window.addEventListener("keydown", (e) => {
  if (isTypingInField(e.target)) return;

  if (e.key.toLowerCase() === "d") {
    // If URL is forcing dev, tell you what's happening
    if (DEV_FROM_URL) {
      alert("Dev mode is ON because the URL contains ?dev=1.\nRemove ?dev=1 to disable it.");
      return;
    }

    const on = localStorage.getItem("ridgerelay_dev") === "1";
    localStorage.setItem("ridgerelay_dev", on ? "0" : "1");
    alert(`RidgeRelay dev mode: ${on ? "OFF" : "ON"}\nReload the page to apply.`);
  }
});


/* =========================================================
   GRID OVERLAY TOGGLE (KEY: G) — DEV ONLY
   ---------------------------------------------------------
   - Works only when dev mode is enabled
   - Uses body class: "show-grid"
   - Saves grid preference in localStorage so it sticks
   ========================================================= */

function toggleGrid(){
  if (!DEV_MODE) return;

  document.body.classList.toggle("show-grid");
  const on = document.body.classList.contains("show-grid");
  localStorage.setItem("ridgerelay_grid", on ? "1" : "0");
}

// Restore grid state (only in dev mode)
if (DEV_MODE){
  if (localStorage.getItem("ridgerelay_grid") === "1"){
    document.body.classList.add("show-grid");
  }

  window.addEventListener("keydown", (e)=>{
    if (isTypingInField(e.target)) return;

    if (e.key.toLowerCase() === "g") {
      toggleGrid();
    }
  });
}


/* =========================================================
   GRID LABEL GENERATION (DEV ONLY)
   ---------------------------------------------------------
   Dynamically generates:
   - Column labels (A–X for 24 columns)
   - Row numbers for vertical rhythm

   WHY DYNAMIC?
   - Responsive to viewport height
   - Avoids hard-coding row count
   ========================================================= */

(function setupGridLabels(){
  if (!DEV_MODE) return;

  const overlay = document.querySelector(".grid-overlay");
  if (!overlay) return;

  const top = overlay.querySelector(".grid-labels-top");
  const bottom = overlay.querySelector(".grid-labels-bottom");
  const left = overlay.querySelector(".grid-labels-left");

  const COL_COUNT = 24; // A–X
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, COL_COUNT).split("");

  function fillColumns(container){
    if (!container) return;
    container.innerHTML = "";
    letters.forEach(l => {
      const span = document.createElement("span");
      span.textContent = l;
      container.appendChild(span);
    });
  }

  function fillRows(){
    if (!left) return;
    left.innerHTML = "";

    // IMPORTANT:
    // This rowHeight should match your CSS var --grid-row if possible.
    // If your CSS uses a different row height, the labels won't align.
    const rowHeight = 24; // "visual rhythm" assumption

    const available = window.innerHeight - 100;
    const rows = Math.max(10, Math.floor(available / rowHeight));

    for (let i = 1; i <= rows; i++){
      const span = document.createElement("span");
      span.textContent = i;
      left.appendChild(span);
    }
  }

  fillColumns(top);
  fillColumns(bottom);
  fillRows();

  window.addEventListener("resize", fillRows);
})();


/* =========================================================
   SIMULATED SAFETY EVENTS
   ---------------------------------------------------------
   These buttons represent conditions that would normally be
   triggered by:
   - GPS deviation
   - inactivity timers
   - signal loss
   - environmental data

   The goal is to show:
   - how the system responds
   - how escalation remains calm and predictable
   ========================================================= */

const statusBadge = document.getElementById("statusBadge");
const statusDetail = document.getElementById("statusDetail");
const eventFeed = document.getElementById("eventFeed");

function logEvent(text){
  if (!eventFeed) return;

  const item = document.createElement("div");
  item.className = "feeditem";
  item.innerHTML = `<span class="time">Now</span> ${text}`;
  eventFeed.prepend(item);
}

// Boundary deviation simulation
document.getElementById("btnBoundary")?.addEventListener("click", ()=>{
  if (!statusBadge || !statusDetail) return;

  statusBadge.textContent = "Off Route";
  statusBadge.className = "badge warn";
  statusDetail.textContent = "Outside corridor. Intent confirmation requested.";
  logEvent("Boundary crossed. User prompted for intent confirmation.");

  // Optional: automatically show notifications screen
  // showScreen("screen-notifications");
});

// Inactivity simulation
document.getElementById("btnInactivity")?.addEventListener("click", ()=>{
  if (!statusBadge || !statusDetail) return;

  statusBadge.textContent = "Inactive";
  statusBadge.className = "badge warn";
  statusDetail.textContent = "No movement detected. Check-in initiated.";
  logEvent("Extended inactivity detected. Status check sent.");

  // Optional: show notifications screen
  // showScreen("screen-notifications");
});

// Lost signal simulation
document.getElementById("btnOffline")?.addEventListener("click", ()=>{
  if (!statusBadge || !statusDetail) return;

  statusBadge.textContent = "Offline";
  statusBadge.className = "badge bad";
  statusDetail.textContent = "Signal lost. Monitoring via last known location.";
  logEvent("Signal lost. Last known location preserved.");

  // Optional: show escalation screen
  // showScreen("screen-escalation");
});

// SOS simulation
document.getElementById("btnSOS")?.addEventListener("click", ()=>{
  if (!statusBadge || !statusDetail) return;

  statusBadge.textContent = "SOS";
  statusBadge.className = "badge bad";
  statusDetail.textContent = "Emergency escalation initiated.";
  logEvent("SOS triggered. Emergency escalation path started.");

  // FUTURE:
  // - Lock UI
  // - Notify POC
  // - Package last-known route, time, intent, zones
});


/* =========================================================
   SESSION TRUST MODEL (CONCEPT ONLY)
   ---------------------------------------------------------
   Future logic would auto-end monitoring when:
   - User completes A → B route
   - User returns to trailhead (A → A)
   - User explicitly ends trip and confirms safety

   IMPORTANT UX PRINCIPLE:
   Tracking is temporary, session-bound, and self-terminating.
   ========================================================= */

/*
function autoEndSession(reason){
  // FUTURE IMPLEMENTATION:
  // - Stop GPS polling
  // - Clear timers
  // - Notify user that tracking has ended
  // - Persist summary ONLY if user opts in
}
*/


/* =========================================================
   END OF FILE
   ---------------------------------------------------------
   This file is intentionally readable and over-commented
   to support:
   - Academic review
   - Recruiter review
   - Future team collaboration
   ========================================================= */

