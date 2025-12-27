// screen-final.js — Final Score screen
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.final = (function () {
  const els = {};

  function cache() {
    els.announcement = document.getElementById("final-announcement");
    els.board = document.getElementById("final-scoreboard");
    els.restartBtn = document.getElementById("final-restart-btn");
  }

  function computeWinners() {
    const teams = Spectrum.state.teams || [];
    const totals = Spectrum.state.game.scoreByTeamId || {};

    let best = -Infinity;
    for (const t of teams) best = Math.max(best, Number(totals[t.id] || 0));

    const winners = teams.filter((t) => Number(totals[t.id] || 0) === best);
    return { best: (best === -Infinity ? 0 : best), winners };
  }

  function render() {
    cache(); // safe in case DOM was loaded after init
    const teams = Spectrum.state.teams || [];
    const totals = Spectrum.state.game.scoreByTeamId || {};

    const { best, winners } = computeWinners();

    if (els.announcement) {
      if (teams.length === 0) {
        els.announcement.textContent = "No teams found.";
      } else if (winners.length === 1) {
        els.announcement.textContent = `Winner: ${winners[0].name} with ${best} points.`;
      } else {
        const names = winners.map((w) => w.name).join(" & ");
        els.announcement.textContent = `It’s a tie! ${names} with ${best} points.`;
      }
    }

    if (els.board) {
      els.board.innerHTML = "";

      const sorted = teams
        .slice()
        .sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0));

      for (const team of sorted) {
        const row = document.createElement("div");
        row.className = "wager-row";

        const left = document.createElement("div");
        left.className = "wager-row__left";

        const nameLine = document.createElement("div");
        nameLine.className = "wager-row__team";
        nameLine.textContent = team.name;

        const scoreLine = document.createElement("div");
        scoreLine.className = "wager-row__score";
        scoreLine.textContent = `Total points: ${totals[team.id] || 0}`;

        left.appendChild(nameLine);
        left.appendChild(scoreLine);

        row.appendChild(left);
        els.board.appendChild(row);
      }
    }
  }

  function bind() {
    els.restartBtn?.addEventListener("click", () => {
      // Keep the bank in localStorage; reset game/session state
      Spectrum.state.selectedPlayers = [];
      Spectrum.state.teams = [];

      Spectrum.state.game.teamOrder = [];
      Spectrum.state.game.activeTeamPos = 0;
      Spectrum.state.game.roundIndex = 0;
      Spectrum.state.game.turnIndex = 0;
      Spectrum.state.game.roundType = "standard";
      Spectrum.state.game.scoreByTeamId = {};
      Spectrum.state.game.roundScoresByTeamId = {};
      Spectrum.state.game.roundSpectrum = null;
      Spectrum.state.game.currentTurn = null;
      Spectrum.state.game.wagerStage = "none";
      Spectrum.state.game.wagersByTeamId = {};
      Spectrum.state.game.isFinished = false;

      Spectrum.showScreen("setup");
    });
  }

  function init() {
    cache();
    bind();
  }

  return { init, render };
})();
