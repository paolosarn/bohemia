#!/usr/bin/env python3
"""
BOHEMIA - SFX-11: TWELVE MOMENTS PLAY ONE SAMPLE FOREVER. SIXTY NEW SOUNDS.

PAOLO, 8/28, VERBATIM: "i dont need youi implementing shit thats not done we
need way more sounds bro!!!!"

Taken exactly as written: this is sixty sounds and no plumbing. It is the
biggest SFX batch this lane has ever cooked -- SFX-01 was 60 across brand new
moments, and every batch since has been 30 or fewer.

=== WHY THESE TWELVE, MEASURED OFF THE SHIPPED BANK TODAY ====================

Read straight out of `var APPROVED=` in the alpha and combined with the
SIBLINGS map in bohemia_sfx_wire_patch.py, which is what actually decides how
many samples a moment can draw in play. 55 moments carry an approved sound.
TWELVE OF THEM HAVE AN EFFECTIVE POOL OF ONE -- the game plays a byte-identical
sample every single time:

    casing  door_drag  dry_fire  eat  hit_more  lungs_burn  mag_home
    sign_alive  stone_bite  went_down  will_goes  wood_more

`hit_more` and `wood_more` are themselves siblings feeding `hit` and
`step_wood`, whose pools are already 3 and 7, so they never play alone and are
not a defect. `casing` is excluded below. That leaves NINE moments that repeat
identically, and the batch adds three more from the effective-pool-of-two list
-- swing_air, wind_gust, phone_buzz -- because two samples under a repeated
action is a two-beat pattern, and in an engine where EVERYTHING quantises to 120
BPM an even pool locks to the meter hard.

THE RESEARCH, and it is the oldest known failure in game audio: the MACHINE GUN
EFFECT. The fix is round-robin -- several takes of one event, cycled so the same
one never plays twice running -- and the non-obvious refinement is that the pool
should be ODD, so the cycle does not fall into step with the action and become
its own audible pattern. Five is odd. The engine's shuffle already refuses an
immediate repeat. The mechanism was built and it was starving.

=== WHAT IS DELIBERATELY NOT IN THIS BATCH ==================================

*** CASING IS NOT COOKED, AND HE DID ASK FOR MORE SOUNDS. *** `brass_more` is
on the engine's own `onceDeadWhole` list with this note: "brass_more is its
first rejection: casing stays at one variant and does not get another cook
unless he asks." He asked for MORE SOUNDS. That is not the same as asking for
THIS sound again. A general call for volume is not a request to re-open the one
moment he threw out whole, and reading it that way would let any broad ask
reopen every grave in the file -- which is exactly what GRAVEYARD IS FINAL
exists to stop. Casing stays dead until he names it.

Also excluded, same reason: the eight `twiceDead` moments, plus `clear_still`,
`turn_to_you`, `cross_in`, `done_ring` and `panel_tick`.

=== THE METHOD SPLIT IS HIS DATA, NOT MY TASTE =============================

The engine's ENVELOPE ledger, off 460 judged candidates:

    instrument  0.48   his own rack, the best source in the game
    friction    0.46   the best raw method
    modal       0.35
    fm          0.13
    particle    0.00   BARRED (deadMethod)
    air         0.00   BARRED (deadMethod)

FIVE friction, FOUR instrument, THREE modal. No barred method. No `mat: 'metal'`
anywhere -- 3 UP / 22 DOWN is the only stable material finding he has produced.
Every `space` at or under 0.2, because DO NOT ANNOUNCE THE ROOM is the reading
his four whole-batch deaths gave on 8/15: the only two 5/5 sweeps this lane has
ever had sat at space 0.14 and 0.16, and the three roomiest recipes in that
batch all died whole.

PHYSICS PICKS THE METHOD INSIDE THAT SPLIT. A door hauling in a gritty sill, a
blade opening air, wind over a dead valley, lungs burning and a man's will going
are all SUSTAINED, and they are friction. A magazine seating and a trigger
closing on nothing are STRUCK, and they are modal. A sign working in the wind,
stone coming off cover, and a device buzzing are objects with a grain to them,
and they come off his rack.

REUSE CHECK: cooks no graphic pixels and opens no art bank -- there is nothing
to draw. Every instrument id is one of the 44 already proven in shipped
instSets, and the four instrument pools reuse the voices SFX-10 MEASURED at a
real operating point (guiro, ratchet, rubboard, sodahiss, brushkit, pickscrape,
spoonclack, claves, washboard, cabasa) rather than any name that merely looked
right. SFX-10's own lesson: four voices that looked perfect for wood render
SILENT because they are drumV kinds, and measuring is the only reason they are
not in a shipped batch. A voice that does not resolve is a silent sound effect.

MECHANISM-MINE / CONTENTS-PAOLO'S: sixty candidates ship and NONE is canon.
Nothing enters a pool until he thumbs it; the sibling wiring widens the moment
by itself the second he says yes to one.

  python3 tools/bohemia_sfx_batch11.py
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ENGINE = 'engine/bohemia_sfx.js'

E_MARK = "    /* ---- BATCH SFX-11 EVENTS (8/28/26) ---- */"
R_MARK = "    /* ---- BATCH SFX-11 RECIPES (8/28/26) ---- */"

NEW = ['door_more', 'dry_more', 'eat_more', 'lungs_more', 'mag_more',
       'sign_more', 'chip_more', 'down_more', 'quit_more', 'swing_more',
       'wind_more', 'buzz_more',
       # WAVE 2: every remaining moment with an EVEN pool of two. Two samples
       # under a repeated action is a two-beat pattern, and in an engine where
       # everything quantises to 120 BPM an even pool locks to the meter hard.
       # All six are friction or modal, which is also what their physics wants:
       # fabric, tape and a contactor RUB; a boot and a placed object are STRUCK.
       'cloth_more', 'tape_more', 'power_more', 'tread_more', 'hunker_more',
       'seton_more']

PARENT = {'door_more': 'door_drag', 'dry_more': 'dry_fire', 'eat_more': 'eat',
          'lungs_more': 'lungs_burn', 'mag_more': 'mag_home',
          'sign_more': 'sign_alive', 'chip_more': 'stone_bite',
          'down_more': 'went_down', 'quit_more': 'will_goes',
          'swing_more': 'swing_air', 'wind_more': 'wind_gust',
          'buzz_more': 'phone_buzz',
          'cloth_more': 'cloth_on', 'tape_more': 'tape_pull',
          'power_more': 'power_on', 'tread_more': 'boots_go',
          'hunker_more': 'cover_more', 'seton_more': 'set_down'}

EVENTS = E_MARK + """
    { ev: 'door_more',   label: 'THE DOOR DRAGS — MORE',   why: 'his own note on the parent: it hauls, it does not creak. one sample for every door in the valley' },
    { ev: 'dry_more',    label: 'EMPTY — MORE',            why: 'you counted wrong, and you have counted wrong to the same click every time' },
    { ev: 'eat_more',    label: 'EAT — MORE',              why: 'wet and close and a little unpleasant. nobody else hears you eat, and it is the same mouthful twice a day' },
    { ev: 'lungs_more',  label: 'LUNGS BURN — MORE',       why: 'running out of air is a state you sit inside, and a state on one sample is a loop' },
    { ev: 'mag_more',    label: 'MAGAZINE HOME — MORE',    why: 'seating a magazine happens every fight and lands identically every time' },
    { ev: 'sign_more',   label: 'THE SIGN IS ALIVE — MORE', why: 'the one thing in a dead block that still moves, and it moves the same way forever' },
    { ev: 'chip_more',   label: 'COVER LOSES A PIECE — MORE', why: 'the stone you are behind is eaten while you use it, and it is eaten identically every time' },
    { ev: 'down_more',   label: 'YOU GO DOWN — MORE',      why: 'the biggest thing that can happen to you, on one sample' },
    { ev: 'quit_more',   label: 'HIS WILL GOES — MORE',    why: 'a shooter becomes a person running. more of his voices for the moment a man quits' },
    { ev: 'swing_more',  label: 'SWING THROUGH AIR — MORE', why: 'a blade opens air. every melee that misses draws from two, under a 120 BPM clock' },
    { ev: 'wind_more',   label: 'WIND GUST — MORE',        why: 'the most-heard sound in the game outside footsteps, and it has two' },
    { ev: 'buzz_more',   label: 'THE PHONE — MORE',        why: 'it rings in the morning and it lands the last message of the demo, on two samples' },
    { ev: 'cloth_more',  label: 'CLOTH ON — MORE',         why: 'dressing happens every morning of the run and fabric is literally rubbing, which is the method he scores best after his own rack' },
    { ev: 'tape_more',   label: 'TAPE PULL — MORE',        why: 'patching yourself up on two samples. tape peeling is friction with nothing else in it' },
    { ev: 'power_more',  label: 'POWER ON — MORE',         why: 'LIGHT IS TERRITORY, and taking a block sounds the same every time you take one' },
    { ev: 'tread_more',  label: 'BOOTS — MORE',            why: 'a boot on a hard floor, on a two-beat pattern under a 120 BPM clock' },
    { ev: 'hunker_more', label: 'GETTING BEHIND IT — MORE', why: 'cover_more is what BLOCK draws from, and it is two deep for the thing a whole firefight is made of' },
    { ev: 'seton_more',  label: 'SET IT DOWN — MORE',      why: 'placing a thing, twice, forever' },
