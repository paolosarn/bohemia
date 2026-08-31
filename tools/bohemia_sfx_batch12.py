#!/usr/bin/env python3
"""
BOHEMIA - SFX-12: THE HUNDRED-HOUR GAME LEVELS YOU UP IN SILENCE.

PAOLO 8/26, LOCKED: "IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS TO COMPLETE
BRO. LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND IN HAND WITH ABILITIES AND
THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA."

=== MEASURED: THE SPINE OF THAT SENTENCE MAKES NO SOUND AT ALL ==============

    tools/bohemia_combat_the_tree_patch.py        sfx/sting references: 0
    tools/bohemia_combat_the_mini_bosses_patch.py sfx/sting references: 0

The tree is the piece five days of combat work were waiting for, and the boss
ladder is fifty-three named men who each hand you a NEW VERB. Between them they
are the entire progression of a hundred-hour game. You earn experience, you
cross a level, you spend a point, a perk comes on, a boss goes down and gives
you a way to interact with Bohemia you did not have -- and every one of those
happens in complete silence.

*** AND I HAD ONE FACT WRONG HERE, CAUGHT BY DECODING THE ACTUAL BUILD. *** This
paragraph used to say "a level-up is not even an event yet", read off
bohemia_combat_the_tree_patch.py. THE SHIPPED MODULE IS NEWER THAN THAT TOOL:
V189 added the crossing with the comment "a level is a MOMENT, not a number that
quietly ticks over" and already puts a line on screen. The moment exists; it has
no sound. A PATCH TOOL IS NOT THE BUILD -- it tells you what a thing looked like
the day it was written, and four versions have landed since.

=== SEVEN MOMENTS, AND WHY EACH ONE IS REAL ================================

Nothing here is invented to justify a sound. Every one already happens in code:

  xp_lands    treeEarn(n)          experience off a body (V181's drop)
  level_up    treeLevel() crosses  THE moment. Detected here for the first time
  perk_taken  treeBuy(id)          a point spent, a perk applied to the fight
  key_taken   keyWin(id)           A BOSS HANDS YOU A VERB. 53 of these
  boss_here   rollBoss() returns   a named man is in this fight
  boss_falls  the boss dies        the biggest kill in the game
  held_back   a locked control     the stairs/grenade a boss still holds

=== THE PALETTE IS HIS 8/28 RULING, AND IT FITS THIS BATCH EXACTLY =========

"Im tired of all these voices they ran their course no more wood stone ash bone
shit its COOKED." Four materials retired, metal already dead, leaving BELL,
CHOIR, CRYSTAL, GLASS and WATER.

That ruling was made about a rack whose centre of gravity was dry gritty desert
matter -- ash under a boot, bone under a pipe. **Progression is the one subject
that never wanted dry matter in the first place.** Levelling up is a RING.
A perk coming on is a RING. A man's key passing to you is a BELL. What is left
of the palette is exactly what these moments are made of, so the constraint and
the subject arrived at the same answer, which is the best possible sign that
neither is being forced.

=== METHOD: NON-INSTRUMENT, ON PURPOSE AND FOR A MEASURED REASON ===========

sfx_diversity_gate has been this lane's one true red for weeks:

    instrument holds 125 of 215 LIVING candidates, 58.1%
    CLOSING THIS HONESTLY NEEDS 35 MORE NON-INSTRUMENT CANDIDATES (~7 moments)
    THAT THE GAME ACTUALLY WANTS. IT IS NOT CLOSED BY PADDING.

*** AND SEVEN MOMENTS DOES NOT CLOSE IT, WHICH I ONLY LEARNED BY RUNNING IT. ***
I read "35 more non-instrument candidates" and cooked 35. The gate moved 58.1%
-> 55.6% and asked for 25 more. Its `fresh` list is
`[r for r in rows if r['synth'] != 'modal']` -- MODAL IS EXCLUDED FROM THE
DENOMINATOR ENTIRELY, because modal IS the stale baseline he complained about
("every sound this engine had ever made was A STRUCK RESONANT OBJECT"). Five of
these seven are modal, so twenty-five of the thirty-five do not count toward it
and were never going to.
THE GATE IS RIGHT AND THE RECIPES ARE RIGHT, WHICH IS WHY NOTHING HERE WAS
CHANGED TO CHASE THE NUMBER. A level-up is a bell and a bell is modal. Turning
these into friction to move a percentage would be picking the method to satisfy
a gate instead of the physics, which is the exact failure that killed batch 25.
What the red actually needs is FIVE MORE MOMENTS THAT GENUINELY WANT FRICTION,
and progression is not where those live. Reported, not padded.

**The count was never the reason for choosing these** -- the tree and the ladder
were silent before I opened that gate, and they would be worth sounding if it
did not exist.

Five modal, two friction (the two friction ones moved the red 58.1% -> 55.6%).
No instrument, no barred method, no retired material,
every `space` at or under 0.2 because DO NOT ANNOUNCE THE ROOM is the reading
his four whole-batch deaths gave and both 5/5 sweeps sat at 0.14 and 0.16.
That last one costs something here and it is worth saying: a level-up chime
traditionally lives in a big room. His data says no. His data wins.

REUSE CHECK: cooks no graphic pixels and opens no art bank -- there is nothing
to draw. It borrows no instrument voice, because the whole point of the method
split is to not reach for his rack this time.

MECHANISM-MINE / CONTENTS-PAOLO'S: thirty-five candidates ship and NONE is
canon. Nothing plays until he thumbs it.

  python3 tools/bohemia_sfx_batch12.py
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'

E_MARK = "    /* ---- BATCH SFX-12 EVENTS (8/30/26) ---- */"
R_MARK = "    /* ---- BATCH SFX-12 RECIPES (8/30/26) ---- */"

NEW = ['xp_lands', 'level_up', 'perk_taken', 'key_taken',
       'boss_here', 'boss_falls', 'held_back']

EVENTS = E_MARK + """
    { ev: 'xp_lands',   label: 'EXPERIENCE LANDS',        why: 'experience off a body, his 8/25 ruling. the small one, and it fires often, so it has to be nearly nothing' },
    { ev: 'level_up',   label: 'YOU LEVEL UP',            why: 'the biggest recurring reward in a hundred-hour game, and until this batch it was not even an event -- a number quietly getting bigger behind a label' },
    { ev: 'perk_taken', label: 'A PERK COMES ON',         why: 'you spent a point and the fight you are standing in changes. cyberpunk/elder scrolls, his own reference' },
    { ev: 'key_taken',  label: 'A BOSS HANDS YOU A VERB', why: 'fifty-three named men and each one gives you a new way to interact with Bohemia. the largest single reward in the game' },
    { ev: 'boss_here',  label: 'A NAMED MAN IS IN THIS',  why: 'the fight has somebody in it who holds something you do not. it should land before you see him' },
    { ev: 'boss_falls', label: 'THE BOSS GOES DOWN',      why: '2.2x health and one job, and he is finished. a normal kill sound cannot carry this' },
    { ev: 'held_back',  label: 'SOMEBODY ELSE HOLDS THIS', why: 'the stairs and the grenade are locked until you beat the man who has them, and pressing one NAMES HIM. a refusal that is a signpost' },
