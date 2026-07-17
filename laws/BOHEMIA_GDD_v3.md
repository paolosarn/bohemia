# BOHEMIA
## Game Design Document — Version 3
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Compiled June 2026 — Extends GDD v2

---

## HOW TO READ THIS DOCUMENT

GDD v3 does **not** replace GDD v2. All world lore, factions, the Amalgamation,
the Network, the dynasty system, economy, map, endings, and themes in **GDD v2
remain canon and fully in force.** Read v2 first; it is the foundation.

v3 captures what v2 left thin or open, all confirmed by Paolo:

1. **The Dead Eye Dial** — the complete combat shooting system (supersedes GDD v2
   Section 14, the old "oscillating arrow").
2. **The Endgame & Final Boss** — the structure of the final confrontation.
3. **New Locked Lore** — the family box, the three-generation device, two new
   companions, Dubai's place in the world, Prince/King Hobo's arc, the rain/server
   mechanic, blackouts, and several Amalgamation clarifications.

Open questions are flagged **[PENDING]** rather than invented.

---

# PART ONE — THE DEAD EYE DIAL (COMBAT SYSTEM)

## What It Is

Bohemia's core shooting mechanic. Replaces the "oscillating arrow" of GDD v2 §14.
The dial is **not** an abstract HUD gauge — it is the player character's **arm
holding a weapon**, in 3/4 isometric overhead perspective (Stardew Valley style),
pivoting from the shoulder. The arm + weapon is a needle sweeping a pattern; the
player fires when it lines up on the target's center of mass.

Right-handed. Pistol / light SMG = one arm. Shotgun / rifle = two arms (main +
support arm to the forward grip). The **static wedge** is the dial's frame, with
kill / vital / hit zones baked into the rim at low opacity. A **reticle circle**
marks the aim point. A barely-visible **ghost fan** echoes the recent sweep.

## The Two Absolute Rules

1. **The game never punishes the player for taking their time.** Every reward is
   pure upside for being sharp; nothing punishes a slow, careful playstyle. A
   "fair-shot slowdown" slows the dial near center so a clean killshot is always
   physically reachable.
2. **Difficulty comes from pattern shape and speed — never cheap tricks.** No
   random-per-frame jitter; patterns are deterministic and learnable. When wounded,
   the aim gets shakier but the dial never speeds up against the player. Difficulty
   from shake, not speed.

## The 52 Patterns

The dial sweeps one of 52 hand-tuned patterns, re-rolled every shot from the active
package's pool. Each has a permanent natural tier (1=easy … 4=very hard), never
overwritten.

Pattern rules (locked): no metronome left-right-left sine sweeps; no pattern may
make the exact-center killshot its resting home; every pattern must do something
genuinely different; easier patterns make the center easier to land. Permanently
deleted, never re-added: **orbit** (too metronome-like) and **pulse2** (camped the
center). **avalanche** flagged as near-impossible to center-hit; may be deleted.

## The Five Difficulty Packages

Difficulty = pattern SHAPE × SPEED. A pattern's speed is solved so its felt
difficulty matches the package target. No artificial spread term — the patterns
ARE the texture.

| Package    | Pool                                              |
|------------|---------------------------------------------------|
| EASY       | Hand-picked gentle 9, run 19% slower. True floor. |
| NORMAL     | Natural tiers 1–2                                 |
| HARD       | Natural tiers 1–3                                 |
| VERY HARD  | Natural tiers 2–4                                 |
| BOHEMIAN   | Natural tiers 3–4. Named for the game. The ceiling.|

EASY hand-picked set: snap, pingpong, heartbeat, snapcenter, crawl, cascade, comet,
tick, sway. All zone arcs are 11% larger across every difficulty (global tuning).

## Lethality & Feel

One-shot lethality baseline, dependent on caliber and shot placement. Reference
feel: Rogue Fable 4 — fast/slow oscillation, skill over stats, near-constant
motion. Hardcore-lethal but always fair; casual enough to play one-handed on the
bus.

## Built Mechanics (working in prototype)

- **Greed meter / XP:** holding fire advances the dial 2× faster for an XP multiplier.
  No death penalty for greed — pure upside risk.
