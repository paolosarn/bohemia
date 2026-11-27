#!/usr/bin/env node
/* BOHEMIA -- MORE SONGS, MADE THE SAME WAY AS THE LAST GOOD ONES (SOUNDS THREE, 11/27/26, rule 488).

   PAOLO 11/27: 'we need more music please, the good way you did, the exact same way that you made it last time, it was
   doing good. We need more tunes... I keep hearing the same songs. I thought we had lots of songs.'

   THE RECIPE IS THE FOUR OF 10/25 (records/BOHEMIA_FOUR_NEW_SONGS_SOUNDS_10_25_26.md, his UP on all four, then 'I like the
   songs, I want you to implement them'): this tool has NO render of its own. Every song here goes through
   tools/bohemia_sounds_four_new_songs.js's own render and record, the same 32-bar form (an intro of the bed and the beat,
   A, B, A an octave up, the ending), the same worn tape (a soft saturation, the top rolled off at 7.5 kHz), the same three
   levels on one timeline (1 the map, 2 their turn, 3 your turn), the same gap set by measuring (tools/bohemia_sounds_three
   _levels.js: level 2 3.6 dB over level 1, level 3 7.8 dB over level 2, through a phone AND on full range), the same hit
   into your turn, the same kit set 9 dB under the tune through a phone, level 1 at his songs' loudness (-36.5 dB through a
   phone), the same 120 beat.

   WHAT IS WRITTEN HERE, NOTE BY NOTE: twelve songs, each its own (rule 166(b)): its own lead, bass, pad and drums (three
   real recordings from the CC0 bank, none used by another song), its own key (root and mode), its own groove inside the
   120 grid, a melody that asks for two bars and answers for two, a B section that climbs. Every lead, bass and pad was
   chosen by measuring the rack first (about 150 voices rendered offline: the pitch held, the level, how long it rings; ten
   that render silent offline were left out), every drum by measuring its recording (the hit's peak within 25 ms of the
   beat, else it is cut at its peak, 'at'). Two things the four did by ear are set by measuring here (balance): the bass
   3 dB and the pad 9 dB under the tune on full-range speakers, where the four's synth-led songs measured (the bass +0.2
   to -8.5, the pad -3.9 to -12.2 against the tune, 11/27).

     node tools/bohemia_sounds_more_songs.js record [slug|all]      levels 1, 2, 3, the hit, A FIGHT, measured.json
     node tools/bohemia_sounds_more_songs.js register [slug|all] [--write]   the VOTE cards and the list the cards read
   writes slices/vote/songs/more_songs/<slug>/. The game plays them (tools/bohemia_sounds_the_songs_go_in_patch.py reads
   this folder's list); the rotation plays every song in turn (engine/bohemia_every_song_in_turn.js).
   Gate: gates/more_songs_the_same_way_gate.py. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const F = require(path.join(ROOT, 'tools', 'bohemia_sounds_four_new_songs.js'));
const OUTD = path.join(ROOT, 'slices', 'vote', 'songs', 'more_songs');
const BALANCE = { bass_k_db: -3, pad_k_db: -9 };
const slug = F.slug;

/* modes (7 notes unless named): the render reads the scale's own length, so a five-note scale's degree 5 is its octave */
const AEOLIAN = [0, 2, 3, 5, 7, 8, 10], DORIAN = [0, 2, 3, 5, 7, 9, 10], LYDIAN = [0, 2, 4, 6, 7, 9, 11], IONIAN = [0, 2, 4, 5, 7, 9, 11],
  MIXO = [0, 2, 4, 5, 7, 9, 10], HARM = [0, 2, 3, 5, 7, 8, 11], PHRYG_DOM = [0, 1, 4, 5, 7, 8, 10],
  MIN_PENT = [0, 3, 5, 7, 10], HIRAJOSHI = [0, 2, 3, 7, 8], IN_SCALE = [0, 1, 5, 7, 8];

/* root: the engine's semitone (0 = A2, 110 Hz); it sets the bass and the pad (root - 12) and, with lead.oct, the tune
   (root + 12 + 12 x oct). melody [bar-in-phrase, step, degree, steps]; chords the root degree of each bar of a four-bar
   phrase (chordsB for the B section); groove per level; bassLine per level [step, steps]; kit gains level the three hits
   against each other (kick and snare about -17 dB, the hat -24, measured one by one), the whole kit then set 9 dB under the
   tune by the recipe's calibration. */
