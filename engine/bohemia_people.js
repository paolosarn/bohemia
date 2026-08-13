// BOHEMIA PEOPLE — the identity layer (7/31/26, PEOPLE lane)
//
// THE HOLE THIS FILLS, in Paolo's coordinator's words (records/BOHEMIA_THE_BIG_
// MISSING_7_29_26.md, item 6): "28 scheduled bodies walk the block; none has a
// name, a face bound to a schedule, a memory, or anything to say."
//
// THE ONE DISTINCTION THE WHOLE MODULE HANGS OFF:
//   an AGENT is a BODY.     Where it is standing, what it is doing this minute.
//   a  PERSON is an IDENTITY. Who that is, forever.
// bohemia_agents.js owns the body. Nothing owned the identity, so there was
// nobody to remember. And the body is DISPOSABLE by design: the run's own
// applyBlob() throws every agent away on load and rebuilds them from the seed
// (`agentsForBlock(SEED,feet,[],fpOf)` then re-steps to the saved turn). So an
// identity STORED on an agent dies every time the player loads a save.
//   THEREFORE: identity is DERIVED, never stored. Same three numbers the body
//   is derived from — (blockSeed, house, slot) — resolve to the same person on
//   any device, on any load, forever. Persistence with nothing persisted.
//
// YOU HAVE TO ASK (Paolo 7/31, LOCKED — laws/BOHEMIA_ADDENDUM_YOU_HAVE_TO_ASK_
// 7_31_26.md). "Nobody will have a name unless you talk to them and ask them for
// their name... I hate how in other games you know everyone's name off the bat
// and I think it's complete bullshit... once you ask their name, if you see them
// again, then they would be named."
//   THIS SUPERSEDED THIS FILE'S OWN FIRST DESIGN, which shipped hours earlier
//   asserting the opposite: no names anywhere, ever, and a gate that swept this
//   module for a name bank. That was the correct read of the standing rule at the
//   time (bohemia_agents.js:24, "character names are Paolo's") and it is simply
//   not the law any more. A GATE MUST NEVER OUTRANK A RULING, so the gate was
//   rewritten in the same turn rather than the ruling being worked around.
//
// LAWS THIS OBEYS:
//   MECHANISM-MINE / CONTENTS-PAOLO'S — what the machine may do is GENERATE the
//     name a stranger gives you when asked. What it may never do is decide who
//     the STORY people are: KNOWN_AT_START ships EMPTY, LINES ships EMPTY, and
//     people_gate.js fails if either gains a row. The realistic way that breaks
//     is not malice — it is a future session adding "a couple of placeholder
//     names so it can be tested" and the placeholder becoming canon by shipping.
//   A NAME IS EARNED, NEVER GIVEN — nameOf() returns null for a stranger no
//     matter what pool exists, and headingOf() falls back to the engine's OWN
//     four role words until the player has actually asked.
//   THE RIG IS LAW / SHADOWS ARE SEPARATE — no body is defined here. A person
//     carries a lookSeed, and the lookSeed IS the agent's own seed, so the
//     walking body is byte-for-byte unchanged and the PORTRAIT moves onto the
//     body rather than the body moving onto the portrait. (See LOOK ALIGNMENT.)
//   120 BPM / I-MOVE-YOU-MOVE — no clock is read here. A card is rendered FOR a
//     turn the caller passes in; this module never asks what time it is.
//
// LOOK ALIGNMENT, and the honest version of it:
//   The alpha bakes the run's cast so that portraits.looks[i] is the face of the
//   body looks[i] — same index, one person (alpha 5731-5737). The QUEST speaker
//   was already correct: the run draws its body AND its portrait off the same
//   NPC_LOOK_SEED, so that face has always matched that body. The hole is the
//   other 28: every scheduled body already carries its own look
//   (looks[agent.seed % n], run slice 1638) and there was no portrait path to
//   them at all, because there was no way to talk to one. person.lookSeed IS
//   agent.seed, so a scheduled person's portrait lands on the body you actually
//   walked up to — the same way the quest speaker's already did.
//   AND THE BODY ITSELF WAS BROKEN, which the gate found on its first run: only
//   three of the six baked townsfolk looks could ever appear. See mix32 below —
//   that is the measurement, the root cause, and why the fix is here and not in
//   bohemia_agents.js.
//
// No render, no DOM. Runs in node (gate) and in the browser (the run).
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  // ---- DETERMINISM ---------------------------------------------------------
  // The SAME mixer bohemia_agents.js uses, deliberately: a person's key must be
  // reproducible by anything holding the three numbers, including a gate that
  // never builds a sim at all.
  function hash(a, b, c) {
    var h = (a * 73856093) ^ (b * 19349663) ^ ((c || 0) * 83492791);
    h = (h ^ (h >>> 13)) >>> 0;
    return (h * 2654435761) >>> 0;
  }

  // ---- MIX32, AND THE BUG IT EXISTS TO FIX --------------------------------
  // MEASURED 7/31 ACROSS 528 BODIES ON 40 GENERATED BLOCKS: the run draws every
  // scheduled body with looks[agent.seed % 6] (RUN_LOOKS = 6 townsfolk bodies,
  // baked by the alpha) and `agent.seed % 6` COMES OUT 0, 2 OR 4. NEVER 1, 3 OR
  // 5. Half the bodies Paolo's cast bakes have never once been on screen.
  //   ROOT CAUSE, and it is a JavaScript trap rather than a typo: the agents
  //   module's hash finishes with `(h * 2654435761) >>> 0`. That multiply is
  //   float64 — h up to 4.3e9 times 2.65e9 is ~1.1e19, past the 9.0e15 where a
  //   double stops being exact — so the low ~11 bits are ROUNDED AWAY and every
  //   seed lands on a multiple of 512. Low bits dead means `% smallNumber` dead.
  //   WHAT THIS FILE DOES NOT DO: fix bohemia_agents.hash. That hash also decides
  //   which houses are occupied, how big each household is, and every schedule in
  //   the valley. Changing it reshuffles the entire population and breaks "the
  //   same cell is the same people" for every save that exists. Its low bits are
  //   never used for anything small — this was the only consumer. So the fix
  //   belongs where the small modulus is taken: HERE.
  //   Math.imul is exact 32-bit integer multiply, which is the whole point.
  function mix32(v) {
    v = v >>> 0;
    v ^= v >>> 16; v = Math.imul(v, 0x7feb352d);
    v ^= v >>> 15; v = Math.imul(v, 0x846ca68b);
    v ^= v >>> 16;
    return v >>> 0;
  }

  // ---- KNOWN AT START — EMPTY (CONTENTS-PAOLO'S) ---------------------------
  // key -> {name}. THE ONE EXCEPTION to you-have-to-ask: main-quest people and
  // backstory people, the ones "you're personally assigned to know story wise".
  // You have known them your whole life, so they are named from the first frame
  // and nobody asks their neighbour of twenty years what he is called.
  // WHO THEY ARE IS HIS. The lineman is the obvious first candidate (the run's
  // own words: "he is your neighbour, one door down, nothing closer is
  // possible") and he is NOT in here, because naming him is a ruling and not an
  // inference. people_gate fails if this table gains a row.
  var KNOWN_AT_START = {};
  var NAMED_CAST = KNOWN_AT_START;      // the old name, kept so nothing breaks

  // ---- THE POOL A STRANGER ANSWERS FROM ------------------------------------
  // MECHANISM-MINE: the machine may generate the name somebody TELLS you when you
  // ask. It may never decide who the story people are (that is KNOWN_AT_START,
  // above, and it is empty).
  //
  // GROUNDED IN THE REAL, because everything in Bohemia is. This valley is the
  // corpse of Clark County, Nevada, and Clark County is roughly 30% Hispanic or
  // Latino, ~12% Black, ~10% Asian and Pacific Islander. A name pool that is all
  // Anglo would be a lie about the city the game is set in, and the die-off was
  // not selective. So: real US given-name and surname frequency, weighted the way
  // the county actually is, spread across the cohorts alive ten years after the
  // crash (TEN YEARS COLD, 7/31) rather than one fashionable year.
  // NO CALENDAR YEAR IS ASSUMED — the game has never locked one, and a
  // cohort-by-birth-year generator would be inventing canon to do arithmetic on.
  //
  // THE POOL IS REPLACEABLE. Paolo can swap either list wholesale and nothing
  // else changes; the MECHANIC is his ruling, the strings are just strings.
  var GIVEN = [
    'Marisol', 'Dante', 'Rosa', 'Terrence', 'Imelda', 'Kwame', 'Lupe', 'Silas',
    'Nayeli', 'Ambrose', 'Thuy', 'Odell', 'Consuelo', 'Bishop', 'Priya', 'Ezekiel',
    'Araceli', 'Booker', 'Guadalupe', 'Casimir', 'Linh', 'Delroy', 'Paloma', 'Otis',
    'Xiomara', 'Ignacio', 'Yolanda', 'Amaury', 'Perla', 'Rashad', 'Estella', 'Hoang',
    'Juniper', 'Malachi', 'Socorro', 'Everett', 'Anahi', 'Tobias', 'Renata', 'Cyrus',
    'Marisela', 'Jonah', 'Adaeze', 'Wendell', 'Citlali', 'Amos', 'Nadia', 'Ruben',
    'Ofelia', 'Kai', 'Belen', 'Horace', 'Sunny', 'Idalia', 'Emmett', 'Reyna',
    'Abel', 'Lourdes', 'Milo', 'Trinh', 'Esperanza', 'Roman', 'Clemencia', 'Jarvis'
  ];
  var SURNAME = [
    'Rivera', 'Okonkwo', 'Vasquez', 'Whitfield', 'Nguyen', 'Delgado', 'Boone', 'Salcedo',
    'Pham', 'Ellison', 'Carrasco', 'Mayfield', 'Ibarra', 'Prieto', 'Salazar', 'Dorsey',
    'Munoz', 'Kimura', 'Escobar', 'Hollis', 'Trejo', 'Amadi', 'Zamora', 'Kirkland',
    'Barajas', 'Whitaker', 'Cordova', 'Reyes', 'Ocampo', 'Sandoval', 'Fontenot', 'Duong',
    'Aguirre', 'Beaumont', 'Mercado', 'Chavarria', 'Adeyemi', 'Portillo', 'Vue', 'Serrano',
    'Quintero', 'Rutledge', 'Galvan', 'Osei', 'Villalobos', 'Sepulveda', 'Marchetti', 'Tran',
    'Arroyo', 'Bramble', 'Cisneros', 'Nakamura', 'Peralta', 'Wexler', 'Bonilla', 'Aguilar',
    'Castellanos', 'Odom', 'Lozano', 'Truong', 'Betancourt', 'Grady', 'Mireles', 'Achebe'
  ];

  // ---- THE LINES TABLE -- FILLED 8/12 (tools/bohemia_bark_factory.py)
  // Paolo 8/12: "generate text for now with our quest catalog we have."
  // It shipped EMPTY with a comment saying nothing may fill it but him. That
  // comment predates ALWAYS MAKE AN ATTEMPT (8/11), which overturned exactly
  // that reading for WORDS -- his own diagnosis of the empty field was "THATS
  // WHY I HAVENT DONE QUESTS YET". Every one of these is a draft he can retype
  // in the WORDS tab, and every bucket cites the questbook findings it was
  // written off (Q043.W4 names ambient banter as the best return a solo dev
  // has). STILL HIS AND STILL EMPTY: KNOWN_AT_START and NAMED_CAST -- who
  // anybody IS remains a decision, and none is made here.
  // DO NOT HAND-EDIT: re-run the factory.
  var LINES = {
  "faction:Anarchists": [
    "Nobody's in charge here and that's on purpose.",
    "You need a permit? From who? Say the name out loud.",
    "We fixed it ourselves and we'll fix it again.",
    "We're not disorganised. We're just not YOURS."
  ],
  "faction:Blues": [
    "We voted. You weren't there, and it still counts.",
    "The well is everybody's or it's nobody's, pick.",
    "Slow's not the same as wrong.",
    "Plant it now and somebody eats in ninety days. That's the whole argument.",
    "Nobody starves on my watch and nobody eats twice either."
  ],
  "faction:Caravans": [
    "Six days out, six days back, and the road changes both times.",
    "Prices are what the road says they are.",
    "There's a town north that still has a working sign. A SIGN.",
    "Two weeks of road and the best thing I saw was a bird."
  ],
  "faction:Cartel": [
    "You want it, there's a price. You don't want it, walk on.",
    "Nobody made you come down here.",
    "Everything's available. Availability isn't the expensive part."
  ],
  "faction:Church": [
    "Doors are open. They're always open, that's the point.",
    "Come eat. Sit through the words first if you can stand them.",
    "Nobody's turned away. Nobody's turned away twice, either.",
    "Bring who you like. Bring who you don't like, especially."
  ],
  "faction:Colorful": [
    "You should have seen this place at night. You still should."
  ],
  "faction:Homeless": [
    "Got a spot out of the sun if you need one. Costs nothing.",
    "Everybody here's from somewhere. Ask sometime.",
    "I've slept in better and I've slept in worse and I'm still here."
  ],
  "faction:La Familia": [
    "Family eats first. Everybody's family somewhere."
  ],
  "faction:Mob": [
    "The house always has a floor and you're standing on it.",
    "Talk to me like I'm the last friendly face and you'll do fine.",
    "I've known this block since before it was worth knowing."
  ],
  "faction:Network": [
    "It's already handled. It was handled before you asked.",
    "Everything works here. You noticed that.",
    "We don't disagree about it. There's nothing to disagree about.",
    "The lights stay on. That's all anybody actually wants.",
    "You'll find it's simpler than you were expecting.",
    "Nobody complains here. Ask around."
  ],
  "faction:Panthers": [
    "This block looks after this block."
  ],
  "faction:Pures": [
    "We keep to what we know. It's kept us this long."
  ],
  "faction:Reds": [
    "Everything's a loan. The only question is who's holding it.",
    "I'll front you. You'll pay it back with interest and a smile.",
    "Ten percent isn't greed, it's the reason there's anything to lend.",
    "We keep the books because somebody has to keep the books.",
    "Everybody says they hate the ledger till they need the ledger."
  ],
  "faction:Remnants": [
    "This was a real city. I don't mean big. I mean real.",
    "We kept the records. Somebody's going to want them.",
    "Somebody has to remember what the street names were."
  ],
  "faction:Trades": [
    "I can fix it. I can't fix it for free.",
    "Bring the part or bring the hours, either way it's the same to me.",
    "Whoever built this knew what they were doing. Whoever touched it after didn't.",
    "Everything in this valley was built by somebody who's still alive."
  ],
  "faction:Triads": [
    "Terms first. Then the handshake."
  ],
  "faction:Volunteers": [
    "You're bleeding. Sit down, we'll argue about it after.",
    "We don't ask who you run with. We ask where it hurts.",
    "We're out of almost everything except being here."
  ],
  "keeper:errand": [
    "Two blocks, three promises, one of them's real.",
    "If I'm not back by dark, the list is on the table.",
    "I'm collecting, not visiting. Don't put the kettle on."
  ],
  "keeper:free": [
    "Sit. You look like a man about to ask me for something.",
    "It ran better when fewer people knew it existed.",
    "Everybody's a good neighbour on a full stomach.",
    "Ask me tomorrow when I'm not counting.",
    "I've buried people who were owed more than you."
  ],
  "keeper:home": [
    "Wipe your feet, this is somebody's house.",
    "I keep a list. Everybody on this block is on the list.",
    "You eat here you help here, that's it, that's the whole rule.",
    "If it leaks, tell me. Don't fix it, tell me.",
    "There's water till Thursday. After Thursday there's a conversation.",
    "I know who's short and I know who's lying about being short.",
    "You're welcome here. You're not welcome to everything here.",
    "Take your shoes off and take your side of it off too."
  ],
  "keeper:scav": [
    "I don't like doing this. I like eating."
  ],
  "keeper:sleep": [
    "...",
    "It'll keep till morning. Everything keeps till morning."
  ],
  "keeper:watch": [
    "I'd rather be the one awake than the one wondering.",
    "Nothing gets past this porch without saying hello."
  ],
  "keeper:work": [
    "Count it in front of me, not after.",
    "One family, one share. I don't care how loud you are.",
    "The book says what the book says.",
    "You want more, bring more. That's not cruelty, that's arithmetic.",
    "I'll hear it, but I'll hear it after.",
    "I'll write you down for Thursday. Don't make me chase you Thursday.",
    "Everybody thinks they're the exception. Nobody's the exception.",
    "It's not mine. I just hold the key to it."
  ],
  "scav:errand": [
    "Dropping this off then I'm done, I mean it.",
    "They asked for glass. I brought glass.",
    "Two more streets and then I'm somebody's problem, not mine."
  ],
  "scav:free": [
    "I got two batteries and a story.",
    "Trade you. Don't ask what for.",
    "I found a whole box of forks. FORKS.",
    "Everything out there's either bolted down or already somebody's.",
    "I'd trade the whole bag for a working fridge and I mean it.",
    "You want to know what's out there? Sand and other people's kitchens."
  ],
  "scav:home": [
    "It's not much. It's what there was.",
    "Don't tell your mother where I got it.",
    "I'll go further out tomorrow. It's fine.",
    "I'll clean it. It works, it's just ugly.",
    "Nothing today. There's always tomorrow, there's just not always today."
  ],
  "scav:scav": [
    "Anything with a serial number on it, somebody wants.",
    "Don't go in past the second room. Floor's a suggestion.",
    "Whole street's picked. We're late by a decade.",
    "Wire, glass, anything that holds water. That's the list.",
    "You smell that? Then we're not going in.",
    "Third house today with the beds still made.",
    "Take the small stuff first. Small stuff walks.",
    "If it was worth taking it's already taken. So look for what nobody wanted yet.",
    "Anything that used to plug into something, bring it.",
    "That's a load-bearing nothing. Don't lean.",
    "Been in here before. Somebody moved the chairs.",
    "Leave the photos. I know, I know. Just leave them."
  ],
  "scav:sleep": [
    "...",
    "Wake me if the dogs start."
  ],
  "scav:watch": [
    "I'm better at finding than watching.",
    "Anything moves out there, it's a bag in the wind."
  ],
  "scav:work": [
    "Sorting's the job. Anybody can pick things up.",
    "That pile's mine, that pile's the block's. Don't mix them.",
    "Anything shiny goes in the middle pile, I'll look at it after."
  ],
  "watch:errand": [
    "Fast in, fast out. I'm expected somewhere."
  ],
  "watch:free": [
    "Third night in a row somebody's been on that roof.",
    "One of these years it'll be safe enough to be bored.",
    "You want the shift? Take the shift. I'm not proud.",
    "I sleep with the window open. Habit."
  ],
  "watch:home": [
    "I sleep days. Try to remember that.",
    "Nothing happened, which is the best sentence I know.",
    "Don't ask. It was fine. It's always fine until it isn't."
  ],
  "watch:scav": [
    "Off shift I take what everybody takes."
  ],
  "watch:sleep": [
    "...",
    "I hear everything, so it had better be worth it."
  ],
  "watch:watch": [
    "State your business or state nothing and keep walking.",
    "It's quiet. Quiet's got a sound and this isn't it.",
    "Two hours to go and then it's somebody else's dark.",
    "You see a light where there wasn't one, you say so.",
    "Nobody comes up this street who doesn't live on it.",
    "Cold out. Been colder.",
    "I'm not stopping you. I'm looking at you.",
    "Whistle if you're one of ours. Everybody knows the whistle.",
    "Every hour I don't see anything is an hour that worked.",
    "Somebody's been standing at that corner for twenty minutes.",
    "Go home. I'm not asking twice and I'm not asking rudely.",
    "You get used to the dark. You never get used to the waiting."
  ],
  "watch:work": [
    "Same post, same window, same six lights.",
    "I write it down. Somebody eventually reads it."
  ],
  "when:after_trouble": [
    "Everybody's accounted for. Everybody on this block.",
    "Board it tonight, fix it properly when it's light.",
    "Nobody's saying anything and everybody's saying it loud.",
    "Count the doors. Then count the people.",
    "Whatever you saw, you saw it with us."
  ],
  "when:brownout": [
    "There it goes. Same hour as always.",
    "Half light's worse than none. Makes you think it's coming back.",
    "Somebody upstream is drinking before we do.",
    "Half the block, same as Tuesday.",
    "It's not broken. Somebody's just using more of it than us."
  ],
  "when:favour": [
    "I'll not forget it. That's worth more here than it used to be.",
    "You did right by me. Say the word sometime."
  ],
  "when:heat": [
    "Hundred and ten in the shade and there is no shade.",
    "Don't move till four. Nothing's worth it till four.",
    "Drink before you're thirsty. After's too late out here.",
    "You can hear the road ticking.",
    "This used to be the fun kind of hot."
  ],
  "when:hungry": [
    "I'm fine. I ate yesterday.",
    "Half now, half tomorrow. That's how you make it two days.",
    "I'm saving it. Don't look at me like that."
  ],
  "when:market": [
    "Say a number. Any number. We'll meet somewhere sad in the middle.",
    "That's not what it was worth last week.",
    "Cash, work, or water. Pick one.",
    "You touch it, you've bought it, that's the rule.",
    "For that? For THAT?",
    "Everybody's an honest trader till the second offer.",
    "I'll take it for what it's worth to me, not what it's worth to you."
  ],
  "when:met_before": [
    "You again. That's not a complaint.",
    "Still walking, then.",
    "I remember you. That's rarer than it sounds."
  ],
  "when:night": [
    "Twelve blocks and you can count the lit ones.",
    "Whatever's out there tonight can stay out there.",
    "Dark's the only thing that's free.",
    "You can hear the freeway when it's this quiet. Nothing on it, but you can hear it.",
    "Nobody patrols the dark. That's not a rule, it's just true.",
    "See a light move where nothing should be? Say nothing and walk faster."
  ],
  "when:owed": [
    "You know what you owe me.",
    "I'm not going to bring it up. I'm just going to look at you."
  ],
  "when:rain": [
    "Put out everything that holds water. Everything.",
    "First rain since spring and half of it's on the roof, not in the barrel.",
    "Kids are out in it. Let them be out in it."
  ],
  "when:seen": [
    "Don't know you.",
    "You're the one from the other block.",
    "Long as you're not taking anything.",
    "Morning. Or whatever it is.",
    "Keep walking, no offence.",
    "You looking for somebody?",
    "New face. Huh.",
    "Whatever you're selling, walk slower.",
    "You're not from three blocks up, are you."
  ],
  "when:stranger_block": [
    "This isn't your street.",
    "Ask before you take anything on this block. Ask ME."
  ],
  "when:work_short": [
    "We're two short today and nobody's saying why.",
    "If they don't show tomorrow I'm putting somebody else on it."
  ],
  "worker:errand": [
    "Four stops and I've done one.",
    "If they're closed I'm not coming back tomorrow.",
    "She said noon. It has been noon for a while.",
    "I'll pay in work. I always pay in work.",
    "Half of getting anything here is knowing which door.",
    "Tell her I came by. Tell her I came by TWICE.",
    "I'm not arguing, I'm explaining loudly."
  ],
  "worker:free": [
    "Give it two years. Somebody'll turn the rest of the lights back on.",
    "You remember when this block had two working streetlights? Two.",
    "I'm not saying he stole it. I'm saying he has it.",
    "Sit down, you're making me tired.",
    "That's not a rumour, that's my cousin.",
    "Whole valley's held together with hose clamps and stubbornness.",
    "Somebody's kid is on the roof again.",
    "You hear they've got a generator two streets over? Allegedly.",
    "I'd move if there was anywhere that isn't this.",
    "Twelve years I've walked this street and it's never been this quiet at noon."
  ],
  "worker:home": [
    "Shoes off. I just swept.",
    "We're one bad week from asking my brother for help and I'd rather not.",
    "Did you eat? Don't lie to me.",
    "Leave the door. It's cooler with it open and nobody's coming down here.",
    "I'm not going back tomorrow if they're short again.",
    "Save that. It's still good if you cut the ends off.",
    "The tap's brown again. Let it run, it clears.",
    "I'm not asking them for anything. I'd rather be cold.",
    "Sit with me a minute. Just a minute."
  ],
  "worker:scav": [
    "Copper's gone. Everything's gone but the heavy stuff.",
    "Somebody beat us here by about a year.",
    "Take the hinges. People always forget hinges.",
    "Everything decent's behind a door somebody welded.",
    "One good find pays a week. One."
  ],
  "worker:sleep": [
    "...",
    "Turn that off.",
    "Five more minutes and I mean it.",
    "Let me sleep or let me work, not both."
  ],
  "worker:watch": [
    "Nothing yet. Which is the job.",
    "I count six lit windows from here. Same six as last night.",
    "Anything happens, I'm the one who yells. That's the plan.",
    "Two of us and eleven houses. You do the maths."
  ],
  "worker:work": [
    "Third shift this week and the meter still reads the same.",
    "If it runs, it runs. Nobody's paying me to make it pretty.",
    "Hold that. No, HOLD it.",
    "They want it done by dark. Dark's in an hour.",
    "Whoever wired this was in a hurry or a mood.",
    "I'll trade you an hour. I'm not trading two.",
    "Every job in this valley is somebody's old job done worse.",
    "Careful. That's live and it lies about it.",
    "Two of us doing four people's day and they call that lean.",
    "Don't help. Seriously. You'll help it into the ground.",
    "It held all winter. It'll hold.",
    "Tell them it's done when it's done."
  ]
};

  // ---- REACTIONS -- WHAT THEY SAY BECAUSE OF WHAT YOU DID -------------
  // Generated by tools/bohemia_reaction_factory.py. DO NOT HAND-EDIT.
  // Depth is reactivity. Three shipped systems already know exactly what a
  // person thinks of you and why -- standing RUNGS, deeds witness() (who
  // actually SAW it, and how far its loudness carried), and the ledger (how
  // many times you have met, whether you asked, whether you were honest) --
  // and all three fed a mouth that said the same ambient line to everybody.
  // Every key here is a value one of those modules already produces; the
  // factory reads the rung names and clout tags OFF those modules rather
  // than retyping them, because a retyped key is a line that never fires.
  var REACTIONS = {
  "heard:notable": [
    "You're the one from the thing.",
    "It got to me third-hand and it still had your name on it.",
    "I've heard two different stories about you this week."
  ],
  "heard:quiet": [
    "Somebody mentioned you. Only somebody.",
    "I heard a version of it. Probably the wrong version."
  ],
  "heard:reckless": [
    "Everybody's heard. That's the whole point of what you did, isn't it.",
    "Two blocks and a caravan and it still got here before you.",
    "I'd never met you and I already had an opinion."
  ],
  "heard:risky": [
    "Word came up this way about you. It didn't lose anything on the trip.",
    "I heard, and I heard who was standing near you when it happened."
  ],
  "met:again": [
    "You. Again.",
    "That's twice. Three times and I'll learn your name.",
    "Still walking around, I see."
  ],
  "met:asked": [
    "You asked. Most people don't ask.",
    "You remembered. That's not nothing here."
  ],
  "met:first": [
    "Don't think we've done this.",
    "New. Alright.",
    "I'll get your name eventually or I won't."
  ],
  "met:honest": [
    "You told me straight when you didn't have to.",
    "I've been lied to by better dressed people than you. You didn't."
  ],
  "met:known": [
    "There you are.",
    "I was wondering when you'd come back around.",
    "Same as always? Course it is."
  ],
  "met:lied": [
    "You told me a thing that wasn't true and I found out on my own.",
    "I'm not angry. I'm just done taking your word."
  ],
  "rung:COLD": [
    "I'm not going to be rude about it. I'm just not going to help.",
    "We're square. Let's keep it that way.",
    "I heard. I'm not going to say what I heard.",
    "You'll want to talk to somebody else.",
    "It's not personal. It's just recent."
  ],
  "rung:FWU": [
    "Anything I have. I mean that and I'd rather you didn't test it.",
    "You're not a guest here. Stop knocking.",
    "Half this block would stand up for you and the other half doesn't know you yet.",
    "Whatever happens, you've got a door here."
  ],
  "rung:HOSTILE": [
    "No. Whatever it is, no.",
    "You've got a lot of road to be walking down this one.",
    "I know what you did. Everybody on this street knows what you did.",
    "Don't stand where I can see you.",
    "There's nothing here for you. There's nothing here for you tomorrow either.",
    "You come back with the whole block behind you or you don't come back."
  ],
  "rung:NEUTRAL": [
    "You're the one who's been around.",
    "I don't know you well enough to have an opinion and that's fine by me.",
    "Ask. I might answer.",
    "Haven't decided about you yet."
  ],
  "rung:WARM": [
    "There's a chair. Sit in it.",
    "You've been decent to people I like. That travels.",
    "Take it. Pay me back whenever, or don't.",
    "I put a word in for you. Didn't have to. Did anyway.",
    "You need something, you ask me before you ask a stranger."
  ],
  "saw:notable": [
    "I was standing right there.",
    "Half the block watched you do that.",
    "People are going to be talking about that at dinner.",
    "You didn't hide it. I don't know yet if that was brave or stupid."
  ],
  "saw:quiet": [
    "I saw. I don't think anybody else did.",
    "You handled that without a crowd. I noticed.",
    "Nobody's going to hear it from me.",
    "Quiet work. Rarer than you'd think."
  ],
  "saw:reckless": [
    "I was there. I'll be answering questions about it for a month.",
    "Whatever you were trying to prove, you proved it.",
    "You did that in front of children.",
    "I can't unsee it and neither can anybody else on that corner.",
    "There's no walking that back. You know that, right?"
  ],
  "saw:risky": [
    "You could have got somebody killed doing that.",
    "I saw it and I've been thinking about it since.",
    "That was a lot. That was a LOT.",
    "I'm not saying you were wrong. I'm saying my hands were shaking."
  ]
};

  // ---- THE FOUR WORDS THE WORLD ALREADY USES -------------------------------
  // NOT new vocabulary. bohemia_agents.js:makeAgent already sorts every person
  // into exactly these four, and scheduleFor gives each one a different day.
  // Displaying them is surfacing mechanism, not inventing character.
  var ROLE_WORDS = { worker: 'WORKER', scav: 'SCAVENGER', keeper: 'KEEPER', watch: 'WATCH' };
  // What a scheduled block MEANS, in the words the schedule itself uses
  // (bohemia_agents.js:scheduleFor acts: sleep/home/work/free/scav/errand/watch).
  var ACT_WORDS = {
    sleep: 'ASLEEP AT HOME', home: 'AT HOME', work: 'AT WORK',
    free: 'OUT ON THE BLOCK', scav: 'SCAVENGING', errand: 'ON AN ERRAND',
    watch: 'ON WATCH'
  };
  var ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
  var COUNTWORDS = ['', 'ONE', 'TWO', 'THREE', 'FOUR'];

  function two(n) { return (n < 10 ? '0' : '') + n; }
  function clock(t) { t = ((t % 1440) + 1440) % 1440; return two(Math.floor(t / 60)) + ':' + two(t % 60); }

  // ---- THE KEY -------------------------------------------------------------
  // Stable across saves, devices and sim rebuilds. The block seed is in it
  // because two blocks may both have an H3-2 and they are not the same person.
  function keyOf(blockSeed, agent) {
    if (!agent) return null;
    return 'P:' + (blockSeed >>> 0) + ':' + agent.id;
  }
  // house/slot back out of the mechanical designation the agents module writes
  // ('H<house>-<n>', 1-based). Parsed rather than re-derived so the two files
  // can never disagree about which house somebody is from.
  function seatOf(agent) {
    var m = /^H(\d+)-(\d+)$/.exec(String(agent && agent.id || ''));
    return m ? { house: parseInt(m[1], 10) - 1, slot: parseInt(m[2], 10) - 1 } : { house: -1, slot: -1 };
  }

  // ---- THE PERSON ----------------------------------------------------------
  // Derived. Pure. No state. Feed it the same agent tomorrow and it is the same
  // person, which is the entire point of the module.
  function personOf(blockSeed, agent, opts) {
    if (!agent) return null;
    opts = opts || {};
    var seat = seatOf(agent);
    var key = keyOf(blockSeed, agent);
    var canon = KNOWN_AT_START[key] || null;
    /* THE THREE WAYS YOU CAN KNOW SOMEBODY (Paolo 7/31, YOU HAVE TO ASK):
         known    - story people. You have known them your whole life. His table.
         asked    - you walked up and asked, and the game remembered.
         stranger - everyone else, forever, until you ask.
       `asked` is the only one the player can move somebody into, and moving them
       is the mechanic. opts.asked comes from the meeting ledger, which is the
       only thing in this system that is genuinely persisted. */
    var asked = !canon && !!opts.asked;
    return {
      key: key,
      tier: canon ? 'known' : (asked ? 'asked' : 'stranger'),
      name: canon ? canon.name : (asked ? generatedName(key) : null),
      role: agent.role || null,
      // WHICH BODY THEY WEAR, AND WHICH FACE GOES WITH IT — one number for both,
      // which is what makes the portrait the person you walked up to. Mixed, not
      // raw: see mix32 above for the half-the-cast-never-drawn measurement.
      lookSeed: mix32(agent.seed),
      // a separate stream for anything that must vary INDEPENDENTLY of the look
      idSeed: hash(blockSeed, seat.house + 1, seat.slot + 101),
      household: {
        house: seat.house,
        slot: seat.slot,
        size: opts.householdSize != null ? opts.householdSize : null
      },
      home: agent.home || null,
      work: agent.job || null,
      faction: agent.faction || null   // still null everywhere: FACTION_ASSIGN is empty
    };
  }

  // Everyone on a block, with household sizes filled in from the roster itself
  // (the roster is the only thing that knows how many people share a house).
  function peopleOf(blockSeed, agents, ledger) {
    var sizes = {};
    (agents || []).forEach(function (a) {
      var h = seatOf(a).house; sizes[h] = (sizes[h] || 0) + 1;
    });
    return (agents || []).map(function (a) {
      return personOf(blockSeed, a, {
        householdSize: sizes[seatOf(a).house],
        asked: ledger ? ledger.asked(keyOf(blockSeed, a)) : false
      });
    });
  }

  // ---- WHAT YOU CALL THEM --------------------------------------------------
  // A name if he has ruled one, otherwise the engine's own role word. NEVER an
  // invention. If a role ever arrives that this file does not know, it says
  // SOMEBODY rather than guessing at them.
  /* THE NAME THEY WOULD GIVE YOU IF YOU ASKED. Deterministic from the identity
     key, so a person answers the same way forever, on any device, and so the
     ledger only ever has to remember the single bit "you asked" — the name
     itself is derived, exactly like everything else in this module. Two
     independent streams so a common first name and a common surname do not
     travel together across the valley. */
  function generatedName(key) {
    var h = 0;
    for (var i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
    var a = mix32(h), b = mix32(h ^ 0x9e3779b9);
    return GIVEN[a % GIVEN.length] + ' ' + SURNAME[b % SURNAME.length];
  }
  /* NEVER returns a name for a stranger, whatever pool exists. This is the
     ruling in one function: a name is earned, not given. */
  function nameOf(person) {
    if (!person || person.tier === 'stranger') return null;
    return person.name || null;
  }
  /* THE WHOLE PHRASE THE ONE BUTTON SAYS, so the grammar lives in ONE place. A
     trade takes an article and a person does not: "TALK TO THE SCAVENGER" but
     "TALK TO RUBEN". The run built this string itself for half a day and shipped
     "TALK TO THE RUBEN" the moment names existed; the gate caught it, and the
     fix is that the run stops doing grammar. */
  function addressOf(person, verb) {
    verb = verb || 'TALK TO';
    return nameOf(person) ? verb + ' ' + headingOf(person)
                          : verb + ' THE ' + headingOf(person);
  }
  /* WHAT THE GAME CALLS THEM TO YOUR FACE. A stranger is their trade; somebody
     you asked is their first name, because that is how you would actually think
     of a neighbour once you had it. */
  function headingOf(person) {
    if (!person) return 'SOMEBODY';
    var n = nameOf(person);
    if (n) return String(n).split(' ')[0].toUpperCase();
    return ROLE_WORDS[person.role] || 'SOMEBODY';
  }
  // the small line under the heading: pure mechanism, no character in it
  function seatLineOf(person) {
    if (!person || person.household.house < 0) return '';
    var s = 'HOUSE ' + (person.household.house + 1);
    var n = person.household.size;
    if (n) {
      s += ' · ' + (ORDINALS[person.household.slot] || (person.household.slot + 1) + 'TH');
      s += ' OF ' + (COUNTWORDS[n] || n);
    }
    return s;
  }

  // ---- THE DAY IS NOT FOR READING (Paolo 7/31, LOCKED) ---------------------
  // There WAS a day-line helper here, and a THEIR DAY row on the card that read
  // "OUT 06:25 · HOME 16:58". It shipped about an hour before he ruled:
  //   "it will all be invisible information."
  // laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md, ruling 1:
  // the game NEVER displays a person's schedule, routine, day shape or working
  // hours. The system exists to be FELT — the street is busy at eleven and dead
  // at two — and never to be READ. You learn a neighbour's hours by being on the
  // street at different hours, which is the only way anybody has ever learned a
  // neighbour's hours in real life.
  //   IT IS DELETED RATHER THAN HIDDEN, and this note is here so the next
  //   session does not helpfully put it back. THE LINE IS TENSE: present tense
  //   is eyesight and stays legal (nowLineOf, below). Future or habitual tense
  //   is a timetable and is banned.
  //   Gate: gates/invisible_schedule_gate.js, which carried a dated waiver for
  //   this exact row until this turn removed the row and the waiver together.

  // ---- WHERE THEY ARE, RIGHT NOW -------------------------------------------
  function nowLineOf(agent, turn) {
    var b = whereAt(agent, turn || 0);
    if (!b) return null;
    return ACT_WORDS[b.act] || String(b.act || '').toUpperCase();
  }
  // local copy of the agents module's lookup so a gate can test this file alone
  function whereAt(agent, turn) {
    var s = (agent && agent.sched) || []; if (!s.length) return null;
    var t = ((turn % 1440) + 1440) % 1440;
    for (var i = 0; i < s.length; i++) if (t >= s[i].t0 && t < s[i].t1) return s[i];
    return s[s.length - 1];
  }

  // ---- WHAT THEY DO FOR A LIVING -------------------------------------------
  var COMPASS = { N: 'NORTH', S: 'SOUTH', E: 'EAST', W: 'WEST' };
  function workLineOf(person) {
    var j = person && person.work;
    if (!j) return 'UNKNOWN';
    if (j.kind !== 'site' || !j.district) return 'SCAVENGES THIS BLOCK';
    var s = String(j.district).replace(/_/g, ' ').toUpperCase();
    if (j.dir) s += ', ' + (COMPASS[j.dir] || String(j.dir).toUpperCase());
    return s;
  }

  // ---- THE CARD ------------------------------------------------------------
  // Every row is a FACT THE SIM ALREADY KNOWS, rendered. Nothing here is
  // authored character: no opinions, no history, no voice. That is the line
  // this lane may not cross without him, and it is why the NAME row says what
  // it says instead of quietly hiding an empty table.
  function cardFor(person, agent, turn, met) {
    var rows = [];
    /* THE ROW THE WHOLE RULING LANDS ON. A stranger's name is not blank and not
       hidden — it says you have not asked, because the missing thing IS the
       mechanic and hiding it would make the card look finished when it is not. */
    rows.push({ label: 'NAME',
                value: nameOf(person) || 'YOU HAVE NOT ASKED' });
    if (person && person.household.house >= 0) {
      rows.push({ label: 'LIVES', value: 'HOUSE ' + (person.household.house + 1) + ' ON THIS BLOCK' });
    }
    rows.push({ label: 'WORKS', value: workLineOf(person) });
    /* EYESIGHT, NOT A TIMETABLE. Where somebody is RIGHT NOW, while you are
       standing in front of them, is the only tense the ruling allows. */
    var now = nowLineOf(agent, turn);
    if (now) rows.push({ label: 'RIGHT NOW', value: now });
    rows.push({ label: 'YOU HAVE MET', value: metWords(met) });
    return rows;
  }
  function metWords(met) {
    var n = (met && met.times) || 0;
    if (n <= 1) return 'FIRST TIME';
    if (n === 2) return 'ONCE BEFORE';
    return (n - 1) + ' TIMES BEFORE';
  }

  // ---- THE MEETING LEDGER --------------------------------------------------
  // The smallest honest memory: has this person met you, how many times, and on
  // which world-day first and last. Keyed by the derived key, so it survives the
  // sim being thrown away and rebuilt. Serialises to a plain object because it
  // rides inside the run's existing save blob and a save has to load on another
  // device (no Maps, no class instances, no undefined).
  function makeLedger(data) {
    var m = {};
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(function (k) {
        var v = data[k];
        if (!v || typeof v !== 'object') return;
        m[k] = { times: v.times | 0, first: v.first | 0, last: v.last | 0,
               asked: v.asked ? 1 : 0, honest: v.honest ? 1 : 0,
               answered: v.answered ? 1 : 0 };
      });
    }
    return {
      get: function (key) { return m[key] || null; },
      times: function (key) { return (m[key] && m[key].times) || 0; },
      // returns the record AS IT NOW STANDS, so a caller can render "first time"
      // on the very meeting that made it no longer the first time.
      meet: function (key, day) {
        if (!key) return null;
        day = day | 0;
        var r = m[key];
        if (!r) { r = m[key] = { times: 0, first: day, last: day, asked: 0, honest: 0, answered: 0 }; }
        r.times++; r.last = day;
        return r;
      },
      /* YOU ASKED, AND THE GAME REMEMBERS — the half of the ruling he called
         "really cool". One bit, because the name is derived from it. */
      ask: function (key, day) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0, answered: 0 });
        r.asked = 1; r.last = day | 0;
        return r;
      },
      asked: function (key) { return !!(m[key] && m[key].asked); },
      /* THE SECOND BIT, and it exists because the Homeless do not want your name,
         they want to know where you sleep (records/factions/BOHEMIA_FACTION_
         HOMELESS.md, canon 8/2). Answering honestly is what earns THEIR name, so
         the honest answer has to survive a save exactly the way asking does, or
         the mechanic resets every time he reloads. Still one bit: what you told
         them is derived, only THAT you told them the truth is stored.

         SECOND BIT ADDED 8/13, and it is the difference between "has not answered"
         and "answered and lied". honest:0 meant both, so a person you had lied to
         was indistinguishable from a person you had never spoken to -- and the
         REACTIONS table has a `met:lied` bucket that could therefore NEVER FIRE.
         A key the sim never emits is a line that can never fire; the fix is on
         the emitting side, never a line quietly deleted from the table. The
         boolean was already arriving here and being thrown away. */
      answer: function (key, day, honest) {
        if (!key) return null;
        var r = m[key] || (m[key] = { times: 1, first: day | 0, last: day | 0, asked: 0, honest: 0, answered: 0 });
        r.answered = 1; r.honest = honest ? 1 : 0; r.last = day | 0;
        return r;
      },
      honest: function (key) { return !!(m[key] && m[key].honest); },
      answered: function (key) { return !!(m[key] && m[key].answered); },
      lied: function (key) { return !!(m[key] && m[key].answered && !m[key].honest); },
      namesKnown: function () {
        var n = 0; for (var k in m) if (m[k].asked) n++; return n;
      },
      known: function () { return Object.keys(m).length; },
      serialize: function () { return JSON.parse(JSON.stringify(m)); },
      /* THE ONE PLACE THE met: BUCKETS ARE CHOSEN, and it lives with the ledger
         that owns the bits rather than in whichever surface happens to be
         drawing a card. A caller that has to re-derive "have we met" invents its
         own answer sooner or later, and then two screens disagree about the same
         person. Most specific first, and every branch reads a bit that is
         actually stored and actually saved. */
      metState: function (key) {
        var r = m[key];
        if (!r) return 'first';
        if (r.answered && !r.honest) return 'lied';
        if (r.answered && r.honest) return 'honest';
        if (r.asked) return 'asked';
        if (r.times >= 4) return 'known';
        if (r.times >= 2) return 'again';
        return 'first';
      }
    };
  }

  var API = {
    VERSION: '7.31.26',
    KNOWN_AT_START: KNOWN_AT_START, NAMED_CAST: NAMED_CAST, LINES: LINES,
    GIVEN: GIVEN, SURNAME: SURNAME, generatedName: generatedName,
    ROLE_WORDS: ROLE_WORDS, ACT_WORDS: ACT_WORDS,
    hash: hash, keyOf: keyOf, seatOf: seatOf,
    personOf: personOf, peopleOf: peopleOf,
    nameOf: nameOf, headingOf: headingOf, addressOf: addressOf, seatLineOf: seatLineOf,
    nowLineOf: nowLineOf, workLineOf: workLineOf,
    whereAt: whereAt, cardFor: cardFor, metWords: metWords,
    makeLedger: makeLedger, clock: clock, REACTIONS: REACTIONS, REACTIONS: REACTIONS, REACTIONS: REACTIONS, REACTIONS: REACTIONS, REACTIONS: REACTIONS,
    // what a person says when no quest is talking. FILLED 8/12 by
    // tools/bohemia_bark_factory.py, every line a draft he can retype in WORDS.
    linesFor: function (person, opts) {
      if (!person) return [];
      /* MOST SPECIFIC FIRST. A person's KEY beats their role-and-what-they-are-
         doing, which beats their role, which beats their faction, which beats
         the situation. `at` is the schedule's own act word (sleep/home/work/
         free/scav/errand/watch) so the world's existing mechanism picks the
         line and this module still invents nothing. */
      var at = (opts && opts.at) || person.act || null;
      var fac = (opts && opts.faction) || person.faction || null;
      var when = (opts && opts.when) || null;
      /* *** A REACTION BEATS AN AMBIENT LINE, ALWAYS. *** Somebody who watched
         you do something reckless yesterday does not open with the weather.
         Most specific first: what they SAW, then what they HEARD, then where
         you STAND with them, then what they remember of you, and only then
         the ambient buckets. Every one of these is a value a shipped module
         already computes -- nothing here invents a fact about the player. */
      var saw = (opts && opts.saw) || null;      // deeds.witness(), by clout
      var heard = (opts && opts.heard) || null;  // same, reached by gossip
      var rung = (opts && opts.rung) || null;    // standing.js RUNGS
      var met = (opts && opts.met) || null;      // people.js makeLedger
      var pick = (saw && REACTIONS['saw:' + saw])
        || (heard && REACTIONS['heard:' + heard])
        || (rung && REACTIONS['rung:' + rung])
        || (met && REACTIONS['met:' + met])
        || LINES[person.key]
        || (at && LINES[person.role + ':' + at])
        || LINES[person.role]
        || (fac && LINES['faction:' + fac])
        || (when && LINES['when:' + when])
        || [];
      return pick.slice();
    }
  };
  if (HASREQ) module.exports = API;
  root.BohemiaPeople = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
