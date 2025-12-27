// screen-setup.js
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.setup = (function () {
  const els = {};

  function cache() {
    els.teamCountButtons = Array.from(document.querySelectorAll("[data-teamcount]"));
    els.roundCountButtons = Array.from(document.querySelectorAll("[data-roundcount]"));
    els.totalRounds = document.getElementById("total-rounds");
    els.continueBtn = document.getElementById("continue-btn");

    // Screen 2 min fields exist even when hidden
    els.minRequired = document.getElementById("min-required");
    els.minCount = document.getElementById("min-count");
  }

  function syncMinToDOM() {
    const min = Spectrum.minPlayersRequired();
    if (els.minRequired) els.minRequired.textContent = String(min);
    if (els.minCount) els.minCount.textContent = String(min);
  }

  function syncTotalRoundsToDOM() {
    // Standard rounds + 1 wager round
    const total = (Spectrum.state.standardRounds || 2) + 1;
    if (els.totalRounds) els.totalRounds.textContent = String(total);
  }

  function setTeamCount(n) {
    Spectrum.state.teamCount = n;

    for (const btn of els.teamCountButtons) {
      const btnCount = Number(btn.dataset.teamcount);
      btn.setAttribute("aria-pressed", String(btnCount === n));
    }

    syncMinToDOM();

    // Re-render players if loaded (so continue enable/disable updates)
    if (Spectrum.screens.players && Spectrum.screens.players.render) {
      Spectrum.screens.players.render();
    }
  }

  function setStandardRounds(n) {
    Spectrum.state.standardRounds = n;

    for (const btn of els.roundCountButtons) {
      const btnCount = Number(btn.dataset.roundcount);
      btn.setAttribute("aria-pressed", String(btnCount === n));
    }

    syncTotalRoundsToDOM();
  }

  function bind() {
    for (const btn of els.teamCountButtons) {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.teamcount);
        if (![2, 3, 4].includes(n)) return;
        setTeamCount(n);
      });
    }

    for (const btn of els.roundCountButtons) {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.roundcount);
        if (![2, 3, 4, 5].includes(n)) return;
        setStandardRounds(n);
      });
    }

    els.continueBtn.addEventListener("click", () => {
      Spectrum.showScreen("players");
      Spectrum.screens.players.render();
      Spectrum.screens.players.focusInput();
    });
  }

  function init() {
    cache();
    bind();

    // initialize defaults
    setTeamCount(Spectrum.state.teamCount || 2);
    setStandardRounds(Spectrum.state.standardRounds || 2);
  }

  return { init };
})();
