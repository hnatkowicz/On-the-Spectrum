// screen-wager.js — Wager setup screen
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.wager = (function () {
  const els = {};

  function cache() {
    els.list = document.getElementById("wager-list");
    els.warn = document.getElementById("wager-warning");
    els.backBtn = document.getElementById("wager-back-btn");
    els.startBtn = document.getElementById("wager-start-btn");
  }

  function teamDotClass(colorKey) {
    const k = colorKey || "blue";
    if (k === "green") return "wager-dot--green";
    if (k === "yellow") return "wager-dot--yellow";
    if (k === "orange") return "wager-dot--orange";
    return "wager-dot--blue";
  }

  function render() {
    if (!els.list) return;
    els.list.innerHTML = "";

    const teams = Spectrum.state.teams || [];
    const totals = Spectrum.state.game.scoreByTeamId || {};
    const wagers = Spectrum.state.game.wagersByTeamId || {};

    for (const team of teams) {
      const total = totals[team.id] || 0;

      const row = document.createElement("div");
      row.className = "wager-row";

      const left = document.createElement("div");
      left.className = "wager-row__left";

      const nameLine = document.createElement("div");
      nameLine.className = "wager-row__team";

      const dot = document.createElement("span");
      dot.className = `wager-dot ${teamDotClass(team.colorKey)}`;
      dot.setAttribute("aria-hidden", "true");

      const nameText = document.createElement("span");
      nameText.textContent = ` ${team.name}`;

      nameLine.appendChild(dot);
      nameLine.appendChild(nameText);

      const scoreLine = document.createElement("div");
      scoreLine.className = "wager-row__score";
      scoreLine.textContent = `Total points: ${total}`;

      left.appendChild(nameLine);
      left.appendChild(scoreLine);

      const right = document.createElement("div");
      right.className = "wager-inputwrap";

      const input = document.createElement("input");
      input.className = "wager-input";
      input.type = "number";
      input.min = "0";
      input.max = String(total);
      input.step = "1";
      input.inputMode = "numeric";
      input.value = String(wagers[team.id] ?? Math.min(0, total));
      input.setAttribute("data-teamid", team.id);

      input.addEventListener("input", () => {
        const raw = input.value;
        const n = raw === "" ? 0 : Number(raw);
        Spectrum.state.game.wagersByTeamId[team.id] = n;
        validate(); // live validation
      });

      right.appendChild(input);

      row.appendChild(left);
      row.appendChild(right);
      els.list.appendChild(row);
    }

    validate();
  }

  function validate() {
    const teams = Spectrum.state.teams || [];
    const totals = Spectrum.state.game.scoreByTeamId || {};
    const wagers = Spectrum.state.game.wagersByTeamId || {};

    let ok = true;

    const inputs = els.list?.querySelectorAll(".wager-input") || [];
    inputs.forEach((inp) => inp.classList.remove("wager-input--bad"));

    for (const team of teams) {
      const total = totals[team.id] || 0;
      const w = Number(wagers[team.id] ?? 0);

      const bad = !Number.isFinite(w) || w < 0 || w > total;

      const input = els.list?.querySelector(`.wager-input[data-teamid="${team.id}"]`);
      if (bad && input) input.classList.add("wager-input--bad");

      if (bad) ok = false;
    }

    els.warn?.classList.toggle("hidden", ok);
    if (els.startBtn) els.startBtn.disabled = !ok;
    return ok;
  }

  function bind() {
    els.backBtn?.addEventListener("click", () => {
      // Back to the last slider result or preturn; simplest: preturn
      Spectrum.showScreen("preturn");
      Spectrum.screens.preturn.render();
    });

    els.startBtn?.addEventListener("click", () => {
      if (!validate()) return;

      Spectrum.startWagerRound();
      Spectrum.showScreen("preturn");
      Spectrum.screens.preturn.render();
    });
  }

  function init() {
    cache();
    bind();
  }

  return { init, render };
})();
