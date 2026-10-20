# COMBAT 10/20: THE RELOAD IS LOUD, ONE TAP TO SEE AND ONE TO DO, THE VETERAN, AND THE RIP

Opened by the coordinator (rule 112), session combat-reload, Opus 5.5 at Extra. No cards (rules 123, 124(c)): he meets all of
this in his next fight. His words that opened the round (rule 124, 10/20, LOCKED):

> "if I need to reload it needs to be very apparent on the screen that I need to reload, it has to be super clear; I don't
> know the way it is right now. I just won my first solo combat mission and it's getting that let's-keep-going feeling. It's
> getting better. And when I mean combat reload, I mean combat reload."

The fight's direction is right; everything below builds on it and nothing was restarted (rule 124(b)).

## 1. [the reload is loud] (rule 124(a))

MEASURED FIRST: the only sign of an empty gun was the small reload square in the skills row turning live, and a tap on a man
the empty gun could have shot said "<name> is out of reach" (canStrike refused for the ammo, and the tap read the refusal as
range). No sound for an empty gun anywhere, and the reload itself was silent. The approved bank already held the two sounds:
`dry_fire` ("EMPTY: you pulled and nothing happened") and `mag_home` ("THE MAG SEATS: the beat where you cannot shoot, and the
player has to HEAR it"); the fight called neither.

BUILT (slices/BOHEMIA_FIGHT.html):
- ON THE BUTTON: the moment the man you control has an empty gun, the strike square gives its place to ONE BIG RELOAD (132 x 46
  points): a VCR warning on the cracked glass (the ROM's white letters with the tape's red and blue ghosts a pixel either side,
  scanlines, a red rim), blinking on the fight's own beat (on for 62% of it, then dim: an on-screen display steps, it does not
  breathe), a bright tracking band rolling down it once a beat, its AP cost on it. Too few AP (the shotgun after its shot):
  RELOAD NEXT TURN, not live. A finger held on it shows the weapon card, as the strike square did.
- ON THE MAN: over the man you control, his gun's rounds as bullets on a plate over his bars (brass full, an empty case spent,
  the last one amber and blinking). Empty: the plate doubles, every case is hollow and red, the rim blinks on the beat, and on
  each beat's first step the tape slips (a red and a blue ghost a cell either side). Cells, never a word on the ground.
- IN THE SOUND: the slide-lock click (`dry_fire`) after his last round; the click again when his turn comes with an empty gun;
  `mag_home` on every reload, his and theirs.
- A TAP THAT WOULD FIRE EMPTY never fails silently: the click, "Click. Empty. RELOAD, 4 AP.", and the big RELOAD kicks (a beat
  of jolt) so the finger knows where to go; nothing is spent. Beside the man the gun still clubs (no dry tap at one tile).
- THE LINES: after the last shot, "Missed (47%). Empty: RELOAD."; his turn with an empty gun, "DESI's gun is empty. RELOAD.";
  after a reload, "Loaded: 5 rounds."; aiming with one round left, the bullets on the receipt and "Last round." in red; the
  reload square ringed in amber on the last round. No bottles left says "No bottles left." instead of "out of reach".
- An empty gun's reach is no longer taped on the ground (it reaches nobody).
- Rules (no typed number): FIGHT.emptyGun, FIGHT.rounds, FIGHT.dryAt.

GATE: gates/the_reload_is_loud_gate.js, THE RELOAD IS LOUD 17/0 (registered in the suite).

SHIPPED d3526f33 to main mid-round; pages run 3492 SUCCESS (the demo opens the live fight file, so it was in his next fight
from that run).

## 1b. [the turn ends itself] (rule 125, landed mid-round: 'even Battle Brothers has the auto end system: if you only have one
movement left and you can't even move a tile... you gotta do that a lot better, right now')