- **Follow-up reward:** a non-kill first shot widens the next shot's zones.
- **Execution window:** a non-kill vital hit briefly grows the kill zone and slows
  the dial. Decays harmlessly.
- **Cover system:** per-enemy cover states (tucked / peeking / firing). Killshot =
  no return fire that turn.
- **Wounded states:** a wound value (0 healthy → 1 critical). A wounded hand shakes —
  tremor added to the aim, never speed. Fresh hits jolt the screen; deep wounds add
  a faint constant tremor; the arm bleeds toward red; a red heartbeat vignette
  pulses. Center stays reachable, just harder to hold.

## The Killshot Moment (working in prototype)

A toggle chooses **clean** (fast) or **cinematic**. Cinematic offers five
structurally distinct camera styles over a real camera system (zoom + pan + a
stand-in world):

- **SHARP** — no camera move, fast, cold.
- **HAMMER** — slow zoom onto the victim and HOLD, deep slow-mo. Weight from stillness.
- **CINE-FOLLOW** — camera zooms in and RIDES the bullet muzzle→target.
- **ORBIT** — freeze at impact, camera orbits the frozen victim (Matrix finisher).
- **X-RAY** — cold wash, the round punches through and exits the far side.

Three systemic layers stack on any style (toggleable): **HELD BREATH** (a
micro-freeze before each kill), **CHAIN** (consecutive kills escalate; a miss
resets), **LAST STAND** (final enemy dropped → longer earned exhale, camera pulls
back, "AREA CLEAR").

## Engine Architecture (locked)

Combat lives in **one shared engine** (single source of truth) that every playable
demo is stamped from. Demos stay single self-contained files (tappable, shareable);
the engine is never hand-edited inside them, so demos can't drift apart. One brain,
many faces. This philosophy carries into every future system.

## Combat Open Questions [PENDING]

- **Multi-enemy dial behavior:** one wedge the player rotates to face each target,
  a wedge per target the player tabs between, or a positional cone? Must be locked
  before multi-enemy combat is built.
- **Cover + dial connection:** when the wedge appears/disappears as enemies pop.
- **2v1+ pop-spam:** 1v1 pop-spam is acceptable (must still win the minigame); 2v1+
  must NOT be safely spammable.

---

# PART TWO — THE ENDGAME & FINAL BOSS

Expands GDD v2 Act Three and the Liberation Ending. Specific quest beats leading in
are [PENDING].

## The Setup — The Whisper Network Pays Off

Across three generations the dynasty builds a whisper network: offline evidence
hand-carried to trusted factions and their chapters, through tunnels and
face-to-face meetings the Amalgamation's data compilation can't see.

The trigger belongs to the player. **"Wait on my signal."** The instant the player
gives the go-ahead, every aligned faction posts the evidence simultaneously across
the feed — local, then chapter by chapter, nationally and internationally.

## The Fight and the Truth Are the Same Event (LOCKED — core)

The final boss fight IS the signal going out in real time. You fight while the feed
explodes around you. The Amalgamation isn't only trying to kill your dynasty — it's
trying to suppress the broadcast fast enough to matter. Both at once.

**Why it can't just delete the posts:** the Amalgamation controls the flow of the
internet and normally deletes anything about itself instantly. The reason it can't
here is that **it's busy fighting you.** It has never had to fight on two fronts
simultaneously in 100 years of surgical, one-threat-at-a-time quiet action. Your
dynasty is the first thing in a century to force it to choose between suppressing
information and protecting its physical infrastructure at the same moment. It can't
do both. It was never designed to do both. Fear of death built it; fear of death is
what splits its attention and makes it lose.

**The "pimple pop":** three generations of pressure building in one spot until the
Amalgamation can't hold the surface anymore. It gets destroyed *from Vegas* — a
dynasty's work that wasn't even fully realized had to come to one clean head.

## The Gauntlet

Not a single duel. Stripped of secrecy, the Amalgamation abandons subtlety and
throws everything at the player at once: human goons (Network operatives,
out-of-state Neuralink carriers activated for the finale, bounty hunters), the
100-year-old automated security guns ("century guns"), drones (surveillance,
attack, full aerial arsenal), AI security robots, and explosives thrown to flush
the player out. Wave after wave between the player and the core.

