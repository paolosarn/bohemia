#!/usr/bin/env python3
"""
BOHEMIA — SFX-09: THE SILENT MOMENTS GET THE SOURCE THAT WORKS (8/20/26).

REUSE CHECK. Banks opened: the alpha's own 602-voice music rack (synthV), read
in full and MEASURED before a single recipe was written -- all thirty candidate
voices rendered through the engine's own gain path, the two that came back too
quiet to drive safely (hollowvowl 0.0014, crtbuzz 0.0024) were swapped out for
measured ones. What is reused: EVERYTHING. Not one new voice is cooked here. The
whole batch is his rack, pointed at moments it has never been pointed at.

WHY THIS BATCH EXISTS, AND WHY IT IS NOT A THIRD GUESS.
Twelve game moments make no sound. Every one has been shown to him twice, ten
candidates each, and killed every time -- THE FIGHT IS OVER is 0 up and 65 down
across thirteen sweeps. Two rejections normally end a feature for the session.

But BOTH of those rounds were RAW SYNTHESIS, and the record is unambiguous about
what happens when a dead moment is offered an INSTRUMENT instead:

    miss        0 UP / 45 DOWN  as raw synthesis
    miss_past  20 UP /  0 DOWN  as an instrument          <- same moment
    round_land  died 5 of 5     ->  dirt_take   approved
    nerve_break died 5 of 5     ->  will_goes   approved
    wake_up     died 5 of 5     ->  come_up     approved

Instruments run 48% approval against roughly 30% for raw synthesis, on his own
thumbs, and his own words on 8/16 after SFX-06 died 34 of 35 were "use more
instruments". So this is not a third guess at the same thing. It is the FIRST
application of the source that works to twelve moments that have never once been
offered it -- which is the instruction he already gave, finished.

AND THE RACK WAS ALREADY WAITING. It holds `neonsign`, `neontube`, `neonrelic`
and `dyingfilament` for NEON STILL LIT; `ratchet`, `reelclick` and `springrev`
for YOU RELOAD; `coin`, `cashreg`, `ledgerbell` and `ledgerscratch` for MONEY
MOVES; `emptyfloorhum` and `signalfade` for THE ROOM GOES QUIET. Voices written
for these exact moments, by him, that the sound engine has never called.

SIX MOMENTS THIS BATCH, chosen by what the DEMO actually walks through: open,
walk the street, fight, get paid. The other six wait rather than being padded in.

NEW IDS, NOT NEW RECIPES ON OLD ONES. `clear` is judged and frozen; changing its
recipe would reassign thumbs he already spent. Same pattern the engine already
uses: round_land -> dirt_take, miss -> miss_past.

WORDS ARE AN ATTEMPT (8/11): every label and brief here is written as if it
ships. He edits them whenever he likes.

  python3 tools/bohemia_sfx_batch09.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'

EVENTS = """    /* ---- batch SFX-09 (8/20): the source that works, aimed at moments that
       have never been offered it. Every one of these is the instrument-backed
       answer to a moment that died twice as raw synthesis. ---- */
    { ev: 'gone_quiet',  label: 'THE ROOM GOES QUIET',   why: 'everyone is down and the air comes back. clear died 0 of 65 as synthesis and was never once offered an instrument' },
    { ev: 'mag_home',    label: 'THE MAG SEATS',         why: 'three metal parts finding each other. the beat where you cannot shoot, and the player has to HEAR it' },
    { ev: 'hands_pass',  label: 'IT CHANGES HANDS',      why: 'paper and coin counted off. in a post-economic valley money moving is never nothing' },
    { ev: 'dog_calls',   label: 'A DOG, OUT THERE',      why: 'the only other living thing you can hear, with the air of the distance in it' },
    { ev: 'sign_alive',  label: 'THE SIGN IS STILL ON',  why: 'the 12% that has power. gas and current, which is electrical and never a struck body' },
    { ev: 'lungs_burn',  label: 'YOUR LUNGS CATCH UP',   why: 'you ran too far. turbulence through a throat, with no body in it at all' },
