# BOHEMIA — THE UI CATALOGUE: EVERYTHING THE PLAYER CLICKS AND SEES (7/28/26)

Paolo's order: *"catalogue and think about all the type of things and our systems
we will need to present in the game... what will be part of our menus/phone? and
the directional movement and action buttons and other shit. combat too... dont
code anything in the game yet."*

Research, not construction. Two halves: what the outside world has learned about
game UI, and what OUR OWN 99 engine modules and ~250 laws already demand a
surface for. Nothing here is built. Nothing here is canon until he rules it.

---

# PART 1 — THE FOUR RULES THIS GAME'S UI ALREADY HAS

Before any list, these are already LOCKED and they eliminate most of the options
a normal game would consider. Writing them down first stops us designing a menu
he has already banned.

**1. THE PHONE IS THE MENU (the Pip-Boy read).** SOCIAL_FEED_QUEST_LOG (7/20,
LOCKED): the quest log is *not* a Skyrim menu list, it is a social-media phone
app. This is a DIEGETIC interface — the menu is an object inside the world, the
way Fallout's Pip-Boy is a thing on your wrist and Dead Space's health bar is
printed on Isaac's spine. Research consensus on why that works: the interface
never breaks the fiction, and the player learns the world's rules by using its
objects. The cost, also documented: diegetic UI is SLOWER than an abstract menu,
so anything used constantly must NOT live behind it.

**2. NO INVENTORY GAME.** NO_INVENTORY_GAME (7/26, from the Zomboid verdict):
"inventory game was ass." No weight-shuffling, no bag-Tetris. Carry lives in the
fiction (the cart, companions). LOOT_IS_RESOURCES_FAST (7/26): a searched
container resolves FAST. **This kills the single biggest menu in most survival
games.** Whatever inventory surface exists is small and quick.

**3. THREE CURRENCIES, DISPLAYED AS ICONS.** THREE_CURRENCIES_CENTURY (7/26):
RESOURCES (apple = food, duct tape = materials, a third [PENDING]), ELECTRICITY
(batteries), CLOUT. Anti-reference named by him: *"spreadsheet simulators and
I'm not a fan."* So the economy readout is three icons and a number. Not a
table.

**4. ONE CONTEXTUAL ACTION BUTTON.** His own ruling from the lab: *"walk
somewhere, ONE contextual action button that changes by what you're standing at,
act, spend time, the world resolves."* Already built in the run. This is the
opposite of a 6-button action bar and it is the spine of the whole control
scheme.

---

# PART 2 — THE FOUR SURFACES

Everything the player ever sees is on one of four surfaces. Naming them stops us
inventing a fifth by accident.

| surface | what it is | how you get there |
|---|---|---|
| **THE WALK** | the world, 3/4 top-down, your body in it | the default; where you live |
| **THE PHONE** | the menu, in-fiction | a button on the walk HUD (his "press tab" / tap the screen) |
| **THE FIGHT** | Dead Eye Dial combat | an encounter takes you there and gives you back |
| **THE CITY** | the 100-year rebuild, top-down | [PENDING — see the open question at the end] |

---

# PART 3 — THE PHONE (the menu)

## 3a. WHAT ALREADY EXISTS AND IS WIRED
Built and live in the LIFE/phone slice: **HOME (lock screen) → NETWORK app with
five bottom tabs: FEED / QUESTS / DMs / LOG / ME**, plus **MAP** and **WALLET**
tiles. Push-notification banner works over any screen (Cyberpunk 2077 pattern,
researched 7/21) and taps through to the relevant thread.

## 3b. THE FULL APP LIST — what the systems demand

**NETWORK** (locked, exists) — one app, five tabs:
- **FEED** — one post per completed quest, with a picture and comments. Comment
  volume scales with followers. No CLOUT badge (killed 7/21 — the data drives
  it invisibly).
