// screen-players.js (chips/bubbles) — robust against missing DOM elements
window.Spectrum = window.Spectrum || {};
Spectrum.screens = Spectrum.screens || {};

Spectrum.screens.players = (function () {
  const els = {};
  let lastNoticeTimer = null;
  let ready = false;

  function mustGet(id) {
    const el = document.getElementById(id);
    if (!el) console.error(`[Spectrum] Missing element #${id} on players screen.`);
    return el;
  }

  function cache() {
    els.backBtn = mustGet("back-btn");
    els.playersContinueBtn = mustGet("players-continue-btn");

    els.bankList = mustGet("bank-list");
    els.selectedList = mustGet("selected-list");

    els.addForm = mustGet("add-player-form");
    els.newPlayerInput = mustGet("new-player");

    els.minRequired = mustGet("min-required");
    els.minCount = mustGet("min-count");
    els.selectedCount = mustGet("selected-count");
    els.minWarning = mustGet("min-warning");

    ready = Boolean(
      els.backBtn &&
      els.playersContinueBtn &&
      els.bankList &&
      els.selectedList &&
      els.addForm &&
      els.newPlayerInput
    );

    if (!ready) {
      console.error("[Spectrum] Players screen init failed: required elements missing.");
      return;
    }

    // Inject notice under form if missing
    if (!document.getElementById("player-notice")) {
      const notice = document.createElement("div");
      notice.id = "player-notice";
      notice.className = "notice hidden";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");
      els.addForm.insertAdjacentElement("afterend", notice);
    }
    els.notice = document.getElementById("player-notice");
  }

  function showNotice(msg) {
    if (!ready || !els.notice) return;
    els.notice.textContent = msg;
    els.notice.classList.remove("hidden");

    if (lastNoticeTimer) clearTimeout(lastNoticeTimer);
    lastNoticeTimer = setTimeout(() => {
      els.notice.classList.add("hidden");
    }, 2600);
  }

  function ensureChipContainers() {
    if (!ready) return;
    els.bankList.classList.add("chips");
    els.selectedList.classList.add("chips");
  }

  function renderBank() {
    els.bankList.innerHTML = "";

    const bank = Spectrum.state.playerBank;
    if (bank.length === 0) {
      const empty = document.createElement("div");
      empty.className = "fineprint";
      empty.textContent = "Your bank is empty. Add a few names to get started.";
      els.bankList.appendChild(empty);
      return;
    }

    for (const name of bank) {
      const selected = Spectrum.isSelected(name);

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip chip--bank";
      chip.textContent = name;

      if (selected) {
        chip.classList.add("chip--selected");
        chip.disabled = true; // remove from Current to re-enable
        chip.setAttribute("aria-disabled", "true");
      } else {
        chip.addEventListener("click", () => {
          Spectrum.addToSelected(name);
          render();
        });
      }

      els.bankList.appendChild(chip);
    }
  }

  function renderCurrent() {
    els.selectedList.innerHTML = "";

    const current = Spectrum.state.selectedPlayers;
    if (current.length === 0) {
      const empty = document.createElement("div");
      empty.className = "fineprint";
      empty.textContent = "No players selected yet. Tap names above to add them.";
      els.selectedList.appendChild(empty);
      return;
    }

    for (const name of current) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip chip--current";
      chip.textContent = name;

      chip.addEventListener("click", () => {
        Spectrum.removeFromSelected(name);
        render();
      });

      els.selectedList.appendChild(chip);
    }
  }

  function render() {
    if (!ready) return;

    ensureChipContainers();

    const min = Spectrum.minPlayersRequired();
    const selectedCount = Spectrum.state.selectedPlayers.length;

    if (els.minRequired) els.minRequired.textContent = String(min);
    if (els.minCount) els.minCount.textContent = String(min);
    if (els.selectedCount) els.selectedCount.textContent = String(selectedCount);

    renderBank();
    renderCurrent();

    const ok = selectedCount >= min;
    els.playersContinueBtn.disabled = !ok;
    if (els.minWarning) els.minWarning.classList.toggle("hidden", ok);
  }

  function bind() {
    if (!ready) return;

    els.backBtn.addEventListener("click", () => {
      Spectrum.showScreen("setup");
    });

    els.addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const names = Spectrum.parseNames(els.newPlayerInput.value);
      if (names.length === 0) return;

      const duplicates = [];
      let addedAny = false;

      for (const n of names) {
        const exists = Spectrum.state.playerBank.some(
          (p) => Spectrum.nameKey(p) === Spectrum.nameKey(n)
        );

        if (!exists) {
          Spectrum.addToBank(n);
          addedAny = true;
        } else {
          duplicates.push(n);
        }

        // Add to current regardless
        Spectrum.addToSelected(n);
      }

      els.newPlayerInput.value = "";
      els.newPlayerInput.focus();
      render();

      if (duplicates.length > 0) {
        const preview = duplicates.slice(0, 3).join(", ");
        const more = duplicates.length > 3 ? ` (+${duplicates.length - 3} more)` : "";
        showNotice(`Already in bank: ${preview}${more}`);
      } else if (addedAny && names.length > 1) {
        showNotice(`Added ${names.length} players.`);
      }
    });

    // ✅ This is the corrected Continue handler
    els.playersContinueBtn.addEventListener("click", () => {
      Spectrum.showScreen("teams");
      Spectrum.screens.teams.render();
    });
  }

  function focusInput() {
    if (!ready) return;
    els.newPlayerInput?.focus();
  }

  function init() {
    cache();
    bind();
    render();
  }

  return { init, render, focusInput };
})();
