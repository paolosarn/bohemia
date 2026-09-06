// BOHEMIA LADDER DATA -- GENERATED, DO NOT HAND-EDIT (9/6/26, QUESTS lane)
//
// Emitted by tools/bohemia_ladder_data.js from the only two rulers:
//   records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md   (his 53 bosses)
//   records/BOHEMIA_LADDER_GRAPH_8_13_26.json      (his 38 physical edges)
//
// It exists because the walk has to run in a browser and a browser cannot read
// a markdown file. Nobody typed a boss here. gates/ladder_walk_gate.js re-reads
// both sources and compares this field by field, so an edit made here instead of
// there goes red rather than shipping.
//
// draft:true on every row: these are HIS words carried across, not approved
// player-facing copy written by anybody else.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BOSSES = [
 {
  "i": 1,
  "n": "THE POT",
  "holds": "the last sound cookware",
  "lock": "raw and spoiled food cannot be made safe",
  "grant": "cook — **and it is the FIRST boss, played absurdly straight**",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 2,
  "n": "THE TAP",
  "holds": "the pressure, and who is allowed any",
  "lock": "you cannot draw water somebody else owns the pipe for",
  "grant": "draw from any main in the valley, whoever thinks they own it",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 3,
  "n": "THE FILTER",
  "holds": "the last clean-water setup",
  "lock": "you cannot drink what you find without it turning on you",
  "grant": "purify, so any water is water",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 4,
  "n": "THE BURN",
  "holds": "fuel, and who gets warm",
  "lock": "night ends your day, cold sends you home",
  "grant": "light a fire anywhere, so you get the night back",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 5,
  "n": "THE SURVEYOR",
  "holds": "the last complete map",
  "lock": "you only know what you have walked",
  "grant": "**unlock the map**, so the valley stops being a rumour",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 6,
  "n": "THE CLIMB",
  "holds": "the last hoist that lifts",
  "lock": "everything above the ground floor is scenery",
  "grant": "reach roofs, upper floors and towers",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 7,
  "n": "THE LOCKSMITH",
  "holds": "every lock still working",
  "lock": "a locked door cannot be opened quietly",
  "grant": "pick it, kick a cheap one, or take a mould and cut the key at base",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 8,
  "n": "THE CHARGE",
  "holds": "who still has anything that goes off",
  "lock": "a wall is a wall, and a door is the only way in",
  "grant": "blow a permanent hole where YOU choose, with improvised demolition charges",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 9,
  "n": "THE MACHINIST",
  "holds": "the pipe, the cap and the nail",
  "lock": "a firearm is something you FIND, never something you make",
  "grant": "weld pipe weapons, crude and yours",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 10,
  "n": "THE PLATE",
  "holds": "the last press brake",
  "lock": "nothing you own can be armoured",
  "grant": "press scrap into armour that stops something",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 11,
  "n": "THE TOOTH",
  "holds": "the only working dental kit",
  "lock": "a bad tooth cannot be fixed, only endured",
  "grant": "**fix a tooth** — main-quest weight, on his ruling",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 12,
  "n": "THE LENS",
  "holds": "the last ground glass",
  "lock": "you cannot see detail, near or far",
  "grant": "correct your sight, and grind what you need to see with",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 13,
  "n": "THE BARBER",
  "holds": "the chair, the blade, the bleach",
  "lock": "you cannot choose how you look",
  "grant": "shave, bleach and fade, at the cost of real materials",
  "kind": "LOOK",
  "act": 1
 },
 {
  "i": 14,
  "n": "THE INK",
  "holds": "the last needles and pigment",
  "lock": "nothing on you says who you are by choice",
  "grant": "mark yourself permanently, and others read it",
  "kind": "LOOK",
  "act": 1
 },
 {
  "i": 15,
  "n": "THE DOGS",
  "holds": "the last kennel in the valley",
  "lock": "you cannot watch and sleep at the same time",
  "grant": "take a dog: it walks with you, or it holds your gate",
  "kind": "PEOPLE",
  "act": 1
 },
 {
  "i": 16,
  "n": "THE WARD",
  "holds": "the last clinic, and what is left in it",
  "lock": "a wound you cannot treat is a death",
  "grant": "treat and dose, so a bad day stops being the last one",
  "kind": "PEOPLE",
  "act": 1
 },
 {
  "i": 17,
  "n": "THE CISTERN",
  "holds": "every roof worth catching rain off",
  "lock": "you cannot get water without asking somebody who owns it",
  "grant": "**catch the monsoon off the rooftops, and stop asking anybody for water**",
  "kind": "WORLD",
  "act": 1
 },
 {
  "i": 18,
  "n": "THE SMITH",
  "holds": "the last forge that still lights",
  "lock": "you cannot make anything at home, only carry what you found",
  "grant": "run a **WORKSHOP** at base: scrap becomes resource currency, weapons get customised",
  "kind": "GEAR",
  "act": 1
 },
 {
  "i": 19,
  "n": "THE MIDWIFE",
  "holds": "every birth in the valley",
  "lock": "nothing guarantees the line continues",
  "grant": "**bring a birth through — AND THIS CLOSES ACT 1**",
  "kind": "PEOPLE",
  "act": 1
 },
 {
  "i": 20,
  "n": "THE SOIL",
  "holds": "the golf courses, irrigation already in the ground",
  "lock": "your population is capped by food",
  "grant": "farm the fairways: strip-fields on the dogleg ghosts, greens as seedbeds",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 21,
  "n": "THE SEED",
  "holds": "what was saved from before",
  "lock": "this year's crop cannot become next year's",
  "grant": "save seed, so a harvest repeats without you finding one",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 22,
  "n": "THE VAT",
  "holds": "the surviving bioreactors",
  "lock": "protein cannot be produced at all, only hunted or traded for",
  "grant": "**culture protein at volume: it feeds a city, and real meat becomes a luxury**",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 23,
  "n": "THE COLD",
  "holds": "the last compressor",
  "lock": "nothing perishable can be kept at all",
  "grant": "chill meat, medicine and culture, which no granary can hold",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 24,
  "n": "THE DRAIN",
  "holds": "where the waste goes",
  "lock": "a filthy district's population cap is ZERO",
  "grant": "clear the filth, so a settler will accept a bed there",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 25,
  "n": "THE PUMP",
  "holds": "the last pressure set",
  "lock": "water cannot reach above the ground floor",
  "grant": "pressurise, so a tall building can be lived in",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 26,
  "n": "THE LIGHTS",
  "holds": "a lit block",
  "lock": "the dark belongs to whoever owns the light",
  "grant": "switch on any street in the valley",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 27,
  "n": "THE QUARRY",
  "holds": "the pit and what comes out of it",
  "lock": "stone cannot be had faster than one armful at a time",
  "grant": "cut raw material at scale",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 28,
  "n": "THE GLASS",
  "holds": "the last float line and annealer",
  "lock": "a window cannot be made, only found intact or gone without",
  "grant": "make flat glass, so buildings seal and light",
  "kind": "GEAR",
  "act": 2
 },
 {
  "i": 29,
  "n": "THE LOOM",
  "holds": "the last working looms",
  "lock": "cloth cannot be made, only cut down from what exists",
  "grant": "weave, so cloth stops running out",
  "kind": "GEAR",
  "act": 2
 },
 {
  "i": 30,
  "n": "THE CRACKER",
  "holds": "the pyrolysis plant",
  "lock": "fuel cannot be replaced once it is siphoned",
  "grant": "**crack the city's plastic into diesel, at volume**",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 31,
  "n": "THE CHEMIST",
  "holds": "the last of the reagents",
  "lock": "adhesive, solvent, fertiliser, catalyst and primers cannot be made",
  "grant": "mix chemistry, so ammunition, glue and **good** fuel exist",
  "kind": "GEAR",
  "act": 2
 },
 {
  "i": 32,
  "n": "THE POUR",
  "holds": "the last working batch plant",
  "lock": "a building cannot be improved past the condition you found it in",
  "grant": "**UPGRADE buildings, and put up advanced ones that were impossible before**",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 33,
  "n": "THE FOREMAN",
  "holds": "the working hands",
  "lock": "nothing gets built unless you are standing there",
  "grant": "put crews to work while you are elsewhere",
  "kind": "PEOPLE",
  "act": 2
 },
 {
  "i": 34,
  "n": "THE ROAD",
  "holds": "the chokepoints, and who taxes each one",
  "lock": "the map is cut into pieces nothing can drive between",
  "grant": "reopen a through-route — **and the route stays open only if it is held**",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 35,
  "n": "THE WALL",
  "holds": "the barriers and where they stand",
  "lock": "you cannot hold ground you are not standing on",
  "grant": "fortify, so a place stays yours while you are away",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 36,
  "n": "THE BONES",
  "holds": "the cemetery",
  "lock": "the dead leave nothing behind",
  "grant": "bury them properly, so the living have a reason to stay",
  "kind": "LOOK",
  "act": 2
 },
 {
  "i": 37,
  "n": "THE PRESS",
  "holds": "the last printing press",
  "lock": "nothing you decide outlives you saying it",
  "grant": "print, so a rule becomes a thing that exists — **and cannot be scraped**",
  "kind": "LOOK",
  "act": 2
 },
 {
  "i": 38,
  "n": "THE SURGEON",
  "holds": "the last theatre that still works",
  "lock": "a body cannot be repaired beyond bandaging",
  "grant": "operate, so people survive what used to end them",
  "kind": "PEOPLE",
  "act": 2
 },
 {
  "i": 39,
  "n": "THE ENGINE",
  "holds": "the last vehicle that runs",
  "lock": "the valley is too big to cross, even mounted",
  "grant": "**drive** — and act 2 ends the moment you do",
  "kind": "WORLD",
  "act": 2
 },
 {
  "i": 40,
  "n": "THE RAIL",
  "holds": "the railyard and what still rolls",
  "lock": "freight cannot move faster than one truck",
  "grant": "move freight at scale — **and it buys you standing as the valley's de facto mayor**",
  "kind": "WORLD",
  "act": 3
 },
 {
  "i": 41,
  "n": "THE DAM",
  "holds": "the dam, running at a fraction of its 2GW",
  "lock": "the valley cannot stop rationing POWER",
  "grant": "**restore it to full**, and the power rationing ends",
  "kind": "WORLD",
  "act": 3
 },
 {
  "i": 42,
  "n": "THE GRID",
  "holds": "the whole network",
  "lock": "power is local, and a district lives or dies alone",
  "grant": "feed power to any district you choose",
  "kind": "WORLD",
  "act": 3
 },
 {
  "i": 43,
  "n": "THE LINE",
  "holds": "the last assembly line",
  "lock": "nothing can be made twice exactly the same",
  "grant": "manufacture MANY of one thing, identically",
  "kind": "GEAR",
  "act": 3
 },
 {
  "i": 44,
  "n": "THE BOARD",
  "holds": "the last of the components",
  "lock": "a circuit cannot be made, only cannibalised",
  "grant": "fabricate electronics, so new machines are possible",
  "kind": "GEAR",
  "act": 3
 },
 {
  "i": 45,
  "n": "THE LIFT",
  "holds": "the last elevators with cable on them",
  "lock": "a tall building is only as useful as its stairs",
  "grant": "raise people and loads, so height becomes usable",
  "kind": "WORLD",
  "act": 3
 },
 {
  "i": 46,
  "n": "THE TOWER",
  "holds": "the cranes",
  "lock": "you cannot change the skyline",
  "grant": "build UP, and change what the valley looks like from anywhere in it",
  "kind": "LOOK",
  "act": 3
 },
 {
  "i": 47,
  "n": "THE HOUSE",
  "holds": "the last floor that still takes a bet",
  "lock": "the valley has no economy anybody outside would join",
  "grant": "deal again, and Vegas earns the way Vegas earned",
  "kind": "LOOK",
  "act": 3
 },
 {
  "i": 48,
  "n": "THE MARQUEE",
  "holds": "the lights on the Strip",
  "lock": "arrivals are a trickle you cannot influence",
  "grant": "**turn the lights on and the trickle becomes a stream**",
  "kind": "LOOK",
  "act": 3
 },
 {
  "i": 49,
  "n": "THE WING",
  "holds": "the airfield and the one airframe",
  "lock": "you cannot leave the valley, or see it whole",
  "grant": "fly, and the valley stops being the world",
  "kind": "WORLD",
  "act": 3
 },
 {
  "i": 50,
  "n": "THE SCHOOL",
  "holds": "who gets taught",
  "lock": "your heir cannot inherit anything you learned",
  "grant": "teach, so an heir starts with what you knew",
  "kind": "PEOPLE",
  "act": 3
 },
 {
  "i": 51,
  "n": "THE CREDITOR",
  "holds": "every favour anybody still owes",
  "lock": "some things one person cannot do at all",
  "grant": "**call a debt in: somebody arrives and does it**",
  "kind": "PEOPLE",
  "act": 3
 },
 {
  "i": 52,
  "n": "THE IMPLANT",
  "holds": "the first working cyberware in the valley",
  "lock": "a body is only what you were born with",
  "grant": "fit chrome — **and whoever supplied it knows where you are**",
  "kind": "GEAR",
  "act": 3
 },
 {
  "i": 53,
  "n": "THE UPLINK",
  "holds": "the one antenna reaching something bigger",
  "lock": "nothing outside the valley can reach you, which is why you are safe",
  "grant": "reconnect the valley — **and something answers**",
  "kind": "WORLD",
  "act": 3
 }
];
  var EDGES = [
 {
  "to": "THE SMITH",
  "from": "THE BURN",
  "why": "a forge that still lights cannot light without fire"
 },
 {
  "to": "THE MACHINIST",
  "from": "THE BURN",
  "why": "you cannot weld pipe, cap and nail together without heat"
 },
 {
  "to": "THE PRESS",
  "from": "THE MACHINIST",
  "why": "a press frame and its type are machine-shop work before they are printing"
 },
 {
  "to": "THE CISTERN",
  "from": "THE CLIMB",
  "why": "every roof worth catching rain off is above the ground floor, and before THE CLIMB everything up there is scenery"
 },
 {
  "to": "THE SURGEON",
  "from": "THE WARD",
  "why": "you cannot operate on a body you cannot yet treat and dose"
 },
 {
  "to": "THE MIDWIFE",
  "from": "THE WARD",
  "why": "a birth that goes wrong is a wound, and an untreatable wound is a death"
 },
 {
  "to": "THE QUARRY",
  "from": "THE CHARGE",
  "why": "you do not open a pit by hand; it takes something that goes off"
 },
 {
  "to": "THE FOREMAN",
  "from": "THE SMITH",
  "why": "the workshop is the first thing you own that keeps working while you are not there, which is the whole idea of a crew"
 },
 {
  "to": "THE SOIL",
  "from": "THE FOREMAN",
  "why": "GDD v5 says water is not the binding constraint, soil and LABOR are, so farming the fairways is a labour unlock"
 },
 {
  "to": "THE SEED",
  "from": "THE SOIL",
  "why": "you cannot save seed before there is a crop to save it from"
 },
 {
  "to": "THE COLD",
  "from": "THE LIGHTS",
  "why": "a compressor does not run without power on the block"
 },
 {
  "to": "THE VAT",
  "from": "THE COLD",
  "why": "THE COLD's own row names culture as a thing only it can hold, and a bioreactor at volume is culture"
 },
 {
  "to": "THE PUMP",
  "from": "THE TAP",
  "why": "you cannot pressurise a main that has nothing in it"
 },
 {
  "to": "THE CRACKER",
  "from": "THE CHEMIST",
  "why": "his own lore ruling: act 1 pyrolysis is crude and low-yield, and mass production waits on the catalyst"
 },
 {
  "to": "THE POUR",
  "from": "THE QUARRY",
  "why": "concrete is aggregate, and aggregate comes out of the pit"
 },
 {
  "to": "THE GLASS",
  "from": "THE QUARRY",
  "why": "flat glass is melted sand"
 },
 {
  "to": "THE WALL",
  "from": "THE QUARRY",
  "why": "a barrier is material before it is a position"
 },
 {
  "to": "THE ROAD",
  "from": "THE WALL",
  "why": "the ladder already pairs them: a cleared route stays open only if it is held"
 },
 {
  "to": "THE ENGINE",
  "from": "THE ROAD",
  "why": "a car cannot cross a map cut into pieces nothing can drive between"
 },
 {
  "to": "THE ENGINE",
  "from": "THE CRACKER",
  "why": "nothing drives without fuel, and fuel cannot be replaced once it is siphoned"
 },
 {
  "to": "THE RAIL",
  "from": "THE ENGINE",
  "why": "freight at scale is the vehicle problem solved a second time, bigger"
 },
 {
  "to": "THE DAM",
  "from": "THE POUR",
  "why": "you do not restore a dam without a working batch plant"
 },
 {
  "to": "THE DAM",
  "from": "THE FOREMAN",
  "why": "one person standing there does not bring 2GW back"
 },
 {
  "to": "THE GRID",
  "from": "THE DAM",
  "why": "you cannot distribute power you are still rationing"
 },
 {
  "to": "THE LIFT",
  "from": "THE GRID",
  "why": "an elevator that loses power is a shaft"
 },
 {
  "to": "THE LINE",
  "from": "THE GRID",
  "why": "an assembly line is a power draw before it is a process"
 },
 {
  "to": "THE BOARD",
  "from": "THE LINE",
  "why": "a circuit is precisely the thing you must make many of, identically"
 },
 {
  "to": "THE TOWER",
  "from": "THE POUR",
  "why": "you cannot build UP without concrete"
 },
 {
  "to": "THE TOWER",
  "from": "THE LIFT",
  "why": "a tower nobody can get up is not a building"
 },
 {
  "to": "THE MARQUEE",
  "from": "THE GRID",
  "why": "the Strip is a district, and lighting it is distribution"
 },
 {
  "to": "THE HOUSE",
  "from": "THE MARQUEE",
  "why": "a floor that takes a bet needs somebody standing at it"
 },
 {
  "to": "THE IMPLANT",
  "from": "THE SURGEON",
  "why": "the ladder already says a theatre that can operate is what makes an implant thinkable"
 },
 {
  "to": "THE IMPLANT",
  "from": "THE BOARD",
  "why": "chrome is electronics before it is surgery"
 },
 {
  "to": "THE UPLINK",
  "from": "THE BOARD",
  "why": "an antenna reaching something bigger is a radio you had to fabricate"
 },
 {
  "to": "THE UPLINK",
  "from": "THE GRID",
  "why": "a transmitter that size is a load, not a battery job"
 },
 {
  "to": "THE WING",
  "from": "THE CRACKER",
  "why": "an airframe burns fuel and there is no other source of it"
 },
 {
  "to": "THE CREDITOR",
  "from": "THE PRESS",
  "why": "a debt you cannot produce in writing is a rumour"
 },
 {
  "to": "THE SCHOOL",
  "from": "THE PRESS",
  "why": "teaching past your own voice needs something that outlives the telling"
 }
];
  BOSSES.forEach(function (b) { b.draft = true; });
  var API = { BOSSES: BOSSES, EDGES: EDGES, count: BOSSES.length, edgeCount: EDGES.length };
  if (HASREQ) module.exports = API; else root.BohemiaLadderData = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
