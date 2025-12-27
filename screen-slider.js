// screen-slider.js — Screen 5 (vertical slider + result overlay + scoring)
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.slider = (function () {
  const els = {};
  let value = 50;
  let dragging = false;
  let revealed = false;

  function cache() {
    els.tagline = document.getElementById("slider-tagline");
    els.teamName = document.getElementById("slider-team-name");
    els.teamPill = document.getElementById("slider-team-pill");
    els.roundMeta = document.getElementById("slider-round-meta");

    els.left = document.getElementById("spectrum-left");
    els.right = document.getElementById("spectrum-right");

    els.track = document.getElementById("vslider-track");
    els.thumb = document.getElementById("vslider-thumb");
    els.guessValue = document.getElementById("guess-value");

    // overlay elements
    els.overlay = document.getElementById("vslider-overlay");
    els.targetMarker = document.getElementById("target-marker");
    els.guessMarker = document.getElementById("guess-marker");

    // result row elements
    els.resultRow = document.getElementById("result-row");
    els.targetValue = document.getElementById("target-value");
    els.guessValueFinal = document.getElementById("guess-value-final");
    els.awardValue = document.getElementById("award-value");

    els.backBtn = document.getElementById("slider-back-btn");
    els.submitBtn = document.getElementById("submit-guess-btn");
    els.nextBtn = document.getElementById("next-turn-btn");
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function computeAward(target, guess, difficulty) {
    const d = Number(difficulty || 1);
    const dist = Math.abs(target - guess);

    const green = 3 * d;
    const yellow = 5 * d;
    const orange = 7 * d;

    if (dist === 0) return 5;     // bullseye
    if (dist <= green) return 3;  // green
    if (dist <= yellow) return 2; // yellow
    if (dist <= orange) return 1; // outer band
    return 0;
  }

  function pickTagline() {
    const arr = Spectrum.data?.taglines || [];
    if (!Array.isArray(arr) || arr.length === 0) return "Measure your meaning.";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setTagline() {
    if (els.tagline) els.tagline.textContent = pickTagline();
  }

  function setTeamUI() {
    const team = Spectrum.getActiveTeam();
    if (els.teamName) els.teamName.textContent = team?.name ?? "—";

    if (els.teamPill) {
      els.teamPill.classList.remove(
        "team-pill--blue",
        "team-pill--green",
        "team-pill--yellow",
        "team-pill--orange"
      );
      els.teamPill.classList.add(`team-pill--${team?.colorKey || "blue"}`);
    }

    const r = Spectrum.state.game.roundIndex ?? 1;
    const t = Spectrum.state.game.turnIndex ?? 1;
    const totalRounds = (Spectrum.state.standardRounds || 2) + 1;
    if (els.roundMeta) els.roundMeta.textContent = `Round ${r} of ${totalRounds} • Turn ${t}`;
  }

  function setSpectrumWords() {
    const bp = Spectrum.state.game.roundSpectrum;
    if (els.left) els.left.textContent = bp?.left ?? "—";
    if (els.right) els.right.textContent = bp?.right ?? "—";
  }

  function setValue(next) {
    value = clamp(Math.round(next), 0, 100);
    if (els.guessValue) els.guessValue.textContent = String(value);

    if (els.track && els.thumb) {
      const trackH = els.track.clientHeight;
      const thumbH = els.thumb.clientHeight;
      const usable = trackH - thumbH;
      const yFromBottom = (value / 100) * usable;
      els.thumb.style.bottom = `${yFromBottom}px`;
    }
  }

  function valueFromPointer(clientY) {
    const rect = els.track.getBoundingClientRect();
    const y = clientY - rect.top;
    const pctFromTop = clamp(y / rect.height, 0, 1);
    const pctFromBottom = 1 - pctFromTop;
    return pctFromBottom * 100;
  }

  function setMarker(el, v) {
    if (!el) return;
    el.style.bottom = `${clamp(v, 0, 100)}%`;
  }

  function buildOverlayGradient(target, difficulty) {
    const d = Number(difficulty || 1);
    const g = 3 * d;
    const y = 5 * d;
    const o = 7 * d;

    const g0 = clamp(target - g, 0, 100);
    const g1 = clamp(target + g, 0, 100);
    const y0 = clamp(target - y, 0, 100);
    const y1 = clamp(target + y, 0, 100);
    const o0 = clamp(target - o, 0, 100);
    const o1 = clamp(target + o, 0, 100);

    const t_o1 = 100 - o1;
    const t_y1 = 100 - y1;
    const t_g1 = 100 - g1;
    const t_g0 = 100 - g0;
    const t_y0 = 100 - y0;
    const t_o0 = 100 - o0;

    return `linear-gradient(to bottom,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${t_o1}%,
      rgba(255,102,0,0.55) ${t_o1}%,
      rgba(255,102,0,0.55) ${t_y1}%,
      rgba(255,255,0,0.55) ${t_y1}%,
      rgba(255,255,0,0.55) ${t_g1}%,
      rgba(0,128,0,0.55) ${t_g1}%,
      rgba(0,128,0,0.55) ${t_g0}%,
      rgba(255,255,0,0.55) ${t_g0}%,
      rgba(255,255,0,0.55) ${t_y0}%,
      rgba(255,102,0,0.55) ${t_y0}%,
      rgba(255,102,0,0.55) ${t_o0}%,
      rgba(0,0,0,0) ${t_o0}%,
      rgba(0,0,0,0) 100%
    )`;
  }

  function showResultOverlay() {
    const target = Spectrum.state.game.currentTurn?.target;
    const bp = Spectrum.state.game.roundSpectrum;
    const difficulty = bp?.difficulty ?? 1;
    if (typeof target !== "number") return;

    // overlay
    if (els.overlay) {
      els.overlay.style.background = buildOverlayGradient(target, difficulty);
      els.overlay.classList.remove("hidden");
    }

    // markers
    if (els.targetMarker) {
      setMarker(els.targetMarker, target);
      els.targetMarker.classList.remove("hidden");
    }
    if (els.guessMarker) {
      setMarker(els.guessMarker, value);
      els.guessMarker.classList.remove("hidden");
    }

// score
const guess = value;
const team = Spectrum.getActiveTeam();
let award = 0;

if (Spectrum.state.game.currentTurn) {
  Spectrum.state.game.currentTurn.guess = guess;
}

if (team) {
  const tid = team.id;
  Spectrum.state.game.scoreByTeamId ||= {};
  Spectrum.state.game.roundScoresByTeamId ||= {};

  if (Spectrum.state.game.roundType === "wager") {
    // WAGER ROUND: special rules
    award = Spectrum.resolveWagerTurn({
      teamId: tid,
      target,
      guess
    });
  } else {
    // STANDARD ROUND
    award = computeAward(target, guess, difficulty);
    Spectrum.state.game.scoreByTeamId[tid] =
      (Spectrum.state.game.scoreByTeamId[tid] || 0) + award;
    Spectrum.state.game.roundScoresByTeamId[tid] =
      (Spectrum.state.game.roundScoresByTeamId[tid] || 0) + award;
  }

  Spectrum.state.game.currentTurn.award = award;
}

    // numbers row
    if (els.targetValue) els.targetValue.textContent = String(target);
    if (els.guessValueFinal) els.guessValueFinal.textContent = String(guess);
    if (els.awardValue) els.awardValue.textContent = `+${award}`;
    els.resultRow?.classList.remove("hidden");
    // Hide the draggable thumb after submit (reduces clutter)
    els.thumb?.classList.add("hidden");

    revealed = true;
    els.submitBtn?.classList.add("hidden");
    els.nextBtn?.classList.remove("hidden");
  }

  function hideResultOverlay() {
    revealed = false;
    // Restore thumb for the next guess
    els.thumb?.classList.remove("hidden");
    els.overlay?.classList.add("hidden");
    els.targetMarker?.classList.add("hidden");
    els.guessMarker?.classList.add("hidden");
    els.resultRow?.classList.add("hidden");
    els.submitBtn?.classList.remove("hidden");
    els.nextBtn?.classList.add("hidden");
  }

  function bindSlider() {
    if (!els.track) return;

    const onDown = (e) => {
      if (revealed) return;
      e.preventDefault();
      dragging = true;
      els.track.setPointerCapture?.(e.pointerId);
      setValue(valueFromPointer(e.clientY));
    };

    const onMove = (e) => {
      if (!dragging || revealed) return;
      e.preventDefault();
      setValue(valueFromPointer(e.clientY));
    };

    const onUp = () => {
      dragging = false;
    };

    els.track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

 function bindButtons() {
  els.backBtn?.addEventListener("click", () => {
    Spectrum.showScreen("preturn");
    Spectrum.screens.preturn.render();
  });

  els.submitBtn?.addEventListener("click", () => {
    showResultOverlay();
  });

  els.nextBtn?.addEventListener("click", () => {
    hideResultOverlay();

    Spectrum.advanceTurn();
    console.log(
      "POST advanceTurn:",
      Spectrum.state.game.roundType,
      Spectrum.state.game.turnIndex,
      Spectrum.state.game.isFinished
    );

    if (Spectrum.state.game.isFinished) {
      Spectrum.showScreen("final");
      Spectrum.screens.final.render();
      return;
    }

    if (Spectrum.isEnteringWagerSetup && Spectrum.isEnteringWagerSetup()) {
      Spectrum.showScreen("wager");
      Spectrum.screens.wager.render();
    } else {
      Spectrum.showScreen("preturn");
      Spectrum.screens.preturn.render();
    }
  });
}

  function render() {
    if (!Spectrum.state.game.roundSpectrum) Spectrum.pickRoundSpectrum?.();
    setTagline();
    setTeamUI();
    setSpectrumWords();
    hideResultOverlay();
    setValue(50);
  }

  function init() {
    cache();
    bindSlider();
    bindButtons();
  }

  return { init, render };
})();