MEASURED FIRST (the coordinator's own line, confirmed): the player's turn ended only from END TURN, a flee, and a rally's
ap<=0 path. BUILT:
- FIGHT.canAct (rules, no typed number): a tile in his reach (the walk's own reach, his own tile always in it), a blow on a
  man his side sees (canStrike), a reload (canReload), or a skill of his perks (canUse): the buttons' own tests. YOU at 1 AP
  keeps the turn because Adrenaline costs 1 AP; a man boxed in by the board's corner and two rows of his own men (one friend
  can be walked through, two cannot) keeps it while his blow is affordable.
- The moment he can afford nothing: OUT OF ACTION POINTS over his bars (the same VCR warning as the empty gun: scanlines,
  red rim, the tape's ghosts, blinking on the beat) with '1/9 AP · A STEP 2' under it, and the line says why in Battle
  Brothers' numbers ('1 AP left, a step costs 2. Turn over.'; boxed in by the board and two rows of friends, NOWHERE TO GO and
  'Boxed in: nowhere to step, nothing to hit.'; a step spends AP only, never fatigue, in these rules);
  a beat and a half later (750 ms at 120) the turn passes by itself. Never on AUTO, in deploy, or while a skill is picked.
- BATTLE BROTHERS' NUMBERS ON THE BAR: his AP and his fatigue as numbers beside the pips ('2/9 AP 0/60 FAT'), red while the
  turn is ending.
- WAIT and END TURN stay.

GATE: gates/the_turn_ends_itself_gate.js (registered).

## 2. [one tap to see, one tap to do] (the plan's part C)

- The one big button bottom right names what it will do: WALK (with the AP), SHOOT (with the chance), THROW, HIT, or END TURN;
  ringed in amber with its own mark (a boot's two prints, the sight, the blow's cross) when it does more than end the turn;
  a tap on it does that.
- The first tap shows the result where the finger is: a receipt tag on the board, "SHOOT 52%" over the man, "WALK 4 AP" over
  the tile (and the free swings a walk draws, in red); one blow's take blinks on his armour and health bars.
- The second tap on the same spot does it; any other tap changes the choice; a tap on his own man clears it.
- No body covers a tile he needs: an enemy's body drawn over an empty tile his arm cannot reach gives the finger to the tile.
- The instruction sentences are gone: "Walk there, 4 AP. Tap again." is now the tag and the button; the open's how-to line
  shows until his first tap and never again.

GATE: gates/one_tap_to_see_one_tap_to_do_gate.js; the floor-tile gate's two walk legs re-read the tag (they asserted the old
sentence).

## 3. [the first fight teaches] (the plan's part D)

One veteran of the company (the most fights in him, never YOU), his own face (PORTRAIT's fresh portrait) beside his words on
receipt paper under the strip, says three lines at the moments they matter, each once ever (kept on the phone), never in the
first second or while the board holds still, one at a time; the line types in on the beat while his face moves. It takes no
tap and covers no button. With YOU alone nobody teaches and the lesson waits. Lines (draft:true, for WORDS; the lesson in
English, one flavour word from the lexicon, LANGUAGE NEVER GATES REQUIRED INFORMATION):
- the first aim: "Mira. One tap shows your odds. Tap him again to shoot."
- the first time cover matters: "Cuidado. Cover makes a man hard to hit. You too."
- the first empty gun: "Oye, that click means empty. Hit RELOAD before you aim."

GATE: gates/the_first_fight_teaches_gate.js.

## 4. The tear's second pass ([the floor, not final], the tear half)

His YES on the tear came with "Not final looks like dog shit"; the row: "a real fifth-dimension tear around your man, not a
glow". The first pass was a house-wide band of rows slipping sideways, which reads as shimmer. A first try at a second pass
(a jagged lens split round him) read as a dotted OVAL RING, and he has voted ovals off the board before (10/1): thrown out
before it shipped. What shipped: ONE RIP down the picture through him, over his head to under his feet, slanting and jagged:
the far side, him with it, is knocked sideways and a pixel down, and through the split there is the dead channel's black and
snow with the world's torn lip a pixel of glint. It opens on every beat (widest on the bar's one), finds a new line every
beat and holds it between (six slots a beat); the torn side keeps the paused tape's comb and the band that rolls up through him
once a bar. Palette only (the cold ramp and dead channel), no glow, no blur, no composite. In ANIMATION's module
(slices/vote/ANIMATION_THE_AURA.js, ANIMATION paused under rule 121; the row is COMBAT's).

The floor's pixels are COOK's this round (rule 123(c)); slices/fight_ground was not touched.

## Proof

See the handoff block (handoffs are the report, rule 124(c)) for the gate numbers on the final head.
