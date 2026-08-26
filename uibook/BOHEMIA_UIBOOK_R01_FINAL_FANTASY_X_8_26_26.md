# BOHEMIA UIBOOK — ROUND 01: FINAL FANTASY X (Square, 2001)
# Studied 8/26/26 under laws/BOHEMIA_ADDENDUM_THE_UI_STUDY_LAW_8_26_26.md
# Paolo: "the first basis of all of this is gonna be Final Fantasy ten,
#         my favorite UI of all time."
#
# THIS FILE IS A CORPUS, NOT AN ESSAY. Every finding has a stable id, a lens it
# was found through, and a PORT VERDICT that says what Bohemia does about it.
# tools/bohemia_uibook_index.py mines it into records/BOHEMIA_UIBOOK_LAW_INDEX.json.
# gates/ui_study_gate.js proves the citations resolve and the study is not a fan page.
#
# THE FOUR MASTERS (a finding belongs to exactly one):
#   LOOK   L##   material, colour, type, shape, texture, motion
#   READ   R##   information: what it tells you, in what order, how fast
#   DO     D##   input: committing, cancelling, targeting, the cost of a mistake
#   WORLD  W##   where the interface touches the fiction (diegetic / meta / spatial)
#
# VERDICTS: TAKE (copy the mechanism) · ADAPT (the shape ports, the form does not)
#           REFUSE (it is good AND it cannot come, and the reason is the finding)
#
# COUNTS (the index checks these against what it actually mines):
#   findings: 18   look: 5   read: 5   do: 4   world: 4
#   take: 9   adapt: 5   refuse: 4

===============================================================================
MASTER: LOOK
===============================================================================

### FFX.L01  THE MENU IS A PANE OF GLASS LAID ON THE WORLD
LENS: clarity (Hodent) · the geometry axis (Fagerholt & Lorentzon)
SCREEN: battle, main menu, shop
WHAT: Every FFX panel is a translucent deep-indigo box with a thin light border
  and a soft inner gradient, drawn over the live scene. The world keeps moving
  behind it. The menu never replaces the picture, it is laid on top of it.
WHY: The interface reads as an OBJECT with a material, not as a document. And
  because the world stays visible, opening a menu never feels like leaving.
PORT: ADAPT
BECAUSE: Bohemia's fork 5 (THE DIRT) is the same idea in a different material.
  FFX's interface is made of glass; ours would be made of a dirty steel plate.
  Both say the same thing: the interface is a thing, not a page.
CAUTION: DO NOT COPY THE TRANSLUCENCY. FFX gets away with glass because its
  battle backgrounds are low-contrast and softly lit. Bohemia's world is
  high-contrast pixel art at 1:1, and text over it at 40% opacity is unreadable.
  Opaque plate, grime on the plate, world visible AROUND it, never THROUGH it.

### FFX.L02  ONE FACE, AND IT WAS CARRYING MORE THAN ANYONE KNEW
LENS: consistency (Hodent)
SCREEN: everywhere
WHAT: One typeface across the entire game, in one weight, at essentially two
  sizes. The 2013 HD Remaster changed that typeface and the menu cursor and
  almost nothing else material. Ten years later players still say the remaster
  damaged the game, and the type is the thing they name.
WHY: A typeface is not decoration in a game with this much reading. It is the
  voice the game speaks in. Swap it and the same words sound like someone else.
PORT: TAKE
BECAUSE: MEASURED 8/26: BOHEMIA HAS NO TYPEFACE. The alpha asks for one called
  Space Grotesk in exactly one place, never loads it, and has no font file. Every
  letter in the build is whatever the phone decided. That is what makes fork 4
  on the UI page a real decision and not a cosmetic one.

### FFX.L03  THE INTERFACE LIVES IN A HUE THE WORLD DOES NOT USE
LENS: clarity (Hodent)
SCREEN: everywhere
WHAT: Spira is tropical — turquoise water, wet sand, green, warm skin. The menus
  are deep indigo, a value and a hue the world barely touches. The interface and
  the world are never competing for the same part of the eye.
WHY: Separation by HUE costs nothing and works before you read a single word.
PORT: TAKE
BECAUSE: This answers fork 3 from inside his own favourite game. Bohemia's world
  is desert tan and GOLD LIGHT, and LIGHT = TERRITORY is law: gold means a lamp
  is on and somebody owns that ground. If the buttons are gold too, gold stops
  meaning light. The UI has to live where the world does not — which is the
  argument for BONE.

### FFX.L04  THE NUMBERS ARE BIG AND THEY FLY
LENS: signs and feedback (Hodent) · meta UI (Fagerholt & Lorentzon)
SCREEN: battle
WHAT: Damage pops off the target in a large face, arcs upward, and fades. 9999
  is a landmark players chase for a hundred hours.