"""

RECIPES = """
    /* ================= BATCH SFX-09 (8/20/26) ==========================
       Six moments that make no sound, given the source his own thumbs favour
       48% to 30%. Every voice named below was rendered through this engine's
       own gain path and measured before it was written down; the two that came
       back too quiet to drive (hollowvowl, crtbuzz) were dropped for ones that
       were not. Nothing here is cooked -- it is all his rack. */
    gone_quiet: {
      /* the air coming back into a room where something just stopped. long,
         wide, and quiet on purpose: it is the ABSENCE that is the sound. */
      base: { synth: 'instrument', inst: 'emptyfloorhum', mat: 'ash', hz: 96,
              modes: 4, bright: 0.4, decay: 0.625, damp: 1.8, warble: 0.25,
              atk: 0.0625, trans: 0.18, transHz: 900, transQ: 0.7, grit: 0.2,
              gritHz: 700, space: 0.34, room: 0.375, refl: 2, dark: 1100,
              width: 0.78, drive: 0.03, mkup: 0.86, gain: 0.26 },
      jit:  { hz: [72, 132], decay: [0.5, 0.875], width: [0.66, 0.95],
              dark: [850, 1600], space: [0.28, 0.42] },
      instSets: ['emptyfloorhum', 'stillair', 'prairiestatic', 'settlebend',
                 'signalfade'],
      hitSets: [[0], [0], [0], [0, 0.375], [0]]
    },
    mag_home: {
      /* THREE METAL PARTS FINDING EACH OTHER, which is why it is three hits and
         not one. Tight, close, no room: a reload happens at your chest. */
      base: { synth: 'instrument', inst: 'ratchet', mat: 'metal', hz: 420,
              modes: 6, bright: 1.15, decay: 0.125, damp: 2.5, warble: 0.5,
              atk: 0, trans: 0.6, transHz: 4200, transQ: 1.8, grit: 0.45,
              gritHz: 2600, space: 0.08, room: 0.0625, refl: 1, dark: 3200,
              width: 0.42, drive: 0.12, mkup: 0.9, gain: 0.34,
              hits: [0, 0.125, 0.25] },
      jit:  { hz: [320, 560], decay: [0.0625, 0.1875], width: [0.34, 0.58],
              dark: [2600, 4200] },
      instSets: ['ratchet', 'reelclick', 'springrev', 'meterclick', 'spoonclack'],
      hitSets: [[0, 0.125, 0.25], [0, 0.1875], [0, 0.0625, 0.1875],
                [0, 0.125], [0, 0.0625, 0.125]]
    },
    hands_pass: {
      /* MANY SMALL EVENTS, NEVER ONE TONE -- his own brief for it. Counted off,
         so the hits are uneven on purpose: money is not a metronome. */
      base: { synth: 'instrument', inst: 'coin', mat: 'metal', hz: 880,
              modes: 6, bright: 1.3, decay: 0.125, damp: 2.4, warble: 0.9,
              atk: 0, trans: 0.5, transHz: 6800, transQ: 2.4, grit: 0.35,
              gritHz: 4400, space: 0.14, room: 0.125, refl: 1, dark: 4600,
              width: 0.6, drive: 0.06, mkup: 0.8, gain: 0.3,
              hits: [0, 0.0625, 0.1875, 0.25] },
      jit:  { hz: [660, 1250], decay: [0.0625, 0.1875], width: [0.5, 0.82],
              dark: [3800, 5600] },
      instSets: ['coin', 'cashreg', 'ledgerbell', 'ledgerscratch', 'chip'],
      hitSets: [[0, 0.0625, 0.1875, 0.25], [0, 0.125, 0.1875],
                [0, 0.0625, 0.125, 0.25, 0.3125], [0, 0.1875],
                [0, 0.0625, 0.125, 0.1875]]
    },
    dog_calls: {
      /* THE DISTANCE IS THE WHOLE POINT. Heavy room, dark, one call. It is not
         a dog next to you; it is the only other living thing in the valley. */
      base: { synth: 'instrument', inst: 'dobrowail', mat: 'ash', hz: 210,
              modes: 5, bright: 0.62, decay: 0.4375, damp: 2.0, warble: 0.7,
              atk: 0.0625, trans: 0.2, transHz: 1400, transQ: 0.9, grit: 0.3,
              gritHz: 900, space: 0.46, room: 0.4375, refl: 3, dark: 1500,
              width: 0.85, drive: 0.05, mkup: 0.92, gain: 0.24 },
      jit:  { hz: [160, 300], decay: [0.3125, 0.625], width: [0.72, 1],
              dark: [1100, 2200], space: [0.38, 0.56] },
      /* ghostvox -> watervoice and breathpad -> reedorgan (8/20): not a taste
         call. Both originals render FIVE TIMES quieter than the calibration grid
         predicts at the pitch these recipes actually use, because the grid
         interpolates pitch between two octaves and those two voices dip hard in
         the middle. Measured at the exact operating point and replaced with
         voices that do not. The real fix is a third pitch row, which is built
         and deliberately not switched on -- see INST_SEMI. */
      instSets: ['dobrowail', 'harmonicawail', 'altitudecall', 'watervoice',
                 'shofar'],
      hitSets: [[0], [0], [0, 0.4375], [0], [0]]
    },
    sign_alive: {
      /* GAS AND CURRENT, NEVER A STRUCK BODY -- so the transient is almost off.
         It hums rather than hits, and it sits under everything because a lit
         sign is a PLACE, not an event. */
      base: { synth: 'instrument', inst: 'neonsign', mat: 'metal', hz: 150,
              modes: 4, bright: 0.85, decay: 0.5, damp: 1.7, warble: 1.1,
              atk: 0.0625, trans: 0.08, transHz: 2600, transQ: 1.2, grit: 0.5,
              gritHz: 3400, space: 0.2, room: 0.1875, refl: 1, dark: 2600,
              width: 0.55, drive: 0.1, mkup: 0.84, gain: 0.22 },
      jit:  { hz: [110, 220], decay: [0.375, 0.75], width: [0.44, 0.72],
              dark: [2000, 3600], grit: [0.35, 0.7] },
      instSets: ['neonsign', 'neontube', 'neonrelic', 'dyingfilament',
                 'vendinghum'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    lungs_burn: {
      /* IT HAS NO BODY AT ALL. trans near zero, no grit, and two hits because
         out of breath is IN and OUT, not one push. */
      base: { synth: 'instrument', inst: 'reedorgan', mat: 'ash', hz: 118,
              modes: 4, bright: 0.5, decay: 0.375, damp: 2.2, warble: 0.4,
              atk: 0.0625, trans: 0.1, transHz: 1100, transQ: 0.6, grit: 0.15,
              gritHz: 800, space: 0.16, room: 0.125, refl: 1, dark: 1300,
              width: 0.5, drive: 0.04, mkup: 0.88, gain: 0.28,
              hits: [0, 0.4375] },
      jit:  { hz: [88, 165], decay: [0.3125, 0.5625], width: [0.4, 0.66],
              dark: [1000, 1900] },
      instSets: ['reedorgan', 'chapelbreath', 'holdbreath', 'onebreath',
                 'paperlung'],
      hitSets: [[0, 0.4375], [0, 0.5], [0], [0, 0.375], [0, 0.5625]]
    },
"""


def main():
    s = open(ENGINE, encoding='utf8').read()
    if "ev: 'gone_quiet'" in s:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # ---- the EVENTS array ------------------------------------------------
    mark = "    /* ---- end batch SFX-05 events ---- */"
    if mark not in s:
        print('FAIL: could not find the end of the events list')
        return 1
    # THE LAST ENTRY HAS NO TRAILING COMMA. It did not need one while it was
    # last; appending after it without adding one is a syntax error that only
    # shows up when node parses the module, which is exactly what happened the
    # first time this ran. Add the comma, then the batch.
    tail = "surface in the game' }"
    if tail in s and (tail + ',') not in s:
        s = s.replace(tail, tail + ',', 1)
    s = s.replace(mark, EVENTS + mark, 1)

    # ---- the recipes -----------------------------------------------------
    # anchored on a recipe that certainly exists, inserted before it so the
    # batch reads as its own block rather than being wedged mid-table
    ranchor = '\n    walk_more: {'
    if ranchor not in s:
        print('FAIL: could not find the recipe table')
        return 1
    s = s.replace(ranchor, '\n' + RECIPES.rstrip() + ranchor, 1)

    open(ENGINE, 'w', encoding='utf8').write(s)
    n = len(re.findall(r"\{ ev: '", s))
    print('  6 moments added: gone_quiet, mag_home, hands_pass, dog_calls, '
          'sign_alive, lungs_burn')
    print('  the engine now declares %d game moments' % n)
    print('  NEXT: python3 tools/bohemia_sfx_instrument_measure.py --write')
    print('        python3 tools/bohemia_sfx_factory.py')
    return 0


if __name__ == '__main__':
    sys.exit(main())
