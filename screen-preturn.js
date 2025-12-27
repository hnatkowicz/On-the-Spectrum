// screen-preturn.js — Screen 4 (press-and-hold reveal)
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.preturn = (function () {
  const els = {
    meta: null,
    team: null,
    revealBox: null,
    revealValue: null,
    bonusBtn: null,
    deliverBtn: null,
    backBtn: null,
    sliderBackBtn: null,
  };

  let isHolding = false;

  function cache() {
    els.meta = document.getElementById("preturn-meta");
    els.team = document.getElementById("preturn-team");
    els.revealBox = document.getElementById("reveal-box");
    els.revealValue = document.getElementById("reveal-value");
    els.bonusBtn = document.getElementById("bonus-btn");
    els.deliverBtn = document.getElementById("deliver-clue-btn");
    els.backBtn = document.getElementById("preturn-back-btn");
    els.sliderBackBtn = document.getElementById("slider-back-btn");
  }

  function hideTarget() {
    isHolding = false;
    if (els.revealValue) els.revealValue.textContent = "•••";
  }

  function showTarget() {
    isHolding = true;
    const t = Spectrum.state.game.currentTurn?.target;
    if (els.revealValue) els.revealValue.textContent = String(t ?? "—");
  }

  function bindPressHold() {
    if (!els.revealBox) return;

    // Pointer events cover mouse + touch
    els.revealBox.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      els.revealBox.setPointerCapture?.(e.pointerId);
      showTarget();
    });

    const end = () => hideTarget();

    els.revealBox.addEventListener("pointerup", end);
    els.revealBox.addEventListener("pointercancel", end);
    els.revealBox.addEventListener("pointerleave", () => {
      if (isHolding) hideTarget();
    });

    // Keyboard (nice-to-have): hold Space/Enter to reveal
    els.revealBox.setAttribute("tabindex", "0");
    els.revealBox.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!isHolding) showTarget();
      }
    });
    els.revealBox.addEventListener("keyup", (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        hideTarget();
      }
    });
  }

function render() {
  const team = Spectrum.getActiveTeam();
  const r = Spectrum.state.game.roundIndex ?? 1;
  const t = Spectrum.state.game.turnIndex ?? 1;

  const totalRounds = (Spectrum.state.standardRounds || 2) + 1;

  if (els.meta) {
    els.meta.textContent = `Round ${r} of ${totalRounds} • Turn ${t}`;
  }

  if (els.team) {
    els.team.textContent = team?.name ?? "—";
  }

  // Always start hidden
  hideTarget();
}

  function bind() {
    els.backBtn?.addEventListener("click", () => {
      Spectrum.showScreen("teams");
      Spectrum.screens.teams.render();
    });

    els.bonusBtn?.addEventListener("click", () => {
      // Placeholder for now
      alert("Bonus features coming soon.");
    });

els.deliverBtn?.addEventListener("click", () => {
  hideTarget();
  Spectrum.showScreen("slider");
  Spectrum.screens.slider.render();
});

    // Slider placeholder back button
    els.sliderBackBtn?.addEventListener("click", () => {
      Spectrum.showScreen("preturn");
      render();
    });
  }

  function init() {
    cache();
    bind();
    bindPressHold();
  }

  return { init, render };
})();