const SONGS = [
  { name: 'THE ICE CREAM TRUCK STILL PLAYS ITS SONG', key: 'G lydian', root: 10, mode: LYDIAN,   /* F lydian read 0.943 against THE CHURCH CLOCK (six notes of seven shared): G */
    story: 'an ice cream truck parked on a cul-de-sac in Summerlin, its battery dying, its jingle still calling kids who left with their families',
    lead: { voice: 'musicbox', gain: 0.2, oct: 0 }, leadName: 'a music box, the truck\'s own jingle',
    bass: 'uprightslap', pad: 'glasspad',
    kit: { kick: { stem: '3-94343-A-25', ms: 220, gain: 0.45, lp: 500 }, snare: { stem: '3-203373-A-39', ms: 180, gain: 0.57 }, hat: { stem: '2-122763-B-29', ms: 50, gain: 2.4, hp: 3000 } },
    kitName: 'a footstep for the kick, a bottle breaking for the snare, a kid slurping for the hat',
    chords: [0, 1, 0, 4], chordsB: [5, 1, 3, 4], groove: {
      1: { kick: [0, 8], hat: [4, 12] },
      2: { kick: [0, 3, 8], hat: [2, 6, 10, 14] },
      3: { kick: [0, 3, 8], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },
    bassLine: { 1: [[0, 4], [8, 4]], 2: [[0, 2], [4, 2], [8, 2], [12, 2]], 3: [[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 2], [0, 2, 2, 2], [0, 4, 0, 2], [0, 6, 2, 2], [0, 8, 4, 2], [0, 10, 5, 2], [0, 12, 4, 4],
          [1, 0, 3, 2], [1, 2, 4, 2], [1, 4, 3, 2], [1, 6, 1, 2], [1, 8, 2, 8],
          [2, 0, 4, 2], [2, 2, 2, 2], [2, 4, 0, 2], [2, 6, 2, 2], [2, 8, 4, 2], [2, 10, 7, 2], [2, 12, 6, 4],
          [3, 0, 5, 2], [3, 2, 4, 2], [3, 4, 3, 2], [3, 6, 1, 2], [3, 8, 0, 8]],
      B: [[0, 0, 7, 4], [0, 4, 8, 4], [0, 8, 9, 8], [1, 0, 8, 2], [1, 2, 7, 2], [1, 4, 6, 4], [1, 8, 4, 8],
          [2, 0, 5, 2], [2, 2, 6, 2], [2, 4, 7, 2], [2, 6, 8, 2], [2, 8, 9, 4], [2, 12, 10, 4], [3, 0, 11, 4], [3, 4, 9, 4], [3, 8, 7, 8]] } },
  { name: 'THE WEDDING CHAPEL TAKES ONE MORE BOOKING', key: 'G harmonic minor', root: 10, mode: HARM,
    story: 'a drive-through wedding chapel on the Strip with its lights on and its organ playing, booking couples who never come',
    lead: { voice: 'pumporgan', gain: 0.06, oct: 0 }, leadName: 'a pump organ, the chapel\'s own',
    bass: 'foreclosurebass', pad: 'boychoir',
    kit: { kick: { stem: '4-186518-A-30', ms: 240, gain: 1.5, lp: 800 }, snare: { stem: '4-204777-A-39', ms: 180, gain: 0.7 }, hat: { stem: '5-204114-A-29', ms: 50, gain: 1.2, hp: 3000 } },
    kitName: 'the chapel door knocked for the kick, a champagne glass breaking for the snare, a sip for the hat',
    chords: [0, 3, 4, 0], chordsB: [5, 1, 4, 4], groove: {
      1: { kick: [0, 8], hat: [0, 4, 8, 12] },
      2: { kick: [0, 7, 8], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 8, 11], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },   /* [0,7,8] with a snare on 14 blurred the quarter: pulse 0.124 */
    bassLine: { 1: [[0, 16]], 2: [[0, 4], [4, 4], [8, 4], [12, 4]], 3: [[0, 3], [3, 3], [6, 2], [8, 4], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 6], [0, 6, 3, 2], [0, 8, 2, 4], [0, 12, 1, 4], [1, 0, 2, 4], [1, 4, 3, 4], [1, 8, 4, 8],
          [2, 0, 5, 6], [2, 6, 4, 2], [2, 8, 3, 4], [2, 12, 2, 4], [3, 0, 1, 4], [3, 4, -1, 4], [3, 8, 0, 8]],
      B: [[0, 0, 4, 4], [0, 4, 5, 4], [0, 8, 6, 8], [1, 0, 7, 8], [1, 8, 6, 4], [1, 12, 5, 4],
          [2, 0, 4, 4], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 3, 4], [2, 12, 2, 4], [3, 0, 3, 4], [3, 4, 2, 4], [3, 8, 4, 8]] } },
  { name: 'THE LOUNGE SINGER STILL TAKES REQUESTS', key: 'B flat dorian', root: 13, mode: DORIAN, swing: 0.22,
    story: 'the lounge of a dead casino where a voice still sings to empty tables, taking requests from nobody',
    lead: { voice: 'ondes', gain: 0.03, oct: -1 }, leadName: 'an ondes martenot, a voice that is not a voice',
    bass: 'uprightjazz', pad: 'wornstrings',
    kit: { kick: { stem: '5-234855-A-25', ms: 220, gain: 1.5, lp: 500 }, snare: { stem: '2-54961-A-23', ms: 140, gain: 0.6, hp: 800 }, hat: { stem: '1-9886-A-49', ms: 60, gain: 0.65, hp: 4000 } },
    kitName: 'a soft footstep for the kick, a breath for the brush, a saw stroke for the ride, swung',
    chords: [0, 3, 0, 3], chordsB: [2, 6, 3, 4], groove: {
      1: { kick: [0, 8], hat: [4, 12] },   /* [0,10] read 0.137 on the quarter */
      2: { kick: [0, 10], hat: [0, 4, 7, 8, 12, 15] },
      3: { kick: [0, 7, 10], snare: [4, 12], hat: [0, 4, 7, 8, 12, 15] } },
    bassLine: { 1: [[0, 6], [10, 6]], 2: [[0, 4], [4, 4], [8, 4], [12, 4]], 3: [[0, 3], [4, 3], [7, 1], [8, 3], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 2, 4, 2], [0, 4, 5, 6], [0, 10, 4, 2], [0, 12, 2, 4], [1, 0, 3, 4], [1, 4, 2, 2], [1, 6, 0, 10],
          [2, 2, 4, 2], [2, 4, 5, 6], [2, 10, 7, 2], [2, 12, 6, 4], [3, 0, 5, 4], [3, 4, 4, 4], [3, 8, 3, 8]],
      B: [[0, 0, 7, 6], [0, 6, 8, 2], [0, 8, 9, 8], [1, 0, 8, 4], [1, 4, 7, 4], [1, 8, 5, 8],
          [2, 0, 6, 4], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 5, 4], [2, 12, 6, 4], [3, 0, 4, 16]] } },
  { name: 'ONE SIGN IN THE BONEYARD STILL BUZZES', key: 'E minor pentatonic', root: 7, mode: MIN_PENT,
    story: 'the field off Las Vegas Boulevard where the dead signs were laid down, and one tube that still lights at night',
    lead: { voice: 'vibraphone', gain: 0.07, oct: 0 }, leadName: 'a vibraphone, cold metal',
    bass: 'reese', pad: 'sinepad',
    kit: { kick: { stem: '3-249913-A-25', ms: 220, gain: 0.5, lp: 500 }, snare: { stem: '3-203371-A-39', ms: 180, gain: 0.43 }, hat: { stem: '4-181563-A-12', ms: 50, gain: 1.7, hp: 2500 } },
    kitName: 'a footstep for the kick, a neon tube breaking for the snare, a crackle for the hat, half time',
    chords: [0, 3, 2, 4], chordsB: [1, 0, 3, 4], groove: {
      1: { kick: [0], hat: [4, 8, 12] },
      2: { kick: [0, 10], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 3, 10], snare: [8], hat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14] } },
    bassLine: { 1: [[0, 10]], 2: [[0, 3], [3, 3], [6, 4], [10, 6]], 3: [[0, 2], [3, 2], [6, 2], [10, 2], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 3, 2], [0, 2, 3, 2], [0, 4, 4, 4], [0, 8, 3, 2], [0, 10, 2, 2], [0, 12, 1, 4], [1, 0, 2, 6], [1, 6, 1, 2], [1, 8, 0, 8],
          [2, 0, 3, 2], [2, 2, 3, 2], [2, 4, 5, 4], [2, 8, 4, 2], [2, 10, 3, 2], [2, 12, 4, 4], [3, 0, 3, 4], [3, 4, 2, 4], [3, 8, 0, 8]],
      B: [[0, 0, 5, 4], [0, 4, 6, 4], [0, 8, 7, 8], [1, 0, 6, 2], [1, 2, 5, 2], [1, 4, 4, 4], [1, 8, 3, 8],
          [2, 0, 4, 2], [2, 2, 5, 2], [2, 4, 6, 2], [2, 6, 7, 2], [2, 8, 8, 8], [3, 0, 7, 4], [3, 4, 6, 4], [3, 8, 3, 8]] } },
  { name: 'LAKE MEAD GIVES BACK WHAT IT TOOK', key: 'A hirajoshi (five notes)', root: 12, mode: HIRAJOSHI,
    story: 'the reservoir going down year after year, a town\'s roofs coming up out of the water, and the barrels on the new shore',
    lead: { voice: 'shakuhachi', gain: 0.055, oct: -1 }, leadName: 'a bamboo flute you can hear the breath in',
    bass: 'boneyardbass', pad: 'stillwater',
    kit: { kick: { stem: '3-164593-A-15', ms: 200, gain: 1.55, lp: 900 }, snare: { stem: '3-94355-A-33', ms: 160, gain: 1.2, hp: 600 }, hat: { stem: '3-164594-A-15', ms: 50, gain: 1.5, hp: 3000 } },
    kitName: 'a drop of water for the kick, a boat\'s wood creaking for the snare, another drop for the hat',
    chords: [0, 4, 3, 0], chordsB: [2, 1, 4, 3], groove: {
      1: { kick: [0, 11], hat: [0, 4, 8, 12] },
      2: { kick: [0, 6, 11], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 6, 11], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 13, 14] } },
    bassLine: { 1: [[0, 16]], 2: [[0, 6], [6, 2], [8, 8]], 3: [[0, 3], [3, 3], [6, 2], [8, 3], [11, 3], [14, 2]] },
    melody: {
      A: [[0, 0, 3, 8], [0, 8, 4, 4], [0, 12, 3, 4], [1, 0, 2, 4], [1, 4, 1, 4], [1, 8, 0, 8],
          [2, 0, 3, 6], [2, 6, 4, 2], [2, 8, 5, 8], [3, 0, 4, 4], [3, 4, 3, 2], [3, 6, 2, 2], [3, 8, 0, 8]],
      B: [[0, 0, 5, 4], [0, 4, 6, 4], [0, 8, 7, 8], [1, 0, 8, 8], [1, 8, 7, 4], [1, 12, 6, 4],
          [2, 0, 5, 4], [2, 4, 4, 4], [2, 8, 3, 8], [3, 0, 4, 4], [3, 4, 3, 4], [3, 8, 1, 8]] } },
  { name: 'THE MONORAIL RUNS WITH NOBODY ON IT', key: 'F sharp phrygian dominant', root: 9, mode: PHRYG_DOM,
    story: 'the Strip\'s monorail still running its loop on the last power, the doors opening at every empty station',
    lead: { voice: 'clarinet', gain: 0.05, oct: 0 }, leadName: 'a clarinet, the old-world kind',
    bass: 'fmbass', pad: 'harmonium',
    kit: { kick: { stem: '4-165845-B-45', ms: 240, gain: 0.9, lp: 300 }, snare: { stem: '4-188287-A-9', ms: 180, gain: 0.6, at: 0.11 }, hat: { stem: '4-165845-A-45', ms: 50, gain: 0.42, hp: 3000 } },
    kitName: 'a train for the kick, a crow on the rail for the snare, the train\'s rattle for the hat',
    chords: [0, 1, 0, 6], chordsB: [3, 1, 0, 0], groove: {
      1: { kick: [0, 8], hat: [2, 6, 10, 14] },
      2: { kick: [0, 8], hat: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14] },
      3: { kick: [0, 6, 8, 14], snare: [4, 12], hat: [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15] } },
    bassLine: { 1: [[0, 4], [8, 4]], 2: [[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2]], 3: [[0, 1], [2, 1], [4, 1], [6, 1], [8, 1], [10, 1], [12, 1], [14, 1]] },
    melody: {
      A: [[0, 0, 0, 2], [0, 2, 1, 2], [0, 4, 2, 2], [0, 6, 1, 2], [0, 8, 0, 4], [0, 12, -1, 4], [1, 0, 0, 2], [1, 2, 1, 2], [1, 4, 2, 2], [1, 6, 3, 2], [1, 8, 4, 8],
          [2, 0, 5, 2], [2, 2, 4, 2], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 3, 2], [2, 10, 2, 2], [2, 12, 1, 4], [3, 0, 2, 2], [3, 2, 1, 2], [3, 4, 0, 12]],
      B: [[0, 0, 4, 4], [0, 4, 5, 4], [0, 8, 6, 4], [0, 12, 7, 4], [1, 0, 8, 6], [1, 6, 7, 2], [1, 8, 6, 8],
          [2, 0, 5, 2], [2, 2, 6, 2], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 5, 4], [2, 12, 4, 4], [3, 0, 1, 8], [3, 8, 0, 8]] } },
  { name: 'THE DRIVE-IN SHOWS THE SAME REEL', key: 'A flat major', root: 11, mode: IONIAN,
    story: 'the drive-in off Boulder Highway whose projector still runs one reel at dusk, and the cars that honk at it',
    lead: { voice: 'honkytonk', gain: 0.16, oct: 0 }, leadName: 'an upright piano nobody tunes, the intermission\'s',
    bass: 'doghouse', pad: null,
    kit: { kick: { stem: '1-155858-E-25', ms: 220, gain: 2.9, lp: 500 }, snare: { stem: '5-179860-A-43', ms: 160, gain: 0.55, at: 0.082 }, hat: { stem: '4-182369-A-12', ms: 50, gain: 1.7, hp: 2500 } },
    kitName: 'a footstep for the kick, a car horn for the snare, the film\'s crackle for the hat',
    chords: [0, 5, 1, 4], chordsB: [3, 4, 2, 5], groove: {
      1: { kick: [0, 8], hat: [4, 12] },
      2: { kick: [0, 5, 8, 13], hat: [4, 12] },
      3: { kick: [0, 5, 8, 13], snare: [4, 12], hat: [2, 6, 10, 14] } },
    bassLine: { 1: [[0, 8], [8, 8]], 2: [[0, 4], [8, 4], [12, 4]], 3: [[0, 2], [4, 2], [6, 2], [8, 2], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 3], [0, 3, 5, 1], [0, 4, 4, 4], [0, 8, 2, 4], [0, 12, 0, 4], [1, 0, 1, 3], [1, 3, 2, 1], [1, 4, 1, 4], [1, 8, -1, 8],
          [2, 0, 4, 3], [2, 3, 5, 1], [2, 4, 4, 4], [2, 8, 7, 4], [2, 12, 6, 4], [3, 0, 5, 4], [3, 4, 4, 4], [3, 8, 0, 8]],
      B: [[0, 0, 3, 3], [0, 3, 4, 1], [0, 4, 5, 4], [0, 8, 7, 8], [1, 0, 6, 3], [1, 3, 5, 1], [1, 4, 4, 4], [1, 8, 2, 8],
          [2, 0, 1, 3], [2, 3, 2, 1], [2, 4, 3, 4], [2, 8, 5, 4], [2, 12, 4, 4], [3, 0, 6, 8], [3, 8, 4, 8]] } },
  { name: 'THE MOTEL SIGN SAYS VACANCY', key: 'D dorian', root: 5, mode: DORIAN,
    story: 'a motel on Fremont whose VACANCY sign has never once gone off, every room open, every key on its hook',
    lead: { voice: 'lapsteel', gain: 0.04, oct: 0 }, leadName: 'a lap steel guitar, sliding',
    bass: 'outlawbass', pad: 'dawnwash',
    kit: { kick: { stem: '4-218304-A-25', ms: 220, gain: 3.2, lp: 700 }, snare: { stem: '2-141563-A-39', ms: 180, gain: 0.8, at: 0.268 }, hat: { stem: '3-96606-A-49', ms: 60, gain: 0.4, hp: 4000 } },
    kitName: 'a boot heel for the kick, a bottle breaking for the snare, a saw stroke for the shaker, a gallop',
    chords: [0, 6, 3, 0], chordsB: [2, 6, 0, 4], groove: {
      1: { kick: [0, 6], hat: [4, 12] },
      2: { kick: [0, 6], hat: [0, 3, 4, 7, 8, 11, 12, 15] },
      3: { kick: [0, 6, 11], snare: [4, 12], hat: [0, 3, 4, 7, 8, 11, 12, 15] } },
    bassLine: { 1: [[0, 12]], 2: [[0, 6], [6, 4], [10, 6]], 3: [[0, 3], [3, 3], [6, 4], [10, 3], [13, 3]] },
    melody: {
      A: [[0, 0, 4, 8], [0, 8, 3, 4], [0, 12, 4, 4], [1, 0, 7, 6], [1, 6, 6, 2], [1, 8, 4, 8],
          [2, 0, 4, 4], [2, 4, 3, 4], [2, 8, 2, 4], [2, 12, 1, 4], [3, 0, 0, 16]],
      B: [[0, 0, 5, 4], [0, 4, 6, 4], [0, 8, 7, 8], [1, 0, 8, 6], [1, 6, 7, 2], [1, 8, 5, 8],
          [2, 0, 6, 4], [2, 4, 5, 4], [2, 8, 4, 4], [2, 12, 3, 4], [3, 0, 4, 16]] } },
  { name: 'THE WATER TOWER READS OUT NUMBERS', key: 'B in-scale (five notes)', root: 14, mode: IN_SCALE,
    story: 'the water tower in North Las Vegas whose old emergency speaker plays a tune at night and then reads out numbers',
    lead: { voice: 'whistle', gain: 0.04, oct: -1 }, leadName: 'a whistled tone, the station\'s call sign',
    bass: 'sub', pad: 'ghostpad',
    kit: { kick: { stem: '3-151557-B-28', ms: 240, gain: 3.2, lp: 400 }, snare: { stem: '3-146873-A-24', ms: 200, gain: 1.0 }, hat: { stem: '5-261464-A-23', ms: 60, gain: 0.5, hp: 3000 } },
    kitName: 'a low snore for the kick, a cough on the microphone for the snare, a breath for the hat, the tresillo',
    chords: [0, 0, 1, 0], chordsB: [2, 1, 4, 3], groove: {
      1: { kick: [0, 6, 12], hat: [0, 4, 8, 12] },
      2: { kick: [0, 6, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 6, 12], snare: [4, 10], hat: [0, 2, 4, 6, 8, 10, 12, 14, 15] } },
    bassLine: { 1: [[0, 6], [6, 6], [12, 4]], 2: [[0, 3], [6, 3], [12, 3]], 3: [[0, 2], [3, 2], [6, 2], [10, 2], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 3, 2], [0, 2, 4, 2], [0, 4, 3, 4], [0, 8, 2, 4], [0, 12, 0, 4], [1, 0, 1, 4], [1, 4, 0, 12],
          [2, 0, 3, 2], [2, 2, 4, 2], [2, 4, 3, 4], [2, 8, 5, 4], [2, 12, 4, 4], [3, 0, 3, 4], [3, 4, 1, 4], [3, 8, 0, 8]],
      B: [[0, 0, 5, 2], [0, 2, 6, 2], [0, 4, 5, 4], [0, 8, 7, 8], [1, 0, 6, 4], [1, 4, 5, 4], [1, 8, 3, 8],
          [2, 0, 4, 2], [2, 2, 5, 2], [2, 4, 6, 2], [2, 6, 7, 2], [2, 8, 8, 8], [3, 0, 7, 4], [3, 4, 6, 4], [3, 8, 1, 8]] } },
  { name: 'THE BUFFET STILL LAYS OUT THE TRAYS', key: 'C sharp harmonic minor', root: 4, mode: HARM,
    story: 'an all-you-can-eat buffet off the Strip that still sets out its trays every evening, and the line that still forms for them',
    lead: { voice: 'accordion', gain: 0.047, oct: 0 }, leadName: 'an accordion, a polka at the end of the world',
    bass: 'jugbass', pad: 'warmpad',
    kit: { kick: { stem: '3-233151-A-2', ms: 220, gain: 1.95, lp: 400 }, snare: { stem: '5-263775-A-26', ms: 200, gain: 0.58 }, hat: { stem: '5-238492-A-23', ms: 60, gain: 1.27, hp: 3000 } },
    kitName: 'a grunt for the kick, a laugh from the line for the snare, a breath for the hat, oom-pah',
    chords: [0, 4, 4, 0], chordsB: [3, 0, 4, 0], groove: {
      1: { kick: [0, 8], hat: [0, 4, 8, 12] },   /* hat [4,12] under the accordion's eighths read 0.095 on the quarter */
      2: { kick: [0, 8], hat: [2, 4, 6, 10, 12, 14] },
      3: { kick: [0, 8], snare: [4, 12, 14], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },
    bassLine: { 1: [[0, 4], [8, 4]], 2: [[0, 2], [4, 2], [8, 2], [12, 2]], 3: [[0, 2], [2, 2], [4, 2], [8, 2], [10, 2], [12, 2]] },
    melody: {
      A: [[0, 0, 4, 2], [0, 2, 4, 2], [0, 4, 5, 2], [0, 6, 4, 2], [0, 8, 3, 2], [0, 10, 2, 2], [0, 12, 3, 4], [1, 0, 2, 2], [1, 2, 1, 2], [1, 4, 0, 4], [1, 8, -1, 4], [1, 12, 0, 4],
          [2, 0, 4, 2], [2, 2, 4, 2], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 7, 4], [2, 12, 6, 4], [3, 0, 5, 2], [3, 2, 4, 2], [3, 4, 3, 2], [3, 6, 2, 2], [3, 8, 0, 8]],
      B: [[0, 0, 2, 4], [0, 4, 3, 4], [0, 8, 4, 8], [1, 0, 5, 4], [1, 4, 6, 4], [1, 8, 7, 8],
          [2, 0, 8, 2], [2, 2, 7, 2], [2, 4, 6, 2], [2, 6, 5, 2], [2, 8, 4, 4], [2, 12, 3, 4], [3, 0, 6, 8], [3, 8, 4, 8]] } },
  { name: 'THE IMPERSONATOR DOES TWO SHOWS A NIGHT', key: 'E flat mixolydian', root: 6, mode: MIXO, swing: 0.3,
    story: 'a man in a white jumpsuit who still does both his shows in a showroom with the power out, to applause from the dark',
    lead: { voice: 'telecaster', gain: 0.18, oct: 0 }, leadName: 'a twangy electric guitar, the old rock and roll kind',
    bass: 'swaggerbass', pad: 'choir',
    kit: { kick: { stem: '1-51147-A-25', ms: 220, gain: 3.0, lp: 700 }, snare: { stem: '2-76408-C-22', ms: 200, gain: 1.4 }, hat: { stem: '5-207781-A-17', ms: 60, gain: 0.9, hp: 3000 } },
    kitName: 'a footstep for the kick, the audience clapping for the snare, a drink poured for the hat, swung',
    chords: [0, 6, 3, 0], chordsB: [5, 3, 6, 4], groove: {
      1: { kick: [0, 8], hat: [4, 12] },
      2: { kick: [0, 8, 10], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },
    bassLine: { 1: [[0, 6], [8, 6]], 2: [[0, 3], [4, 3], [8, 3], [12, 3]], 3: [[0, 2], [3, 1], [4, 2], [6, 2], [8, 2], [11, 1], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 4], [0, 4, 5, 2], [0, 6, 4, 2], [0, 8, 2, 4], [0, 12, 0, 4], [1, 0, 6, 4], [1, 4, 4, 2], [1, 6, 2, 2], [1, 8, 4, 8],
          [2, 0, 4, 4], [2, 4, 5, 2], [2, 6, 4, 2], [2, 8, 7, 4], [2, 12, 5, 4], [3, 0, 6, 2], [3, 2, 5, 2], [3, 4, 4, 4], [3, 8, 0, 8]],
      B: [[0, 0, 3, 4], [0, 4, 5, 4], [0, 8, 7, 8], [1, 0, 6, 4], [1, 4, 5, 4], [1, 8, 3, 8],
          [2, 0, 2, 4], [2, 4, 4, 4], [2, 8, 6, 4], [2, 12, 7, 4], [3, 0, 8, 6], [3, 6, 7, 2], [3, 8, 4, 8]] } },
  { name: 'THE HOSPITAL KEEPS ONE LIGHT ON', key: 'C minor (aeolian)', root: 3, mode: AEOLIAN,
    story: 'the hospital on Charleston with one window lit on the fourth floor every night, a monitor still beeping for someone',
    lead: { voice: 'celesta', gain: 0.22, oct: 1 }, leadName: 'a celesta, a lullaby on a ward',
    bass: 'lampbass', pad: 'mistchoir',
    kit: { kick: { stem: '3-94344-A-25', ms: 220, gain: 0.55, lp: 500 }, snare: { stem: '3-125418-A-24', ms: 200, gain: 0.85 }, hat: { stem: '3-166125-A-23', ms: 60, gain: 0.57, hp: 3000 } },
    kitName: 'a soft footstep for the kick, a cough on the ward for the snare, a ventilator\'s breath for the hat, the heartbeat',
    chords: [0, 5, 2, 6], chordsB: [3, 4, 0, 0], groove: {
      1: { kick: [0, 2], hat: [4, 8, 12] },
      2: { kick: [0, 2, 8, 10], hat: [4, 12] },
      3: { kick: [0, 2, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14] } },
    bassLine: { 1: [[0, 16]], 2: [[0, 2], [2, 2], [8, 2], [10, 2]], 3: [[0, 2], [2, 2], [6, 2], [8, 2], [10, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 4], [0, 4, 2, 4], [0, 8, 4, 4], [0, 12, 2, 4], [1, 0, 3, 4], [1, 4, 2, 4], [1, 8, 1, 8],
          [2, 0, 4, 4], [2, 4, 2, 4], [2, 8, 5, 4], [2, 12, 4, 4], [3, 0, 3, 4], [3, 4, 1, 4], [3, 8, 0, 8]],
      B: [[0, 0, 5, 4], [0, 4, 6, 4], [0, 8, 7, 8], [1, 0, 6, 4], [1, 4, 5, 4], [1, 8, 4, 8],
          [2, 0, 5, 2], [2, 2, 4, 2], [2, 4, 3, 2], [2, 6, 2, 2], [2, 8, 3, 4], [2, 12, 4, 4], [3, 0, 3, 8], [3, 8, 4, 8]] } }
];