WHY: The feedback is bigger than the event. That is deliberate: a hit you can
  barely see reads as a hit that barely happened.
PORT: REFUSE
BECAUSE: NO DAMAGE BEFORE THE DIAL is our own law and it is not negotiable. The
  SHAPE is banked for the day the dial exists; the content waits. Recording it
  here so nobody has to rediscover it, and so nobody ships it early.

### FFX.L05  THE INTERFACE MOVES IN AND OUT INSTEAD OF CUTTING
LENS: consistency (Hodent)
SCREEN: battle entry, menu open, cutscene handoff
WHAT: FFX slides its panels in and out. It very rarely hard-cuts from one screen
  state to another, and on a 2001 console it holds that even across the
  cutscene-to-battle handoff.
WHY: A transition that MOVES reads as faster than a cut that waits, even when
  the clock says otherwise. Motion tells you the machine is alive.
PORT: ADAPT
BECAUSE: Playtest dispatch item 7 is "THE GAME KINDA RUNS LIKE SHIT", measured at
  24.2 seconds to first play on throttled 4G. Some of that is real load and needs
  real optimisation, which is RUN's. But some of the FEELING is that our panels
  appear rather than arrive. That half is this lane's and it is cheap.
CAUTION: motion has a budget on a phone and this lane does not get to spend
  RUN's frame time. Transform and opacity only, never layout.

===============================================================================
MASTER: READ
===============================================================================

### FFX.R01  THE FUTURE IS ON SCREEN
LENS: signs and feedback + minimum workload (Hodent)
SCREEN: battle
WHAT: The CTB window is a stack of portraits along the upper right showing WHO
  ACTS NEXT, in order, several turns ahead. It is not a bar you interpret. It is
  a LIST you read.
WHY: FFX runs a hidden simulation — agility, action rank, tick counters. Instead
  of teaching the player that arithmetic, it does the arithmetic and shows THE
  ANSWER. The player never computes anything and still plans four moves out.
PORT: TAKE — AND THIS IS THE SINGLE MOST VALUABLE THING THIS ROUND FOUND.
BECAUSE: Bohemia is I-MOVE-YOU-MOVE on a 120 BPM clock, and combat is "Rogue
  Fable 4 with 120 BPM everything". The beat is the clock the turns run on. Right
  now that clock is a FELT thing with no picture: the player hears it and never
  sees who the next few beats belong to. FFX has the exact answer, shipped in
  2001, and we already have the data to fill it.
CAUTION: FFX's list is a tall column on the right of a 4:3 screen. On an iPhone
  in portrait the right edge is where the thumb lives (SHARED -5). Ours has to
  run along the TOP, or be short enough not to reach into the thumb.

### FFX.R02  THE PREVIEW IS THE TUTORIAL
LENS: form follows function (Hodent)
SCREEN: battle
WHAT: The turn list RE-SORTS LIVE while you are still choosing. Move the cursor
  onto a slow, heavy ability and watch your own portrait slide further down.
  Hover Slow and watch the enemy's icons fall.
WHY: The rule "weaker abilities cost less cooldown" is never written down
  anywhere. It is DEMONSTRATED, for free, every time the player compares two
  commands. The system teaches itself by being visible.
PORT: TAKE
BECAUSE: Every Bohemia ability that costs beats should show its cost as a change
  in the beat list BEFORE the player commits — not as a number in a tooltip and
  not as a surprise afterwards. This is also how the 60 mini-boss abilities get
  taught without sixty tutorials.

### FFX.R03  THE COMMAND LIST IS THE CHARACTER SHEET
LENS: form follows function (Hodent)
SCREEN: battle
WHAT: Every character's command menu is DIFFERENT. Rikku has Steal and Use.
  Auron has Break. Kimahri has Lancet. You learn who somebody is by reading what
  their menu offers, before you ever read a stat.
WHY: The menu is not a list of buttons, it is a portrait. Identity is expressed
  in what a person is ALLOWED to do.
PORT: ADAPT
BECAUSE: THERE ARE NO RUNS and there is ONE character for a hundred hours, so a
  menu cannot tell people apart here — there is only him. But the same law says
  60 MINI BOSSES each hand you A NEW WAY TO INTERACT WITH BOHEMIA. So the action
  list IS the experience tree made visible: what you can do is what you have
  beaten. The menu stops being a control panel and becomes a trophy case, and it
  grows for a hundred hours.

### FFX.R04  THE MENU REMEMBERS WHERE YOU WERE
LENS: minimum workload (Hodent)
SCREEN: battle, item list, shop
WHAT: The cursor returns to the last thing you chose. Attack stays under the
  cursor. The item you used last time is where you left it.
