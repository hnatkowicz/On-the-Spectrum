// data.js — content only (categories, boundary pairs, team name words, etc.)
window.Spectrum = window.Spectrum || {};

Spectrum.data = {
  categories: [
    { id: "all", label: "All (Random)" },
    { id: "everyday", label: "Everyday" },
    { id: "spicy", label: "Spicy" },
    { id: "weird", label: "Weird" },
  ],

  // Team colors (used for persistent team identity)
  teamColors: [
    { key: "blue", label: "Blue", cssVar: "--blue" },
    { key: "green", label: "Green", cssVar: "--green" },
    { key: "yellow", label: "Yellow", cssVar: "--yellow" },
    { key: "orange", label: "Orange", cssVar: "--orange" },
  ],

  boundaryPairs: [
    { id: "bp_rich_poor", categoryId: "everyday", left: "Rich", right: "Poor", difficulty: 1.5 },
    { id: "bp_casual_formal", categoryId: "everyday", left: "Formal", right: "Casual", difficulty: 1.0 },
    { id: "bp_chaotic_orderly", categoryId: "everyday", left: "Orderly", right: "Chaotic", difficulty: 1.2 },
    { id: "bp_red_green_flag", categoryId: "everyday", left: "Green Flag", right: "Red Flag", difficulty: 1.1 },
    { id: "bp_quirky_creepy", categoryId: "weird", left: "Quirky", right: "Creepy", difficulty: 1.9 },
    { id: "bp_main_character_npc", categoryId: "weird", left: "Main Character", right: "NPC", difficulty: 1.3 },
    { id: "bp_old_young", categoryId: "everyday", left: "Elderly", right: "Infant", difficulty: 1.1 },
    { id: "bp_pro_am", categoryId: "everyday", left: "Professional", right: "Amateur", difficulty: 1.1 },
    { id: "bp_villain_hero", categoryId: "spicy", left: "Hero", right: "Villain", difficulty: 1.2 },
    { id: "bp_liberal_conservation", categoryId: "spicy", left: "Liberal", right: "Conservative", difficulty: 1.4 },
    { id: "bp_hot_take_safe_take", categoryId: "spicy", left: "Hot Take", right: "Safe Take", difficulty: 1.3 },
    { id: "bp_strong_weak", categoryId: "spicy", left: "Strong", right: "Weak", difficulty: 1.1 },
    { id: "bp_polite_rude", categoryId: "everyday", left: "Polite", right: "Rude", difficulty: 1.1 },
    { id: "bp_intense_chill", categoryId: "everyday", left: "Intense", right: "Chill", difficulty: 1.2 },
    { id: "bp_flirty-harassing", categoryId: "spicy", left: "Flirty", right: "Harassing", difficulty: 1.1 },
    { id: "bp_overrated_underrated", categoryId: "weird", left: "Overrated", right: "Underrated", difficulty: 1.6 },
    { id: "bp_peak_past_prime", categoryId: "weird", left: "Peak", right: "Past Its Prime", difficulty: 1.3 },
    { id: "bp_diva_darling", categoryId: "everyday", left: "Diva", right: "Darling", difficulty: 1.1 },
    { id: "bp_gasp_nod", categoryId: "spicy", left: "Collective Gasp", right: "Polite Nod", difficulty: 1.2 },
    { id: "bp_bold_cautious", categoryId: "spicy", left: "Bold", right: "Cautious", difficulty: 1.1 },
    { id: "bp_comfort_awkward", categoryId: "spicy", left: "Comfortable Silence", right: "Awkward Silence", difficulty: 1.5 },
    { id: "bp_fine_not_ok", categoryId: "spicy", left: "Fine", right: "Not Okay", difficulty: 1.1 },
    { id: "bp_clapping_applause", categoryId: "everyday", left: "Thunderous Clapping", right: "Light Applause", difficulty: 1.1 },
    { id: "bp_polite_rude", categoryId: "everyday", left: "Polite", right: "Rude", difficulty: 1.1 },
  ],

taglines: [
  "Measure your meaning.",
  "Clue. Calibrate. Crush.",
  "Big Clue Energy.",
  "Spot on.",
  "Random targets. Precision guessing.",
  "A range of ideas.",
  "Merry Christmas!",
  "Let's Sliiiiide!",
],

  teamNameWords: {
    adj: ["Sideways", "Neon", "Sexy", "Freakin'", "Brokedown", "Basement", "North Jersey", "Rancid", "Mangled", "Downtown", "Power", "Limping", "Anytime", "Lumpy", "Yellow-bellied", "Silver", "Long-haired", "Perky", "Night Shift", "Crooked", "Unlikely", "Fourth Place", "Sizzling", "Angry", "Bad", "Sloppy", "Drunk", "Uptown", "Soapy", "Shiny", "Bedazzled", "Howlin'", "Hip", "Gassy", "Small Time", "Part Time", "Reverse", "Sweet", "Tangy", "Rotten", "Mustard", "Sideways", "Shallow", "The Largest of the", "True", "False", "Nevermind the", "Almost"],
    noun: ["Nuns", "Dreamers", "Otters", "Pirates", "Robots", "Hippies", "Goblins", "Deuces", "Dawgs", "Comedians", "Flowers", "Ponies", "Clowns", "Daggers", "Chumps", "Kitties", "Door Mats", "Gangstas", "Jocks", "Swingers", "Truckers", "Jumpers", "Singers", "Riders", "Sprayers", "Sisters", "Ballers", "Fruit Bowl", "Growlers", "Lads", "Doodles", "Rebels", "Sleepers", "Razors", "Dingers", "Tally-whackers", "Dukes", "Mice", "Tweakers", "Winners", "Toothpicks", "Butchers", "Friends", "Ideas", "Lovers", "Belgians", "Meanies", "Quitters", "Believers", "Flakes"],
  },
};

Spectrum.data.wagerRules = {
  winWithin: 2,
  neutralWithin: 4,
  winMultiplier: 2,     // double wager
  loseDivisor: 2,       // lose half
  loseRounding: "ceil"
};