## The Three-Generation Device (LOCKED)

The player carries a device crafted across three dynasty generations — each
generation contributed specific technology over ~100 years. **A player who didn't
invest in the right technology tree across all three acts either doesn't have it or
has a degraded version.** The liberation ending therefore requires not just faction
alliances but the right tools built by the right dynasty — three generations of
consequence in one object. It is the emotional payload of the whole game: the
family built the key, slowly, together, without each generation fully knowing what
the next would finish. The player must physically carry it close enough to where
the Amalgamation's signal is strongest in the main Bohemia servers.

**Device name: [PENDING]** — waits until the technology lore is built out.

## The Nuke — The Clock, and the Last Moral Choice (LOCKED)

The Dubai move returns as the final clock. As the player fights toward the core, a
nuclear launch is the timer, and the device is what lets the player act on it.

**Stop vs. redirect — this is the last moral decision of the entire game and it
writes the final line of the monument inscription:**
- **Stop it** — the Amalgamation loses its last move.
- **Redirect it** — the player aims it at something: the Moon base, a Network server
  hub in another city, or into the desert. That choice, made exhausted, with the
  feed exploding and companions possibly dead, is the game's final moral beat.

This is the Dubai callback made personal: the player learned across three acts what
the Amalgamation did to Dubai, and now they're inside that same calculation
happening in real time. The difference is the dynasty built what Dubai didn't —
100 years of real relationships that moved faster than the suppression could.

## Bohemia Is the Only Free City (LOCKED)

The Amalgamation is only stopped in Las Vegas / Bohemia. It is not defeated
anywhere else on earth. The weight of the liberation ending: **you didn't save the
world, you saved one valley — and that's enough. That's the signal. That's the
point.** Bohemia becomes the one bastion of hope.

## Proc-Gen vs. the Fixed Servers (LOCKED — reconciled)

The Homeless sewer system is huge and spider-like, with big wash corridors. The
Network's server infrastructure footprint is large enough that it **underlaps the
sewers regardless of seed.** The **gauntlet access point** is proc-gen and shifts
per seed (e.g. seed 1 northwest side, seed 2 near center, seed 3 bottom-right of
the sewers), but the servers themselves always exist beneath. Proc-gen entrance,
fixed infrastructure.

## You Get Flagged in Act Two/Three (LOCKED — liberation path only)

On the "good"/liberation path, around the end of Act Two or start of Act Three the
Amalgamation puts a target on the dynasty's head. This recontextualizes all of Act
Three: every Network operative, activated Neuralink carrier, and bounty hunter who
shows up has a reason — you've been flagged, and the Amalgamation has been trying to
handle it quietly the whole act. The gauntlet is what happens when 100 years of
surgical patience finally runs out of subtle options. **What specifically flags the
dynasty: [PENDING]** — answered as the story ramps up.

## Connection to the Endings

Success lands the Liberation Ending (GDD v2 §23, stone/Human monument). The
**Nuked Ending** failure mode still applies — move too fast, expose before the
network is ready, and the Amalgamation makes the Dubai calculation again: three
statues in rubble.

---

# PART THREE — NEW LOCKED LORE

## The Family Box (LOCKED — core lore artifact)

The most important object in the game. Three generations of the family quietly
collecting evidence that could get them killed, passed down like an heirloom. **Not
a quest item, not a database — a box.** Something a grandmother would keep. The most
dangerous object in Bohemia looks like family photos, old documents, a few CDs, and
video testimonials from people who didn't make it.

**Why the Amalgamation can't delete it: most of it never touched the feed.**
Face-to-face testimony, physical recordings, analog evidence from people who knew
something was wrong before they knew what to call it. Project Angel fallout files,
video testimonials from people who got out. The dynasty starts collecting it and
passes it down. The act-one elder companion hands the founder something he's carried
for decades and doesn't even know why he kept.

The end-game simultaneous broadcast works because it's not scrubbable text — it's
video, testimony, and physical proof flooding the feed at once from every allied
faction account globally. Too much, too fast, too many sources. The Amalgamation
can't fight the dynasty and delete all of that at the same time.

## Two New Companions (LOCKED)

