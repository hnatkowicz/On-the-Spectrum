// state.js — shared state + persistence helpers
window.Spectrum = window.Spectrum || {};

Spectrum.LS_KEY_BANK = "spectrum_player_bank";

Spectrum.state = {
  // Setup
  teamCount: 2,
  standardRounds: 2,
  categoryId: "all",

  // Players
  playerBank: [],
  selectedPlayers: [],

  // Teams
  // [{ id:"t1", name:"Sideways Nuns", colorKey:"yellow", players:[...]}]
  teams: [],

  // Game state
  game: {
    teamOrder: [],
    activeTeamPos: 0,

    roundIndex: 0,     // 1-based when game starts
    turnIndex: 0,      // 1-based within round
    roundType: "standard", // "standard" | "wager"

    scoreByTeamId: {},
    roundScoresByTeamId: {},

    roundSpectrum: null, // fixed for the round
    currentTurn: null,   // { target, guess, award }
    isFinished: false,
    winnerTeamIds: [],
  },
};

/* ---------- name helpers ---------- */

Spectrum.normalizeName = function (name) {
  return String(name || "").trim().replace(/\s+/g, " ");
};

Spectrum.nameKey = function (name) {
  return Spectrum.normalizeName(name).toLowerCase();
};

// Accept: comma/semicolon/newline separated list (NOT spaces)
Spectrum.parseNames = function (raw) {
  const text = String(raw || "").trim();
  if (!text) return [];
  const parts = text.split(/[,\n;]+/g);

  const out = [];
  const seen = new Set();
  for (const p of parts) {
    const clean = Spectrum.normalizeName(p);
    if (!clean) continue;
    const k = Spectrum.nameKey(clean);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(clean);
  }
  return out;
};

Spectrum.minPlayersRequired = function () {
  return Spectrum.state.teamCount * 2;
};

/* ---------- localStorage: bank ---------- */

