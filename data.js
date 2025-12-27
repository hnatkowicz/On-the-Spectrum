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
    { id: "bp_rich_poor", categoryId: "everyday", left: "Rich", right: "Poor", difficulty: 1.0 },
    { id: "bp_casual_formal", categoryId: "everyday", left: "Formal", right: "Casual", difficulty: 1.0 },
    { id: "bp_chaotic_orderly", categoryId: "everyday", left: "Orderly", right: "Chaotic", difficulty: 1.1 },
    { id: "bp_red_green_flag", categoryId: "everyday", left: "Green Flag", right: "Red Flag", difficulty: 1.1 },
    { id: "bp_blessed_cursed", categoryId: "weird", left: "Blessed", right: "Cursed", difficulty: 1.9 },
    { id: "bp_main_character_npc", categoryId: "weird", left: "Main Character", right: "NPC", difficulty: 1.3 },
    { id: "bp_old_young", categoryId: "everyday", left: "Elderly", right: "Infant", difficulty: 1.1 },
    { id: "bp_pro_am", categoryId: "everyday", left: "Professional", right: "Amateur", difficulty: 1.1 },
    { id: "bp_villain_hero", categoryId: "spicy", left: "Hero", right: "Villain", difficulty: 1.2 },
    { id: "bp_liberal_conservation", categoryId: "spicy", left: "Liberal", right: "Conservative", difficulty: 1.2 },
    { id: "bp_hot_take_safe_take", categoryId: "spicy", left: "Hot Take", right: "Safe Take", difficulty: 1.3 },
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
  // distance thresholds
  winWithin: 2,      // <= this: win
  neutralWithin: 4,  // <= this: neutral (but > winWithin)

  // payouts
  winAwardFactor: 1,           // +W * factor (1 means “+W”)
  losePenaltyDivisor: 2,       // lose ceil(W/divisor)
  losePenaltyRounding: "ceil", // "ceil" or "floor"
};