WHY: In a game with thousands of menu openings, one saved keypress each is a
  measurable amount of a player's life. Nobody ever notices this working. Every
  player notices it missing.
PORT: TAKE
BECAUSE: Cheap, invisible, and the demo will have people opening the phone and
  the action list hundreds of times in twenty minutes.

### FFX.R05  THE READOUT SAYS WHAT IT DOES, NOT WHAT IT IS
LENS: clarity (Hodent) · Pinelle/Wong/Stach (heuristics mined from what players
  actually complained about across 108 games)
SCREEN: battle target select, item list
WHAT: Selecting a target names it and shows the consequence in the same breath —
  the enemy's name, and whether this will help or hurt. The information appears
  at the moment of the decision, not in a screen you have to go find.
WHY: Information delivered late is information the player has to REMEMBER, and
  memory is the most expensive thing a UI can spend.
PORT: TAKE
BECAUSE: Directly serves NO ESSENTIAL INFORMATION BY COLOUR ALONE and its sister
  rule for sound: if the consequence is written at the point of decision, the
  player never has to have heard or seen a cue they missed.

===============================================================================
MASTER: DO
===============================================================================

### FFX.D01  NO CLOCK MEANS NO PANIC, AND THAT IS WHAT MAKES THE LIST READABLE
LENS: user control and flexibility (Hodent)
SCREEN: battle
WHAT: CTB replaced the series' Active Time Battle. The world PAUSES on your turn
  and you have an indefinite period of time to choose.
WHY: This is the finding under the finding. FFX's famous turn preview only works
  because there is time to read it. A preview you have no time to read is
  decoration. Square did not add a preview to ATB; they removed the timer FIRST.
PORT: REFUSE — AND THIS IS THE HARDEST THING IN THE ROUND
BECAUSE: Bohemia is 120 BPM and EVERYTHING QUANTIZES TO THE BEAT. We want FFX's
  readable list while running something closer to ATB's clock. That is a real
  tension and pretending it is not is how a study becomes a fan page.
  WHAT THIS LANE THINKS, ROUTED, NOT DECIDED: the beat should be the METRONOME,
  not the shot clock. I-MOVE-YOU-MOVE already says the world advances when you
  act. If standing still costs nothing, the player has all the time in the world
  to read the list, and the beat only decides WHEN the action lands, not how long
  you get to think. That keeps both. It is COMBAT's and RUN's call, not mine.

### FFX.D02  TARGETING IS A SENTENCE, AND YOU CAN STOP HALFWAY
LENS: error prevention and error recovery (Hodent)
SCREEN: battle
WHAT: Choose a verb, and only then the valid targets light up and an arrow bobs
  over the current one. Circle commits, Triangle backs out, at every step.
WHY: The mistake is caught before it costs anything. Two steps and a cancel is
  the cheapest error-prevention there is, and it is why nobody has ever rage-quit
  FFX for hitting the wrong thing.
PORT: TAKE
BECAUSE: UI-2 says THE ACTION BUTTON DOES ACTIONS AND NEVER CHANGES MEANING.
  A verb-then-target with a visible way out is exactly the shape that keeps that
  promise: the button always means "do the thing I have picked", and picking is
  reversible until the moment it is not.

### FFX.D03  THE SWAP IS FREE, BUT IT IS SCOPED
LENS: minimum workload + error prevention (Hodent)
SCREEN: battle
WHAT: On a character's turn you can swap them out for anyone on the bench with
  one button, at no cost in turns. But ONLY the character whose turn it is can be
  swapped. You cannot stand there cycling the whole roster for free.
WHY: A generous affordance with one honest limit. It puts the entire seven-person
  cast into every fight without a party-management screen and without letting the
  player abuse it.
PORT: ADAPT
BECAUSE: THERE ARE NO RUNS and there is no party, so the letter of it cannot
  come. The shape lands on the experience tree: the 60 mini bosses each hand you a
  new way to interact with Bohemia, and a hundred-hour kit needs a way to change
  what is ready WITHOUT a loadout screen. FFX's answer is the one to copy — the
  change is free, but only on the beat you were about to spend anyway, and only to
  the slot you were about to spend it on. No pause menu, no cost, no abuse.

### FFX.D04  THE BIG VERB IS EARNED BY A VERB YOU CHOOSE
LENS: form follows function (Hodent)
SCREEN: battle, character menu
WHAT: Overdrive is a per-character gauge sitting next to their HP that fills from
  what HAPPENS, then unlocks one big move. And Overdrive MODES let the player
  choose WHICH event charges it — taking damage, an ally taking damage, healing,
  and so on. You pick what your power is made of.