- **QUESTS** — offers you can accept. Quests surface *through* the feed.
- **DMs** — handle-based, no phone numbers (7/21: "if WhatsApp and Instagram
  combined"). Unread dot.
- **LOG** — TOTAL RECALL. Everything is remembered, no exceptions.
- **ME** — followers + posts. Only those two stats (7/20: quests-done was
  dropped as redundant).

**MAP** (exists) — the ONE valley map (ONE MAP law, 7/27): the same world the
city builder shows, quest pins on top, tap a cell to see what is really there.
Your own blip.

**WALLET** (exists, thin) — the three currencies. Resources / Electricity /
Clout as icons + numbers. This is where THREE_CURRENCIES lands.

### APPS THE SYSTEMS DEMAND THAT DO NOT EXIST YET
Each of these is a real engine module or locked law with no surface:

- **CREW / COMPANIONS** — `bohemia_agents`, COMPANIONS_BROTHERHOOD (7/26). Who
  is with you, what they carry (carry lives in the fiction, so this is where
  "what am I hauling" actually reads), their state.
- **CAMP / THE CART** — THE_CART_AND_CAMP (7/24), the mobile base + comfort
  tiers. Deploy, upgrade, rest. Its roster is [PENDING him].
- **SELF / BODY** — `bohemia_bodyvar`, `bohemia_dress`, DRESS_CODE_BY_RANK
  (7/21). What you're wearing and what it says about your rank. This is the
  light-touch "inventory" the no-inventory law permits.
- **FAMILY / DYNASTY** — GENERATIONAL_PERSISTENCE, SUCCESSION_AND_BUNKERGUY,
  FAMILY_CORE_THEME. The game is a 100-year dynasty across 3 acts and there is
  no surface for the family at all.
- **HEALTH / CONDITION** — `bohemia_economy` hunger/thirst, injury state,
  DEATH_MATH_AND_ICONS (7/5). Where survival accounting reads out.
- **FACTIONS** — `BOHEMIA_faction_graph.json`, 14 factions, standing with each.
- **CAMERA / PHOTOS** — the feed posts carry "a picture of the deed". Something
  takes that picture.
- **SETTINGS** — see Part 6.

## 3c. THE PHONE'S OWN RULES
- It must open and close FAST (the diegetic-UI cost above). His "press tab"
  instinct is right: one dedicated button, not a menu path.
- It is a phone in a world where *"the telecommunications industry went to
  shit"* — a patched-together relic. That is a look, not just a fiction.
- TOUCH GUARD applies: nothing on it may be selectable text (7/28 — holding a
  control raised the iOS copy menu).

---

# PART 4 — THE WALK: HUD + CONTROLS

## 4a. WHAT IS ON SCREEN WHILE WALKING (currently, in the run)
Measured off the live run: objective bar, music toggle, menu button, the
character, a d-pad (8 directions, another lane replaced the 4-way), ONE action
button with a label, a toast line, the phone overlay, a dialogue panel.

## 4b. WHAT THE HUD SHOULD CARRY — and the research
Research on thumb zones is unambiguous: **essential controls belong in the
bottom half, at the sides, where a thumb naturally rests, and the centre of the
screen must stay clear** because a thumb over the middle covers the game. Rank
actions by frequency and give the frequent ones the best real estate.

For Bohemia that ranking is:
1. **MOVE** — constant. Bottom-right or bottom-left cluster, generous hitboxes,
   direction changeable without lifting the thumb (documented as the single
   biggest virtual-d-pad failure).
2. **THE ONE ACTION BUTTON** — constant. Opposite thumb. Its LABEL changes to
   what you're standing at (talk / enter / use / sleep / hang out / search).
3. **PHONE** — frequent but not constant. Edge, small.
4. Everything else — inside the phone.

**The open control question, and it is his:** the run currently ships four
walk feels as toggles (GRID / SLIDE / HYBRID / FREE) precisely so he can feel
them rather than be asked in text. Still unjudged.

## 4c. WHAT THE HUD MUST SHOW WITHOUT A MENU
- **TIME** — TIME_IS_SPENT_BY_ACTIONS: the world advances when you spend time,
  so the clock is a live consequence of your last action, not decoration.
- **CONDITION** — some minimal read of hurt/hungry. Not a bar farm.
- **A NOTIFICATION BANNER** — already built, fires over anything.
- **THE BEAT** — 120 BPM LAW. Whether the beat is *visible* is an open design
  question and a sore one: THE_FIGHT_PULSE (7/26) records that he could not
  feel the beat across five verified attempts, and a mechanics freeze is in
  effect until music and button work together.

---

# PART 5 — COMBAT

## 5a. WHAT EXISTS
The Dead Eye Dial: a timing dial, cover, pop-out, exposure lines, incoming fire
cam, downed state. Laws already locked: EVERYTHING_ON_BEAT_AND_THE_DOWNED,
STAMINA_NEVER_COSTS_A_TURN, THE_QUANTIZED_FREEZE, PACIFIST_PATH_LAW.

## 5b. THE BUTTONS A FIGHT NEEDS
Research on turn-based tactics UI: a normal activation is a MOVE action plus a
FIRE action; the interface must show possible targets and the stats needed to
choose *before* committing; cover state must be readable as a symbol, not a
number to memorise.

Mapped to what our laws already say:
- **MOVE / REPOSITION** — costs time (time is spent by actions).
- **THE DIAL** (attack) — already the centrepiece.
- **COVER / POP-OUT** — exists; popping into exposed guns resolves their shot
  first (7/4).
- **STANCE** — crouch/stand; facing is auto-derived from exposure (7/4).
- **RELOAD** — [not found in any law; flagging as a real gap]
- **SWITCH WEAPON** — needs a ruling; wardrobe is canon but armament is not.
- **USE / HEAL** — must obey LOOT_IS_RESOURCES_FAST and
  STAMINA_NEVER_COSTS_A_TURN.
- **TALK / SPARE / FLEE** — PACIFIST_PATH_LAW is locked: a quiet fix must be a
  complete run. So a fight needs a non-violent exit button, and the run already
  proves both forks end a quest.
- **COMPANION ORDER** — COMPANIONS_BROTHERHOOD is canon; nothing commands them.

## 5c. WHAT COMBAT MUST DISPLAY
Health (yours + theirs), whose turn/beat it is, cover state per body, line of
fire and whether it is blocked, the dial itself, and the outcome. Research note
worth heeding: **health and threat readouts must update in real time as the
player hovers/considers, or a tactics UI feels like guessing.**

---

# PART 6 — SETTINGS (he asked specifically)

Modern baseline, from the 2025/2026 accessibility research. Marked by whether
one of our laws already forces it.

**AUDIO**
- Master / music / SFX / dialogue sliders — *and note the OFF MEANS SILENT law
  (7/27): a control that says off must actually silence, gated.*
- Music on/off already exists in the run.

**VISUAL**
- Text size + contrast (research: scaling up to ~52px at 1080p is now normal).
- Colorblind modes — remapping HUD separately from the world.
- HUD toggle / opacity / size, per element or by preset.
- Reduce motion / screen shake — our own JUICY_COMBAT and shake work makes this
  mandatory.
- Brightness — non-negotiable in a game whose whole premise is 12% of the city
  is lit (CLUSTERED POWER, LIGHT=TERRITORY).

**CONTROLS**
- Walk feel (GRID / SLIDE / HYBRID / FREE) — already a live toggle, awaiting his
  pick.
- Button layout: left/right cluster swap, and reposition where feasible.
- Hold-to-walk sensitivity — already tuned once.
- Hit-target size — research: hitboxes should exceed the visible art.

**SUBTITLES / TEXT**
- Speaker names, background panel, size range, conversation log. Our dialogue
  system already has speakers and portraits.

**GAME**
- Save / load / export code — SAVES_AND_CLOUD (7/26) is locked: sleep saves +
  manual + autosave, ONE portable blob, device prefs NEVER travel in the save.
  Already built and gated in the run.
- DEATH IS A RELOAD (7/26) — losing loads the closest previous save. Never a
  reset. Already built.
- Difficulty — [PENDING him]. Note the tension he named himself: *"this game is
  hardcore but for normies to enjoy too."*

**ACCOUNT / DEVICE**
- The one-link law means no URL-based state; everything is the save blob.

---

# PART 7 — THINGS EVERY GAME NEEDS THAT WE HAVE NOT NAMED

Honest gaps, listed so they are not discovered at ship:
- Title / front screen (exists: the splash + build stamp).
- New game vs continue.
- A death screen (death is a reload — so what does it *look* like?).
- Act transitions — the game spans 3 acts and 100 years.
- Tutorial / first-run teaching. He is the only playtester; a stranger has
  never been considered.
- Pause. (Does I-MOVE-YOU-MOVE even have a pause? Arguably the world is always
  paused. Worth a ruling.)
- Loading / streaming feedback.
- Credits.
- An icon per build — ICON_WITH_EVERY_BUILD (7/27) is already locked.

---

# PART 8 — WHAT I DID NOT DECIDE

Every one of these is his:
1. **Where the phone button lives and what opens it** (his "tab" instinct).
2. **The walk feel** — four are live and unjudged.
3. **The third resource icon** — apple and duct tape are locked, the third is
   [PENDING] in the currencies law.
4. **Whether the beat is visible on the HUD** — blocked behind the fight-pulse
   freeze.
5. **Difficulty**, and what "hardcore for normies" means as a setting.
6. **Reload / weapon switching** — no law covers armament.
7. **RUN tab = the run or the city** — still open from earlier today.

---

## SOURCES (outside research)
- [Beyond the HUD: The Power of Diegetic Interfaces](https://www.wayline.io/blog/diegetic-interfaces-game-design)
- [Designing Effective Diegetic UI: Dead Space vs The Callisto Protocol](https://medium.com/@jaiwanthshan/designing-effective-diegetic-ui-lessons-learned-from-dead-spaces-success-and-the-callisto-dbf803639dd6)
- [Game UI/UX Design Principles: HUD, Menus, and Feedback](https://www.strayspark.studio/blog/game-ui-ux-design-principles)
- [A designer's guide to building touch controls — Microsoft GDK](https://learn.microsoft.com/en-us/gaming/gdk/docs/features/common/game-streaming/building-touch-layouts/game-streaming-tak-designers-guide?view=gdk-2604)
- [Touch Control Design: Ways Of Playing On Mobile](https://mobilefreetoplay.com/control-mechanics/)
- [Mobile touch controls — MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Control_mechanisms/Mobile_touch)
- [Mobile Controls — Game UI Database](https://www.gameuidatabase.com/index.php?scrn=147)
- [2025 Video Game Accessibility Recap — Access-Ability](https://access-ability.uk/2025/12/05/2025-video-game-accessibility-recap/)
- [Accessibility Standards / Advancements — Access-Ability](https://access-ability.uk/2025/02/21/accessibility-standards-advancements-2025-needs/)
- [Turn-Based Action Selection and UI design — GameDev.net](https://gamedev.net/forums/topic/694033-turn-based-action-selection-and-ui-design/)