"""

RECIPES = R_MARK + r"""
    /* FIVE modal, TWO friction. NO instrument -- sfx_diversity has been red for
       weeks on instrument owning 58.1% of living candidates, and it says in its
       own failure text that closing it needs non-instrument candidates THE GAME
       ACTUALLY WANTS rather than padding. These seven were silent before that
       gate was opened.
       MATERIALS ARE HIS 8/28 PALETTE: bell, choir, crystal, glass, water. The
       ruling retired dry matter and progression never wanted dry matter, so the
       constraint and the subject agree.
       EVERY space <= 0.2. A level-up chime traditionally lives in a big room;
       his four whole-batch deaths on 8/15 said DO NOT ANNOUNCE THE ROOM and both
       5/5 sweeps sat at 0.14 and 0.16. That costs this batch something real and
       his data still wins. */

    /* ---- MODAL: things that RING ------------------------------------ */
    xp_lands: {
      /* NEARLY NOTHING. It fires on every body, so anything with a tail turns a
         firefight into a slot machine. Short, high, one strike. */
      base: { synth: 'modal', mat: 'glass', hz: 660, modes: 5, bright: 1.2,
              decay: 0.0625, damp: 2.6, warble: 0.4, atk: 0, trans: 0.5,
              transHz: 4200, transQ: 1.8, grit: 0.1, gritHz: 2600,
              space: 0.06, room: 0.0625, refl: 0, dark: 4200, width: 0.44,
              /* LOUDER THAN I WANTED IT, AND THE GATE WAS RIGHT. I wrote this
                 one to be "nearly nothing" because it fires on every body, and
                 all five candidates came out at peak 0.144 -- under the
                 judgeable band. He cannot thumb what he cannot hear, and a
                 candidate too quiet to judge is not a restrained sound, it is a
                 wasted slot. Quiet is a MIX decision and it belongs in the mix,
                 not in a candidate he is being asked to rule on. */
              drive: 0.04, mkup: 0.95, gain: 0.32 },
      jit:  { hz: [500, 880], decay: [0.0625, 0.09375], bright: [1, 1.5],
              transHz: [3200, 5800], damp: [2.2, 2.7], width: [0.34, 0.6],
              dark: [3200, 5600] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    level_up: {
      /* THE ONE. Two strikes a beat apart, so it reads as an ARRIVAL rather than
         a tick -- and a bell, because that is what crossing a threshold sounds
         like in every game he has named as a reference. */
      base: { synth: 'modal', mat: 'bell', hz: 330, modes: 10, bright: 0.95,
              decay: 0.75, damp: 1.1, warble: 1.4, atk: 0, slide: 2,
              trans: 0.4, transHz: 3200, transQ: 1.5, grit: 0.08, gritHz: 2000,
              space: 0.18, room: 0.1875, refl: 1, dark: 3000, width: 0.72,
              drive: 0.04, mkup: 0.7, gain: 0.3,
              hits: [0, 0.25] },
      jit:  { hz: [262, 440], decay: [0.625, 1], slide: [0, 4],
              bright: [0.78, 1.3], damp: [0.9, 1.4], warble: [1, 2],
              width: [0.6, 0.92], dark: [2400, 4200] },
      hitSets: [[0, 0.25], [0, 0.1875], [0, 0.3125], [0, 0.25, 0.5], [0, 0.21875]]
    },
    perk_taken: {
      /* IT LANDS IN THE FIGHT YOU ARE STANDING IN -- the tree's own comment. So
         it is sharper and shorter than the level, and it is crystal, not bell:
         a level is an arrival, a perk is a thing switching on. */
      base: { synth: 'modal', mat: 'crystal', hz: 520, modes: 8, bright: 1.25,
              decay: 0.3125, damp: 1.5, warble: 1.1, atk: 0, slide: 3,
              trans: 0.55, transHz: 6200, transQ: 2.1, grit: 0, gritHz: 2000,
              space: 0.12, room: 0.125, refl: 1, dark: 4600, width: 0.6,
              drive: 0.03, mkup: 0.66, gain: 0.28 },
      jit:  { hz: [400, 700], decay: [0.25, 0.4375], slide: [1, 5],
              bright: [1, 1.6], damp: [1.2, 1.8], width: [0.5, 0.8],
              dark: [3600, 6000] },
      hitSets: [[0], [0, 0.0625], [0], [0, 0.125], [0]]
    },
    key_taken: {
      /* THE LARGEST REWARD IN THE GAME, and the key is on his body -- you walked
         to it. Lower and longer than the level-up, three strikes, and it is the
         only thing in this batch allowed to take its time. */
      base: { synth: 'modal', mat: 'bell', hz: 196, modes: 11, bright: 0.8,
              decay: 1.25, damp: 0.9, warble: 1.8, atk: 0, slide: -2,
              trans: 0.45, transHz: 2400, transQ: 1.4, grit: 0.12, gritHz: 1400,
              space: 0.2, room: 0.25, refl: 1, dark: 2400, width: 0.8,
              drive: 0.05, mkup: 0.72, gain: 0.31,
              hits: [0, 0.375, 0.75] },
      jit:  { hz: [147, 262], decay: [1, 1.625], slide: [-5, 0],
              bright: [0.65, 1.1], damp: [0.75, 1.2], warble: [1.3, 2.4],
              width: [0.68, 1], dark: [1900, 3400] },
      hitSets: [[0, 0.375, 0.75], [0, 0.5], [0, 0.3125, 0.625, 0.9375],
                [0, 0.4375, 0.875], [0, 0.25, 0.5625]]
    },
    boss_falls: {
      /* A NORMAL KILL SOUND CANNOT CARRY THIS. 2.2x health and one job, and he
         is finished. Lowest thing in the batch, and it falls instead of rising:
         every other bell here goes up. */
      base: { synth: 'modal', mat: 'bell', hz: 110, modes: 11, bright: 0.62,
              decay: 1.5, damp: 0.85, warble: 2.1, atk: 0, slide: -5,
              trans: 0.5, transHz: 1600, transQ: 1.2, grit: 0.2, gritHz: 1000,
              space: 0.2, room: 0.25, refl: 1, dark: 1700, width: 0.85,
              drive: 0.08, mkup: 0.78, gain: 0.32,
              hits: [0, 0.5] },
      jit:  { hz: [88, 165], decay: [1.25, 2], slide: [-9, -2],
              bright: [0.5, 0.9], damp: [0.7, 1.1], warble: [1.5, 2.8],
              width: [0.72, 1], dark: [1300, 2600] },
      hitSets: [[0, 0.5], [0, 0.375], [0, 0.625], [0, 0.4375, 0.9375], [0]]
    },

    /* ---- FRICTION: things that are HELD ----------------------------- */
    boss_here: {
      /* IT SHOULD LAND BEFORE YOU SEE HIM. A voice, held, with no strike in it
         at all -- the only way to say "somebody is in this" without saying
         where. choir, because a named man arriving is a person, not an object. */
      base: { synth: 'friction', mat: 'choir', hz: 82, rough: 7, modes: 6,
              bright: 0.4, decay: 1.125, damp: 1.4, warble: 2.2, atk: 0.4375,
              slide: -3, trans: 0.06, transHz: 620, transQ: 0.6, grit: 0.5,
              gritHz: 480, space: 0.19, room: 0.25, refl: 1, dark: 900,
              width: 0.82, drive: 0.04, mkup: 0.88, gain: 0.27 },
      jit:  { hz: [62, 124], rough: [4, 12], decay: [0.875, 1.5],
              atk: [0.3125, 0.5625], slide: [-6, -1], warble: [1.6, 2.9],
              bright: [0.3, 0.58], width: [0.7, 1], dark: [720, 1500] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    held_back: {
      /* A REFUSAL THAT IS A SIGNPOST. Pressing it NAMES THE MAN WHO HAS IT, so
         the sound must not read as a fault -- short, flat, and made of water
         rather than glass so it lands softer than ui_deny. Nothing rings: this
         is the one moment in the batch that must not feel like a reward. */
      base: { synth: 'friction', mat: 'water', hz: 190, rough: 14, modes: 4,
              bright: 0.55, decay: 0.125, damp: 2.4, warble: 0.5, atk: 0.03125,
              slide: -2, trans: 0.3, transHz: 1300, transQ: 0.9, grit: 0.6,
              gritHz: 900, space: 0.07, room: 0.0625, refl: 0, dark: 1400,
              width: 0.42, drive: 0.07, mkup: 0.85, gain: 0.33 },
      jit:  { hz: [150, 265], rough: [9, 20], decay: [0.09375, 0.1875],
              slide: [-4, 0], bright: [0.42, 0.75], gritHz: [700, 1300],
              width: [0.32, 0.58], dark: [1100, 2100] },
      hitSets: [[0], [0], [0, 0.0625], [0], [0]]
    },
"""


def preflight(e):
    bad = []
    dead = set()
    for field in ('twiceDead', 'onceDeadWhole', 'deadMethod'):
        m = re.search(field + r':\s*\[(.*?)\]', e, re.S)
        if m:
            dead.update(re.findall(r"'([a-z_]+)'", m.group(1)))
    for n in NEW:
        if n in dead:
            bad.append('%s is in the graveyard' % n)
        if "ev: '%s'" % n in e:
            bad.append('%s already exists -- this would be a duplicate cook' % n)
    for meth in re.findall(r"synth:\s*'([a-z]+)'", RECIPES):
        if meth in dead:
            bad.append('method %r is barred' % meth)
        if meth == 'instrument':
            bad.append('this batch is deliberately NON-instrument; %r breaks it' % meth)
    # HIS 8/28 RULING, ENFORCED BY THE COOK ITSELF and not only by the gate.
    RETIRED = ('wood', 'stone', 'ash', 'bone', 'metal')
    for mat in re.findall(r"mat:\s*'([a-z]+)'", RECIPES):
        if mat in RETIRED:
            bad.append("mat %r is retired (8/28) or dead" % mat)
    for sp in re.findall(r"space:\s*([0-9.]+)", RECIPES):
        if float(sp) > 0.2:
            bad.append('space %s announces the room' % sp)
    return bad


def main():
    e = open(ENGINE, encoding='utf8').read()
    if E_MARK in e:
        print('  SFX-12 already installed (idempotent, nothing to do)')
        return 0

    bad = preflight(e)
    if bad:
        print('=== SFX-12 - REFUSING TO COOK ===')
        for b in bad:
            print('  > ' + b)
        return 1

    def inject(src, start_key, close, block):
        """Anchor on the last real element, and OWN EVERY SEPARATOR the splice
        touches. Both tables end in comment lines, so a comma pasted before the
        closing bracket lands after a comment and makes an array HOLE; and the
        text after the last brace begins with the separator that used to follow
        it, so pasting a block in front of it makes a DOUBLE comma, which is the
        same hole by the other route. SFX-11 shipped both bugs in one turn."""
        k = src.index(start_key)
        end = src.index(close, k)
        last = src.rindex('}', k, end)
        tail = src[last + 1:end].lstrip()
        if tail.startswith(','):
            tail = tail[1:]
        return src[:last + 1] + ',\n' + block + '\n    ' + tail.lstrip() + src[end:]

    e = inject(e, 'var EVENTS', '\n  ];\n', EVENTS)
    e = inject(e, 'var RECIPE', '\n  };\n', RECIPES)
    open(ENGINE, 'w', encoding='utf8').write(e)

    print('=== SFX-12 - SEVEN MOMENTS, THIRTY-FIVE SOUNDS ===')
    for n in NEW:
        print('    %s' % n)

    for cmd in (['node', 'tools/build_run_slice.js'],
                ['python3', 'tools/bohemia_sfx_factory.py'],
                ['python3', 'tools/bohemia_sfx_wire_patch.py'],
                ['python3', 'tools/bohemia_sound_mix_patch.py']):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            print('FAIL: %s\n%s' % (' '.join(cmd), (r.stdout + r.stderr)[-900:]))
            return 1

    alpha = open('slices/BOHEMIA_ALPHA_0_9.html', encoding='utf8').read()
    missing = [n for n in NEW if "ev: '%s'" % n not in alpha]
    if missing:
        print('FAIL: these never reached the alpha: %s' % missing)
        return 1
    print('  all seven reached the alpha. 35 candidates on the board, 0 canon.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
