// app.js — bootstraps Spectrum
window.Spectrum = window.Spectrum || {};

(function initSpectrum() {
  Spectrum.loadBank();
  Spectrum.showScreen("setup");

  Spectrum.screens.setup.init();
  Spectrum.screens.players.init();
  Spectrum.screens.teams.init();
  Spectrum.screens.preturn.init();
  Spectrum.screens.slider.init();
  Spectrum.screens.wager.init();
  Spectrum.screens.final.init();
  Spectrum.screens.players.render();
})();
