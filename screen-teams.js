// screen-teams.js — Screen 3 (Team Selection)
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.teams = (function () {
  const els = {};

  function cache() {
    els.manualBtn = document.getElementById("manual-select-btn");
    els.autoBtn = document.getElementById("auto-select-btn");
    els.startBtn = document.getElementById("start-game-btn");
    els.backBtn = document.getElementById("teams-back-btn");
    els.preview = document.getElementById("teams-preview");
  }

  function shuffle(arr) {
    // Fisher–Yates
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generateTeamName(used) {
    const adj = Spectrum.data?.teamNameWords?.adj || ["Sideways"];
    const noun = Spectrum.data?.teamNameWords?.noun || ["Nuns"];

    for (let tries = 0; tries < 20; tries++) {
      const a = adj[Math.floor(Math.random() * adj.length)];
      const n = noun[Math.floor(Math.random() * noun.length)];
      const name = `${a} ${n}`;
      if (!used.has(name)) {
        used.add(name);
        return name;
      }
    }

    const fallback = `Team ${used.size + 1}`;
    used.add(fallback);
    return fallback;
  }

  function autoSelectTeams() {
    const teamCount = Spectrum.state.teamCount;
    const players = shuffle(Spectrum.state.selectedPlayers);

    const usedNames = new Set();

    // ✅ define colorPool from data (fallback to your 4 primary colors)
    const defaultColors = [
      { key: "blue" },
      { key: "green" },
      { key: "yellow" },
      { key: "orange" },
    ];

    const colorsFromData = Spectrum.data?.teamColors;
    const colorPool = (Array.isArray(colorsFromData) && colorsFromData.length > 0)
      ? colorsFromData.slice(0, teamCount)
      : defaultColors.slice(0, teamCount);

    Spectrum.state.teams = Array.from({ length: teamCount }, (_, i) => ({
      id: `t${i + 1}`,
      name: generateTeamName(usedNames),
      colorKey: colorPool[i]?.key || "blue",
      players: [],
    }));

    players.forEach((p, idx) => {
      Spectrum.state.teams[idx % teamCount].players.push(p);
    });

    render();
  }

  function render() {
    els.preview.innerHTML = "";

    const teams = Spectrum.state.teams || [];
    if (teams.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No teams yet. Click Auto Select to generate teams.";
      els.preview.appendChild(empty);
      els.startBtn.disabled = true;
      return;
    }

    for (const team of teams) {
      const card = document.createElement("div");
      card.className = `team-card team-card--${team.colorKey || "blue"}`;

      const title = document.createElement("h3");
      title.className = "team-card__title";
      title.textContent = team.name;

      const chips = document.createElement("div");
      chips.className = "team-card__chips";

      for (const player of team.players) {
        const chip = document.createElement("span");
        chip.className = "chip chip--current";
        chip.textContent = player;
        chips.appendChild(chip);
      }

      card.appendChild(title);
      card.appendChild(chips);
      els.preview.appendChild(card);
    }

    const ok = teams.every((t) => (t.players || []).length >= 2);
    els.startBtn.disabled = !ok;
  }

  function bind() {
    els.backBtn.addEventListener("click", () => {
      Spectrum.showScreen("players");
      Spectrum.screens.players.render();
      Spectrum.screens.players.focusInput();
    });

    els.manualBtn.addEventListener("click", () => {
      alert("Manual Select is coming next. Auto Select works now.");
    });

    els.autoBtn.addEventListener("click", () => {
      autoSelectTeams();
    });

    els.startBtn.addEventListener("click", () => {
      Spectrum.startGame();
      Spectrum.showScreen("preturn");
      Spectrum.screens.preturn.render();
    });
  }

  function init() {
    cache();
    bind();
    render();
  }

  return { init, render, autoSelectTeams };
})();