Spectrum.loadBank = function () {
  try {
    const raw = localStorage.getItem(Spectrum.LS_KEY_BANK);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      const seen = new Set();
      Spectrum.state.playerBank = parsed
        .map(Spectrum.normalizeName)
        .filter(Boolean)
        .filter((n) => {
          const k = Spectrum.nameKey(n);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .sort((a, b) => a.localeCompare(b));
      return;
    }
  } catch (_) {}
  Spectrum.state.playerBank = [];
};

Spectrum.saveBank = function () {
  localStorage.setItem(
    Spectrum.LS_KEY_BANK,
    JSON.stringify(Spectrum.state.playerBank)
  );
};

Spectrum.addToBank = function (name) {
  const clean = Spectrum.normalizeName(name);
  if (!clean) return false;

  const k = Spectrum.nameKey(clean);
  const exists = Spectrum.state.playerBank.some((n) => Spectrum.nameKey(n) === k);
  if (!exists) {
    Spectrum.state.playerBank.push(clean);
    Spectrum.state.playerBank.sort((a, b) => a.localeCompare(b));
    Spectrum.saveBank();
  }
  return true;
};

/* ---------- current-game selection ---------- */

Spectrum.isSelected = function (name) {
  const k = Spectrum.nameKey(name);
  return Spectrum.state.selectedPlayers.some((n) => Spectrum.nameKey(n) === k);
};

Spectrum.addToSelected = function (name) {
  const clean = Spectrum.normalizeName(name);
  if (!clean) return;
  if (Spectrum.isSelected(clean)) return;
  Spectrum.state.selectedPlayers.push(clean);
  Spectrum.state.selectedPlayers.sort((a, b) => a.localeCompare(b));
};

Spectrum.removeFromSelected = function (name) {
  const k = Spectrum.nameKey(name);
  Spectrum.state.selectedPlayers = Spectrum.state.selectedPlayers.filter(
    (n) => Spectrum.nameKey(n) !== k
  );
};

/* ---------- navigation ---------- */

Spectrum.showScreen = function (which) {
  const screens = {
    setup: document.getElementById("screen-setup"),
    players: document.getElementById("screen-players"),
    teams: document.getElementById("screen-teams"),
    preturn: document.getElementById("screen-preturn"),
    slider: document.getElementById("screen-slider"),
    wager: document.getElementById("screen-wager"),
    final: document.getElementById("screen-final"),
  };

  Object.values(screens).forEach((el) => el && el.classList.add("hidden"));
  screens[which]?.classList.remove("hidden");
};

/* ---------- random helpers ---------- */

Spectrum.shuffle = function (arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

Spectrum.randomIntInclusive = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Spectrum.pickRandom = function (arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/* ---------- round/turn helpers ---------- */

Spectrum.pickRoundSpectrum = function () {
  const cat = Spectrum.state.categoryId || "all";
  const allPairs = Spectrum.data?.boundaryPairs || [];

  const pool =
    cat === "all" ? allPairs : allPairs.filter((p) => p.categoryId === cat);

  const chosen = Spectrum.pickRandom(pool) || Spectrum.pickRandom(allPairs);
  Spectrum.state.game.roundSpectrum = chosen || null;
};

Spectrum.beginRound = function () {
  // One pass through teams: turnIndex 1..teamCount
  Spectrum.state.game.turnIndex = 1;
  Spectrum.pickRoundSpectrum();

  // Reset round-only scores
  for (const t of Spectrum.state.teams) {
    Spectrum.state.game.roundScoresByTeamId[t.id] = 0;
  }
};

Spectrum.startTurn = function () {
  Spectrum.state.game.currentTurn = {
    target: Spectrum.randomIntInclusive(0, 100),
    guess: null,
    award: 0,
  };
};

Spectrum.getActiveTeam = function () {
  const order = Spectrum.state.game.teamOrder || [];
  const pos = Spectrum.state.game.activeTeamPos || 0;
  const teamId = order[pos];
  return (Spectrum.state.teams || []).find((t) => t.id === teamId) || null;
};

Spectrum.startGame = function () {
  const teams = Spectrum.state.teams || [];

  // Fixed randomized order for entire game
  Spectrum.state.game.teamOrder = Spectrum.shuffle(teams.map((t) => t.id));
  Spectrum.state.game.activeTeamPos = 0;

  // Initialize scores
  Spectrum.state.game.scoreByTeamId = {};
  Spectrum.state.game.roundScoresByTeamId = {};
  for (const t of teams) {
    Spectrum.state.game.scoreByTeamId[t.id] = 0;
    Spectrum.state.game.roundScoresByTeamId[t.id] = 0;
  }
  Spectrum.state.game.wagerStage = "none";
  Spectrum.state.game.wagersByTeamId = {};

  Spectrum.state.game.roundIndex = 1;
  Spectrum.state.game.roundType = "standard";

  Spectrum.beginRound();
  Spectrum.startTurn();
};

Spectrum.advanceTurn = function () {
  const game = Spectrum.state.game;
  const order = game.teamOrder || [];
  const teamsThisRound = order.length;

  if (game.isFinished) return;

  game.activeTeamPos = (game.activeTeamPos + 1) % Math.max(teamsThisRound, 1);
  game.turnIndex = (game.turnIndex || 1) + 1;

  if (game.turnIndex > teamsThisRound) {
    // finished wager round → game over
    if (game.roundType === "wager") {
      game.wagerStage = "done";
      game.isFinished = true;
      return;
    }

    game.roundIndex = (game.roundIndex || 1) + 1;

    const std = Spectrum.state.standardRounds || 2;
    game.roundType = game.roundIndex <= std ? "standard" : "wager";

    game.activeTeamPos = 0;

    if (game.roundType === "wager") {
      Spectrum.beginWagerSetup();
      return;
    }

    Spectrum.beginRound();
  }

  Spectrum.startTurn();
};

Spectrum.totalRounds = function () {
  return (Spectrum.state.standardRounds || 2) + 1; // +1 wager round
};

Spectrum.isEnteringWagerSetup = function () {
  return Spectrum.state.game.roundType === "wager" && Spectrum.state.game.wagerStage === "setup";
};

Spectrum.beginWagerSetup = function () {
  Spectrum.state.game.wagerStage = "setup";
  Spectrum.state.game.wagersByTeamId = {};
};

Spectrum.startWagerRound = function () {
  // Called after wagers are entered
  Spectrum.state.game.wagerStage = "play";

  // Keep the wagers entered; do NOT reset them here
  // Spectrum.state.game.wagersByTeamId stays as-is

  Spectrum.state.game.activeTeamPos = 0;
  Spectrum.state.game.turnIndex = 1;

  // Choose a new spectrum for the wager round (keeps it fresh)
  Spectrum.pickRoundSpectrum();
  Spectrum.startTurn();
};

Spectrum.resolveWagerTurn = function ({ teamId, target, guess }) {
  const rules = Spectrum.data.wagerRules;
  const wager = Spectrum.state.game.wagersByTeamId[teamId] || 0;
  const dist = Math.abs(target - guess);

  let delta = 0;

  if (dist <= rules.winWithin) {
    delta = wager * (rules.winMultiplier - 1); // net gain
  } else if (dist <= rules.neutralWithin) {
    delta = 0;
  } else {
    const rawLoss = wager / rules.loseDivisor;
    delta = -(rules.loseRounding === "floor"
      ? Math.floor(rawLoss)
      : Math.ceil(rawLoss));
  }

  Spectrum.state.game.scoreByTeamId[teamId] += delta;
  return delta;
};