"""

RECIPES = R_MARK + r"""
    /* FIVE friction, FOUR instrument, THREE modal -- his own method scoreboard,
       best first. No particle, no air: both barred at 0 for 30. No `mat:
       'metal'`: 3 UP / 22 DOWN. Every space at or under 0.2, because DO NOT
       ANNOUNCE THE ROOM is the reading his four whole-batch deaths gave.
       The instrument pools reuse only voices SFX-10 measured at a real
       operating point. A voice that does not resolve is a silent sound. */

    /* ---- FRICTION: things that RUB ---------------------------------- */
    door_more: {
      base: { synth: 'friction', mat: 'stone', hz: 74, rough: 31, modes: 5,
              bright: 0.38, decay: 0.5, damp: 1.6, warble: 0.9, atk: 0.125,
              slide: -5, trans: 0.16, transHz: 700, transQ: 0.9, grit: 0.9,
              gritHz: 520, space: 0.15, room: 0.1875, refl: 1, dark: 900,
              width: 0.6, drive: 0.09, mkup: 0.78, gain: 0.32 },
      jit:  { hz: [58, 112], rough: [22, 42], decay: [0.375, 0.625],
              slide: [-8, -2], bright: [0.28, 0.55], grit: [0.78, 1],
              gritHz: [400, 800], width: [0.5, 0.8], dark: [700, 1400] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    eat_more: {
      base: { synth: 'friction', mat: 'water', hz: 155, rough: 19, modes: 5,
              bright: 0.66, decay: 0.1875, damp: 2.3, warble: 1.3, atk: 0,
              slide: -4, trans: 0.5, transHz: 1150, transQ: 0.9, grit: 0.68,
              gritHz: 760, space: 0.05, room: 0.0625, refl: 0, dark: 1000,
              width: 0.38, drive: 0.18, mkup: 1.1, gain: 0.34 },
      jit:  { hz: [115, 215], rough: [13, 28], decay: [0.125, 0.25],
              transHz: [780, 1900], grit: [0.5, 0.85], gritHz: [560, 1250],
              warble: [0.8, 2.1], damp: [1.8, 2.7], width: [0.3, 0.5] },
      hitSets: [[0], [0, 0.0625], [0], [0, 0.09375], [0]]
    },
    lungs_more: {
      base: { synth: 'friction', mat: 'ash', hz: 96, rough: 13, modes: 5,
              bright: 0.44, decay: 0.6875, damp: 1.8, warble: 1.7, atk: 0.1875,
              slide: -3, trans: 0.09, transHz: 620, transQ: 0.7, grit: 0.8,
              gritHz: 540, space: 0.16, room: 0.1875, refl: 1, dark: 880,
              width: 0.66, drive: 0.06, mkup: 0.9, gain: 0.31 },
      jit:  { hz: [78, 140], rough: [9, 20], decay: [0.5, 0.875],
              atk: [0.125, 0.3125], slide: [-6, -1], warble: [1.2, 2.4],
              bright: [0.34, 0.62], width: [0.55, 0.85], dark: [700, 1500] },
      hitSets: [[0], [0], [0, 0.375], [0], [0]]
    },
    swing_more: {
      base: { synth: 'friction', mat: 'ash', hz: 340, rough: 11, modes: 4,
              bright: 0.95, decay: 0.1875, damp: 2.5, warble: 0.3, atk: 0.03125,
              slide: -9, trans: 0.2, transHz: 2600, transQ: 1.2, grit: 0.7,
              gritHz: 2200, space: 0.08, room: 0.0625, refl: 0, dark: 3200,
              width: 0.58, drive: 0.07, mkup: 0.74, gain: 0.32 },
      jit:  { hz: [250, 470], rough: [7, 17], decay: [0.125, 0.25],
              slide: [-13, -5], bright: [0.75, 1.25], gritHz: [1700, 3100],
              damp: [2, 2.7], width: [0.48, 0.78], dark: [2400, 4400] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    wind_more: {
      base: { synth: 'friction', mat: 'ash', hz: 62, rough: 8, modes: 5,
              bright: 0.34, decay: 1.25, damp: 1.3, warble: 2.1, atk: 0.375,
              slide: 3, trans: 0.05, transHz: 480, transQ: 0.6, grit: 0.72,
              gritHz: 420, space: 0.19, room: 0.25, refl: 1, dark: 700,
              width: 0.8, drive: 0.04, mkup: 0.9, gain: 0.28 },
      jit:  { hz: [48, 96], rough: [5, 14], decay: [1, 1.5],
              atk: [0.25, 0.5], slide: [1, 5], warble: [1.5, 2.9],
              bright: [0.26, 0.5], width: [0.68, 1], dark: [560, 1100] },
      hitSets: [[0], [0], [0], [0], [0]]
    },

    /* ---- MODAL: things that are STRUCK ------------------------------ */
    dry_more: {
      base: { synth: 'modal', mat: 'bone', hz: 300, modes: 5, bright: 0.9,
              decay: 0.09375, damp: 2.5, warble: 0.25, atk: 0, trans: 0.72,
              transHz: 3600, transQ: 1.8, grit: 0.42, gritHz: 2400,
              space: 0.06, room: 0.0625, refl: 0, dark: 2900, width: 0.48,
              drive: 0.06, mkup: 0.86, gain: 0.34 },
      jit:  { hz: [220, 430], decay: [0.0625, 0.15625], bright: [0.72, 1.2],
              transHz: [2600, 4800], damp: [2, 2.7], width: [0.38, 0.64],
              dark: [2200, 4200] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    mag_more: {
      base: { synth: 'modal', mat: 'wood', hz: 178, modes: 6, bright: 0.66,
              decay: 0.125, damp: 2.2, warble: 0.35, atk: 0, trans: 0.66,
              transHz: 1800, transQ: 1.4, grit: 0.38, gritHz: 1300,
              space: 0.08, room: 0.0625, refl: 0, dark: 2000, width: 0.5,
              drive: 0.09, mkup: 0.84, gain: 0.33 },
      jit:  { hz: [140, 265], decay: [0.09375, 0.1875], bright: [0.52, 0.95],
              transHz: [1400, 2700], damp: [1.8, 2.6], grit: [0.26, 0.52],
              width: [0.4, 0.68], dark: [1600, 3000] },
      hitSets: [[0], [0, 0.0625], [0], [0], [0, 0.09375]]
    },
    down_more: {
      base: { synth: 'modal', mat: 'stone', hz: 58, modes: 7, bright: 0.4,
              decay: 1, damp: 1.2, warble: 1.4, atk: 0.0625, slide: -6,
              trans: 0.3, transHz: 620, transQ: 0.8, grit: 0.34, gritHz: 460,
              space: 0.2, room: 0.25, refl: 1, dark: 780, width: 0.78,
              drive: 0.05, mkup: 0.94, gain: 0.34 },
      jit:  { hz: [46, 92], decay: [0.75, 1.25], slide: [-11, -3],
              bright: [0.3, 0.6], width: [0.66, 1], dark: [620, 1300] },
      hitSets: [[0], [0], [0, 0.5], [0], [0]]
    },

    /* ---- INSTRUMENT: objects with a grain, off HIS rack -------------- */
    /* only voices SFX-10 measured at a real operating point */
    sign_more: {
      base: { synth: 'instrument', inst: 'guiro', mat: 'ash', hz: 128,
              modes: 5, bright: 0.6, decay: 0.3125, damp: 2, warble: 0.8,
              atk: 0, trans: 0.42, transHz: 1500, transQ: 1.1, grit: 0.6,
              gritHz: 1000, space: 0.14, room: 0.1875, refl: 1, dark: 1500,
              width: 0.62, drive: 0.07, mkup: 0.86, gain: 0.33 },
      jit:  { hz: [100, 205], decay: [0.25, 0.4375], width: [0.5, 0.82],
              dark: [1100, 2400] },
      instSets: ['guiro', 'ratchet', 'rubboard', 'washboard', 'brushkit'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    chip_more: {
      base: { synth: 'instrument', inst: 'pickscrape', mat: 'stone', hz: 400,
              modes: 6, bright: 1.05, decay: 0.1875, damp: 2, warble: 0.5,
              atk: 0, trans: 0.52, transHz: 5200, transQ: 2, grit: 0.52,
              gritHz: 2900, space: 0.11, room: 0.125, refl: 1, dark: 3400,
              width: 0.7, drive: 0.06, mkup: 0.88, gain: 0.33 },
      jit:  { hz: [280, 580], decay: [0.15625, 0.28125], width: [0.58, 0.92],
              dark: [2500, 4800] },
      instSets: ['pickscrape', 'claves', 'spoonclack', 'rimshotr', 'cabasa'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    quit_more: {
      base: { synth: 'instrument', inst: 'rubboard', mat: 'ash', hz: 110,
              modes: 6, bright: 0.5, decay: 0.375, damp: 1.9, warble: 1.4,
              atk: 0.0625, slide: -4, trans: 0.2, transHz: 900, transQ: 0.8,
              grit: 0.5, gritHz: 700, space: 0.17, room: 0.1875, refl: 1,
              dark: 1100, width: 0.7, drive: 0.06, mkup: 0.92, gain: 0.34 },
      jit:  { hz: [88, 180], decay: [0.3125, 0.5], slide: [-8, -1],
              bright: [0.4, 0.78], width: [0.6, 0.95], dark: [880, 1900] },
      instSets: ['rubboard', 'guiro', 'ratchet', 'sodahiss', 'brushkit'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    buzz_more: {
      base: { synth: 'instrument', inst: 'ratchet', mat: 'bone', hz: 96,
              modes: 6, bright: 0.58, decay: 0.3125, damp: 1.9, warble: 2.4,
              atk: 0, trans: 0.6, transHz: 980, transQ: 1.1, grit: 0.5,
              gritHz: 720, space: 0.07, room: 0.0625, refl: 0, dark: 1200,
              width: 0.52, drive: 0.12, mkup: 0.88, gain: 0.33 },
      jit:  { hz: [76, 155], decay: [0.28125, 0.4375], warble: [1.8, 2.9],
              bright: [0.44, 0.85], width: [0.42, 0.72], dark: [900, 1900] },
      instSets: ['ratchet', 'guiro', 'rubboard', 'washboard', 'brushkit'],
      hitSets: [[0], [0], [0], [0], [0]]
    },

    /* ---- WAVE 2: FRICTION AND MODAL ONLY ---------------------------- */
    /* Six moments with an EVEN pool of two. No instrument here on purpose --
       not to move a gate number, but because every one of these is either a
       rub or a strike, and because instrument already holds the largest share
       of the rack by a distance. */
    cloth_more: {
      base: { synth: 'friction', mat: 'ash', hz: 210, rough: 15, modes: 4,
              bright: 0.58, decay: 0.25, damp: 2.2, warble: 0.6, atk: 0.03125,
              slide: -3, trans: 0.14, transHz: 1600, transQ: 0.9, grit: 0.82,
              gritHz: 1200, space: 0.07, room: 0.0625, refl: 0, dark: 1700,
              width: 0.5, drive: 0.06, mkup: 0.82, gain: 0.31 },
      jit:  { hz: [165, 300], rough: [10, 22], decay: [0.1875, 0.375],
              bright: [0.44, 0.85], grit: [0.7, 0.95], gritHz: [900, 1900],
              width: [0.4, 0.7], dark: [1300, 2600] },
      hitSets: [[0], [0, 0.09375], [0], [0], [0, 0.125]]
    },
    tape_more: {
      base: { synth: 'friction', mat: 'ash', hz: 280, rough: 24, modes: 4,
              bright: 0.8, decay: 0.3125, damp: 2.3, warble: 0.7, atk: 0.03125,
              slide: 4, trans: 0.18, transHz: 2200, transQ: 1, grit: 0.88,
              gritHz: 1800, space: 0.06, room: 0.0625, refl: 0, dark: 2400,
              width: 0.46, drive: 0.08, mkup: 0.8, gain: 0.32 },
      jit:  { hz: [210, 400], rough: [17, 34], decay: [0.25, 0.4375],
              slide: [1, 6], bright: [0.62, 1.1], gritHz: [1400, 2800],
              width: [0.36, 0.66], dark: [1900, 3600] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    power_more: {
      base: { synth: 'friction', mat: 'stone', hz: 88, rough: 20, modes: 5,
              bright: 0.46, decay: 0.4375, damp: 1.7, warble: 1.8, atk: 0.0625,
              slide: 2, trans: 0.32, transHz: 820, transQ: 1.1, grit: 0.76,
              gritHz: 600, space: 0.13, room: 0.125, refl: 1, dark: 1000,
              width: 0.6, drive: 0.1, mkup: 0.86, gain: 0.33 },
      jit:  { hz: [70, 140], rough: [14, 29], decay: [0.3125, 0.5625],
              warble: [1.3, 2.6], bright: [0.36, 0.7], width: [0.5, 0.82],
              dark: [800, 1800] },
      hitSets: [[0], [0, 0.1875], [0], [0, 0.125, 0.3125], [0]]
    },
    tread_more: {
      base: { synth: 'modal', mat: 'bone', hz: 232, modes: 5, bright: 0.62,
              decay: 0.125, damp: 2.1, warble: 0.4, atk: 0, trans: 0.6,
              transHz: 1600, transQ: 1.2, grit: 0.36, gritHz: 1100,
              space: 0.09, room: 0.0625, refl: 0, dark: 1800, width: 0.52,
              drive: 0.07, mkup: 0.84, gain: 0.33 },
      jit:  { hz: [180, 330], decay: [0.09375, 0.1875], bright: [0.48, 0.9],
              transHz: [1200, 2500], damp: [1.7, 2.5], grit: [0.24, 0.5],
              width: [0.42, 0.72], dark: [1400, 2700] },
      hitSets: [[0], [0], [0], [0], [0]]
    },
    hunker_more: {
      base: { synth: 'modal', mat: 'stone', hz: 132, modes: 6, bright: 0.5,
              decay: 0.21875, damp: 1.9, warble: 0.6, atk: 0.03125,
              trans: 0.44, transHz: 1100, transQ: 1, grit: 0.5, gritHz: 820,
              space: 0.12, room: 0.125, refl: 1, dark: 1300, width: 0.6,
              drive: 0.08, mkup: 0.86, gain: 0.33 },
      jit:  { hz: [104, 210], decay: [0.15625, 0.3125], bright: [0.38, 0.75],
              transHz: [850, 1900], grit: [0.36, 0.66], width: [0.5, 0.82],
              dark: [1000, 2100] },
      hitSets: [[0], [0, 0.09375], [0], [0], [0, 0.0625]]
    },
    seton_more: {
      base: { synth: 'modal', mat: 'wood', hz: 156, modes: 6, bright: 0.6,
              decay: 0.1875, damp: 2.2, warble: 0.4, atk: 0, trans: 0.58,
              transHz: 1500, transQ: 1.2, grit: 0.34, gritHz: 1100,
              space: 0.11, room: 0.125, refl: 1, dark: 1800, width: 0.64,
              drive: 0.08, mkup: 0.84, gain: 0.32 },
      /* refl 0 -> 1 IS THE ACTUAL CAUSE, AND RAISING `width` WAS NOT.
         seton_more.4 rendered at a stereo width of 0.0193 and the gate called
         it dead mono. I raised the `width` FIELD first; the failure simply
         MOVED TO VARIANT 3, which is the tell that the field I changed was not
         the one that mattered -- `width` is a spec value and the measured
         stereo width is an outcome. The three modal recipes in this batch that
         PASS all carry refl 1; this one carried refl 0. Early reflections are
         where the stereo comes from. space stays at 0.11, well under the 0.2
         ceiling this batch holds itself to. */
      jit:  { hz: [124, 235], decay: [0.125, 0.28125], bright: [0.46, 0.9],
              transHz: [1150, 2400], damp: [1.8, 2.6], width: [0.54, 0.86],
              dark: [1400, 2700] },
      hitSets: [[0], [0], [0, 0.09375], [0], [0]]
    },
"""


def preflight(e):
    """REFUSE TO COOK A GRAVE, AND REFUSE TO NAME A VOICE THAT HAS NEVER
    RENDERED. Both are cheaper to check here than to find out from a silent
    game, and a silent sound effect is the worst thing this lane can ship."""
    bad = []
    dead = set()
    for field in ('twiceDead', 'onceDeadWhole', 'deadMethod'):
        m = re.search(field + r':\s*\[(.*?)\]', e, re.S)
        if m:
            dead.update(re.findall(r"'([a-z_]+)'", m.group(1)))
    for n in NEW:
        if n in dead or PARENT[n] in dead:
            bad.append('%s answers %s, which is in the graveyard' % (n, PARENT[n]))
        if "ev: '%s'" % n in e:
            bad.append('%s already exists -- this would be a duplicate cook' % n)
    proven = set()
    for st in re.findall(r"instSets:\s*\[([^\]]*)\]", e):
        proven.update(re.findall(r"'([a-z0-9]+)'", st))
    for st in re.findall(r"instSets:\s*\[([^\]]*)\]", RECIPES):
        for v in re.findall(r"'([a-z0-9]+)'", st):
            if v not in proven:
                bad.append('voice %r has never rendered in a shipped instSet' % v)
    for meth in re.findall(r"synth:\s*'([a-z]+)'", RECIPES):
        if meth in dead:
            bad.append('method %r is barred' % meth)
    if "mat: 'metal'" in RECIPES:
        bad.append("mat 'metal' is his one stable material finding: 3 UP / 22 DOWN")
    for sp in re.findall(r"space:\s*([0-9.]+)", RECIPES):
        if float(sp) > 0.2:
            bad.append('space %s announces the room' % sp)
    return bad


def main():
    e = open(ENGINE, encoding='utf8').read()
    if E_MARK in e:
        print('  SFX-11 already installed (idempotent, nothing to do)')
        return 0

    bad = preflight(e)
    if bad:
        print('=== SFX-11 - REFUSING TO COOK ===')
        for b in bad:
            print('  > ' + b)
        return 1

    # ANCHOR ON THE LAST REAL ELEMENT, NEVER ON THE CLOSING BRACKET.
    # The first cut walked back from `\n  ];` stripping commas and then
    # prepended one. Both tables END IN COMMENT LINES, so that produced
    #     },  /* end batch 02 events */,
    #        { ev: 'door_more' ...
    # which is a comma after a comment, which is an ELISION -- a HOLE in the
    # array. The engine parsed fine, the file read fine, and the judge board
    # died on `Cannot read properties of undefined (reading 'ev')`. A trailing
    # comma is legal and a hole is not, and nothing but running it tells them
    # apart. So: find the last real element's closing brace and insert after it.
    def inject(src, start_key, close, block):
        k = src.index(start_key)
        end = src.index(close, k)
        last = src.rindex('}', k, end)          # the last element, not the table
        tail = src[last + 1:end]
        # AND THE ORIGINAL SEPARATOR COMES ALONG WITH THE TAIL. The text after
        # that brace begins with the comma that USED to separate it from what
        # followed, so pasting the block in front of it yields `},\n,\n` --
        # a double comma, which is a HOLE, which is the same undefined element
        # the first version produced by a different route. Second time in one
        # turn, so it is written down: the fix is not a cleverer anchor, it is
        # OWNING EVERY SEPARATOR the splice touches.
        tail = tail.lstrip()
        if tail.startswith(','):
            tail = tail[1:]
        return src[:last + 1] + ',\n' + block + '\n    ' + tail.lstrip() + src[end:]

    e = inject(e, 'var EVENTS', '\n  ];\n', EVENTS)
    e = inject(e, 'var RECIPE', '\n  };\n', RECIPES)

    open(ENGINE, 'w', encoding='utf8').write(e)
    print('=== SFX-11 - EIGHTEEN POOLS, NINETY SOUNDS ===')
    for n in NEW:
        print('    %-11s widens %s' % (n, PARENT[n]))

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
    print('  all eighteen reached the alpha. 90 candidates on the board, 0 canon.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