WHY: The gauge is not a timer. It is a record of how you have been playing.
PORT: TAKE
BECAUSE: THE LAW SAYS IT IN OUR OWN WORDS — "a real kit of abilities recharged by
  VERBS, not timers" (8/26, THERE ARE NO RUNS). His favourite game shipped that
  exact idea in 2001 and we did not notice it was already solved. Overdrive Modes
  are the closest thing in any Final Fantasy to the rule we wrote down this week.

===============================================================================
MASTER: WORLD
===============================================================================

### FFX.W01  THE SAVE POINT IS A THING YOU WALK TO
LENS: diegetic UI (Fagerholt & Lorentzon: inside the fiction AND inside the
  geometry) · signs and feedback (Hodent)
SCREEN: the world
WHAT: A Save Sphere is a glowing object standing in the world. You walk to it and
  touch it. It saves, it heals, and its presence is a warning: something is about
  to happen, this is the last quiet place.
WHY: One object doing four jobs — a save, a heal, a landmark, and a held breath —
  and it costs zero screen space because it IS the screen.
PORT: TAKE
BECAUSE: Bohemia already puts SLEEP (8 HOURS, SAVES) on the action button. Making
  the save a PLACE instead of a menu row is more Bohemia than any menu will ever
  be, and it wires straight into two other rulings: DANGER BY PLACE (Valheim-style
  district tiers) and LIGHT = TERRITORY. A place you can save is a place somebody
  is keeping the lights on. The safe map and the light map become the same map.

### FFX.W02  THE INTERFACE TEACHES YOU A LANGUAGE, ONE LETTER AT A TIME
LENS: meta UI (Fagerholt & Lorentzon) · the fiction axis
SCREEN: dialogue, everywhere
WHAT: Al Bhed characters speak in what looks like gibberish. Scattered across the
  world are Al Bhed Primers, and each one you find permanently decodes ONE LETTER
  — everywhere, retroactively, for the rest of the game. Your interface literally
  becomes more legible the longer you play.
WHY: Comprehension as progression. Nothing else in the medium does this. It makes
  a hundred-hour game reward attention with UNDERSTANDING rather than with stats.
PORT: ADAPT, AND THERE IS A HARD LIMIT
BECAUSE: THEY SPEAK SPANGLISH (8/25, LOCKED) and that law has a hard rule inside
  it: LANGUAGE NEVER GATES REQUIRED INFORMATION. FFX's version DOES gate
  information behind language — that is the whole mechanic. So we cannot take it
  as built. HIS OWN LAW AND HIS FAVOURITE GAME DISAGREE HERE, and naming that is
  the job. What ports is the shape applied to things that are NOT required: the
  graffiti, the faction tags, the radio, the parts of the valley that are
  atmosphere. Never a quest step, never a name, never a direction.

### FFX.W03  THERE IS ALMOST NO HUD, BECAUSE THERE IS ALMOST NO DECISION
LENS: non-diegetic minimisation (Fagerholt & Lorentzon)
SCREEN: the world
WHAT: Walking around Spira there is essentially nothing on screen. No minimap, no
  compass, no health bar, no quest marker. FFX is famous for it.
WHY: It can afford that because FFX is a CORRIDOR. There is no world map for most
  of the game. The level does the navigating, so the interface does not have to.
PORT: REFUSE — AND THIS IS THE ONE THAT CUTS AGAINST US HARDEST
BECAUSE: Bohemia is an open valley of 27+ districts and he has already reported
  being "launched into a random part of the city" and walking through it lost.
  A clean empty screen is not a style you choose, IT IS SOMETHING A CORRIDOR PAYS
  FOR. If we copy the empty screen without the corridor we get a beautiful HUD
  over a player who has no idea where he is. We have to EARN the empty screen with
  landmarks and light, not declare it. Anyone who quotes "FFX has no HUD" at this
  project without quoting this paragraph is quoting half a finding.

### FFX.W04  THE TEXT BOX IS THIN BECAUSE THE PERFORMANCE IS THE CONTENT
LENS: the fiction axis (Fagerholt & Lorentzon) · clarity (Hodent)
SCREEN: dialogue
WHAT: FFX was the first Final Fantasy with voice acting. The characters are on
  screen, lit and acting, and the subtitle is a thin band at the bottom that gets
  out of the way.
WHY: The box is small because the box is not carrying the scene. The actors are.
PORT: REFUSE
BECAUSE: WE HAVE NO VOICE ACTING AND WILL NOT HAVE ANY. Every ounce of the
  performance in Bohemia is carried by the words and by a 112px pixel face. So our
  dialogue sheet must be the OPPOSITE of FFX's: bigger, with the speaker's face
  IN it, with room for the line to breathe — which is what the run already does.
  Copying FFX's thin band here would be copying the consequence of a budget we do
  not have. The current sheet is right and this study says so.