/* THE CARDS (rule 488(c): each new song gets a VOTE card that plays it): the three-levels page (its own copy, naming the
   song and this list), the sha the commit on main that holds its recordings. A new song is in the game from this round
   (EVERYTHING IS A THUMB: he corrects after), so its card asks to keep it or take it out. */
const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
const idOf = S => 'sounds-more-song-' + slug(S.name).replace(/_/g, '-') + '-11-27';
const pageOf = S => 'BOHEMIA_MORE_SONG_' + slug(S.name).toUpperCase() + '_11_27_26.html';
function entry(S) {
  const M = JSON.parse(fs.readFileSync(path.join(OUTD, slug(S.name), 'measured.json'), 'utf8'));
  return { name: S.name, slug: slug(S.name), dir: 'vote/songs/more_songs/' + slug(S.name) + '/', id: idOf(S), levels_db: M.levels.map(x => x.audio.phone_rms_db),
    sub: 'A new song, ' + S.name + ': ' + S.story + '. Its own lead, ' + S.leadName + ', its own drums (' + S.kitName + '), in ' + S.key + '. It plays in the game now, in turn with the others.',
    what: { 1: '1. THE MAP: the song as it plays on the map, the tune on top, a soft 120 beat under it.',
            2: '2. THEIR TURN: tension. The tune stays, the chord is held, the kick on the beat, the bass pushing.',
            3: '3. YOUR TURN: everything, much louder: the tune doubled an octave, the full kit, the bass driving, a hit when the turn comes back to you.' } };
}
function register(which, write) {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8')), have = new Set(reg.items.map(x => x.id));
  const t = fs.readFileSync(F.TEMPLATE, 'utf8');
  for (const S of SONGS.filter(S => which === 'all' || slug(S.name) === which)) {
    const dir = path.join(OUTD, slug(S.name)); if (!fs.existsSync(path.join(dir, 'measured.json'))) { console.log('not recorded: ' + S.name); continue; }
    const page = t.replace('<meta name="song" content="">', '<meta name="song" content="' + slug(S.name) + '">').replace('<meta name="list" content="vote/songs/three_levels/index.json">', '<meta name="list" content="vote/songs/more_songs/index.json">')
      .replace('<title>Three Levels</title>', '<title>' + S.name.replace(/\b(\w)(\w*)/g, (m, a, b) => a + b.toLowerCase()) + '</title>');
    if (page === t || !page.includes('more_songs/index.json')) throw new Error('the template lost its metas');
    fs.writeFileSync(path.join(ROOT, 'slices', pageOf(S)), page);
    /* the sha: the commit that holds its recordings, on the branch that goes to main in the same push (a rebase before the
       push moves it, so a re-run puts the new one on the card) */
    const sha = execFileSync('git', ['log', '-1', '--format=%h', process.env.REF || 'HEAD', '--', path.join('slices', 'vote', 'songs', 'more_songs', slug(S.name))], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!sha && write) throw new Error(S.name + ': commit the recordings first');
    if (have.has(idOf(S))) { const it = reg.items.find(x => x.id === idOf(S));
      if (write && it.sha !== sha) { console.log('the card\'s sha moved: ' + it.sha + ' -> ' + sha); it.sha = sha; } else console.log('already a card: ' + idOf(S)); continue; }
    const card = { id: idOf(S), kind: 'song', lane: 'sounds', sha: sha || 'unpushed', made: '11/27', title: 'A NEW SONG: ' + S.name,
      why: 'You asked for more songs made the same way as the four you liked. This is one of twelve: ' + S.name + ', ' + S.leadName + ' for the lead, ' + S.kitName + ', in ' + S.key + ', a tune you can hum, at the three levels of a fight on the 120 beat. It already plays in the game, in turn with the others. ' +
        'Tap 1, 2, 3 and then A FIGHT, and you hear it on this card in the VOTE tab, the turns changing on the bar.',
      options: ['A, keep it in the game', 'B, take it out'], show: { how: 'page', src: pageOf(S) }, draft: true };
    if (write) { reg.items.push(card); have.add(card.id); }
    console.log((write ? 'REGISTERED ' : 'would register ') + card.id + ' at ' + card.sha);
  }
  if (write) fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
  writeIndex();
}
/* the list the cards and the game's book read: every song recorded here */
function writeIndex() {
  const songs = SONGS.filter(S => fs.existsSync(path.join(OUTD, slug(S.name), 'measured.json'))).map(entry);
  fs.writeFileSync(path.join(OUTD, 'index.json'), JSON.stringify({ made: '11/27', rule: 488, tool: 'tools/bohemia_sounds_more_songs.js', songs }, null, 1) + '\n');
  console.log('the list: ' + songs.length + ' songs');
}

if (require.main === module) {
  const [cmd, arg, flag] = process.argv.slice(2);
  if (cmd === 'record') F.record(arg || 'all', { songs: SONGS, outd: OUTD, made: '11/27', remade: null, tool: 'tools/bohemia_sounds_more_songs.js', balance: BALANCE, kbps: 64 })
    .then(writeIndex).catch(e => { console.error(e); process.exit(1); });
  else if (cmd === 'register') register(arg || 'all', flag === '--write');
  else if (cmd === 'index') writeIndex();
  else { console.log('usage: record [slug|all] | register [slug|all] [--write] | index'); process.exit(2); }
}
module.exports = { SONGS, slug, idOf, pageOf, OUTD, BALANCE };