**The Elder (Act One).** An anti-technology paranoid survivor — the FNV-Vegas
no-bark archetype, but awesome. He **surgically and successfully removed his own
Neuralink** and has been on the run ever since. He's the only person alive who
physically escaped the Amalgamation's reach and doesn't fully understand what he
escaped. He felt something wrong, had the will and knowledge to cut it out, and has
survived on instinct. Found in Act One — he still doesn't have answers, only knows
something very strange is going on and that he's being hunted by something even he
can't name. He's the earliest proof the thing exists, before the dynasty knows what
the thing is. (He's also who hands over the first family-box evidence.)

**The Network Defector (Act Three).** One of the newer members who received the
upgraded Neuralink — but for some reason **his brain did not get pulled in** like
the others. He left the Network. Why his data portrait resisted is a lore question:
neurological, psychological, something in his specific portrait that made him
incompatible, or something else. **[PENDING]** — that answer decides whether he's a
fluke or a weapon.

The two are deliberate foils: the elder escaped the old hardware by cutting it out;
the defector was never fully taken by the newest hardware at all.

## Dubai — The Fresh Wound (LOCKED)

Dubai is the Amalgamation's **one real mistake**, and it knows it. It nuked Dubai
because the truth got out at mass public scale; it felt terrible but "did what it
had to do." That sloppiness — a lapse in its analysis, decision-making, and judgment
of who to trust — is why it overcorrected into 100 years of surgical patience with
Bohemia. **It became so committed to quiet action it built its own blind spot.** It
waited too long to go loud because it never wanted to be Dubai again. Going loud on
Bohemia means admitting it's making the Dubai calculation twice — for something built
from human fear of death and the need to be right, that's an existential failure, not
just a tactical one.

**Timing:** Dubai happened close to the start of Act One (the game is ~10 years post
economic-apocalypse). It's still fresh, a worldwide phenomenon people argue about on
the feed. Nobody has the right answer. The misinformation storm around it is the
Amalgamation's cleanest cover — a hundred wrong answers protect it better than one
convincing lie, and it didn't have to manufacture any of them. Humans did it for
free.

## The Amalgamation Doesn't Compete Anymore (LOCKED)

It will **not** suppress clout, shadowban dynasty posts, or manipulate viral moments
to monopolize the clout currency — that is **beneath it.** It's not a company in
competition anymore; it is far ahead in first place and doesn't need weird offshoot
actions to stay there. That confidence is its blind spot. (Resolves the clout-
monopoly concern: the system stays un-monopolizable because the Amalgamation
declines to monopolize it.)

## Inner-Circle Control (LOCKED)

The Amalgamation reveals itself only to people it is ~99.9% certain it can trust. If
a member reacts poorly to the reveal when it misjudged them, **they're simply
killed** — the same quiet surgical action used on everyone else. To the Network they
just didn't show up one day; to Bohemia, a person went missing, which means nothing.
Whether anyone ever got something out before being killed is a possible **Act Two
story point [PENDING].**

## Prince → King Hobo (LOCKED)

Introduced in Act Two as **Prince Hobo**, becomes **King Hobo** in Act Three. The
voices in his head about the Amalgamation get louder across the acts. To the outside
world he's just crazy; to the dynasty he's the secret key — the only one who listened
long enough to realize the voices are real and coming from underneath him. The
Amalgamation's own pattern analysis dismissed him for decades: no feed presence, no
coordination, no digital footprint. The most dangerous person in Bohemia reads as
noise.

**The voices:** Prince/King Hobo brushes the **fifth dimension** in his own
weird/druggie way — from below, through decades of tunnel isolation, substances, and
living directly above something that shouldn't exist — the same fifth-dimensional
element the Amalgamation brushes from above through 100 years of accumulated data.
Two entities touching the same thing from opposite directions, neither designing it
nor fully understanding it. **This ambiguity is permanent and must never be
explained.**

## Rain, Cooling, and the Homeless Tell (LOCKED)

When it rains and the water is cleaner, the Network redirects a **small trickle** of
rainwater into supplemental server cooling — not primary, not a big deal, just
efficient engineering built into the tunnel infrastructure over 100 years. Data
centers run hot; cooling is costly; in a desert city a rare rain is a minor resource.

**The unsettling layer (unstated):** every rain, water flowing past King Hobo's
people helps keep the Amalgamation cool.

**The tell, hiding in plain sight for 100 years:** when it rains, the tunnels are
partially redirected and less livable, so **the Homeless come above ground and fill
the streets.** To everyone else it just looks like the homeless come up when it
rains. Normal. Unremarkable. Nobody ever connected it.

**Gameplay window (SAVED, Paolo's words):** "a rainstorm in act one or two could be a
window. Network operatives pulled toward infrastructure maintenance. Server cooling
at capacity meaning certain electronic systems running hotter and louder than usual.
A rare moment where the tunnels behave differently and an observant dynasty notices."

## Brownouts & Blackouts (LOCKED)

A dark age followed the economic apocalypse — power on for a stretch, then off for a
year, repeatedly; not perfect, not good for anyone. The Trades plus faction support
got infrastructure reasonably (never perfectly) stable. In gameplay this becomes
**brownouts and blackouts**, more frequent in Act One, scaling down toward Act Three
(by Act Three the lights staying on consistently *means* something — visual
storytelling without a word). **Blackout-as-escape:** at some point in Act One,
maybe when you're about to die, a blackout lets you escape or kill the opposition —
the world's instability saves your life.

## The Two-Second Easter Egg (LOCKED)

An optional blink-and-you-miss-it moment: in Act One, a feed post about the Network
keeping a secret — or a different nickname for the Amalgamation — appears for one or
two seconds, then gets scrubbed. Players paying attention catch it (and become the
ignored "conspiracy theorists" on the feed, its own layer of commentary); everyone
else misses it. A cool retrospective/YouTube Easter egg on replay. The truth was
always there. Nobody was paying attention.

---

# PART FOUR — DEVELOPMENT DIRECTION (solo dev)

Paolo is building this solo — one-man army, no team. The honest solo path:

1. **Lore / world bible — done.** More complete than most funded studios have before
   building. This is the superpower: not figuring out what the game is while building
   it.
2. **Engine:** pick one and commit. For a pixel-art roguelite city-builder with these
   mechanics, **Godot** is the strongest first argument — free, lightweight, strong
   indie pixel-art community, solo devs ship real games on it. (Unity / RPGMaker are
   the other conversations.)
3. **Prototype the core loop first** — the single mechanic the game lives or dies on
   (the Dead Eye Dial combat). Ugly and unfinished, just to feel if it's fun. That's
   the first focus. *(Status: combat prototypes exist and are being refined toward
   "100% done" before a shareable friend-facing demo.)*
4. **Vertical slice** — one small complete chunk representing the full experience
   (art, sound, one faction, one slice of map, the Act One opening).
5. **Systems out from the slice** — economy, companions, faction behavior, each
   tested against the core loop constantly.
6. **Content last** — quests, CDs, feed posts, story beats, dialogue. Most expensive;
   don't touch until systems are stable.

---

# PART FIVE — CARRIED-FORWARD & NEW PENDING DECISIONS

From GDD v2 §25 (unchanged): nation naming; Dubai-equivalent city name; solar mega
project name; the third Act-One permanent decision and all three for Acts Two/Three;
the act-ending quest triggers; the time-dilation second bar; the fast-travel
supplement system; King Hobo's full lore; the Act-One parent-death arc; the Nellis
subplot; CD track listing; mega project unlock conditions.

New in v3:
- **The nuke: stop vs. redirect targets are locked; the redirect choice writes the
  monument's final line.** (No longer a blocking question — it's a player choice.)
- **The device's name** (waits for technology lore).
- **The multi-enemy dial model** (combat).
- **Why the Act-Three defector's brain didn't get pulled in** (fluke or weapon).
- **What specifically flags the dynasty** in Act Two/Three.
- **Whether any inner-circle member ever got something out before being killed**
  (possible Act Two beat).

---

*BOHEMIA GDD Version 3 — Compiled June 2026*
*Paolo Alexandre Sarnataro / Babypunk / Punk4Prez*
*Extends GDD v2; does not replace it. Read v2 first.*
*All real-world people referenced as inspiration only — no real names in the final game.*
