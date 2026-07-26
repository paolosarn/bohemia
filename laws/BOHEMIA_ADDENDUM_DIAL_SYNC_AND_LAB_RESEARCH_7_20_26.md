# BOHEMIA ADDENDUM — DIAL SYNC RESEARCH + BEAT TACTICS LAB ROUND 3 (7/20/26)

Paolo's mandate this turn: "find the most consistent layer across all songs
and sync the deadshot dial to that... do online big brain research to find
what we could be doing better... do some more beat tactics lab research, I
want to see what you come up with."

## PART 1 — WHY THE DIAL FELT OFF (research + fix, SHIPPED)

The music sweep (records/BOHEMIA_COMBAT_MUSIC_SYNC_ANALYSIS_7_20_26.txt):
the KICK is the one layer every combat song shares; its anchors are beats
1 and 3. The dial was pulsing on the bare 120 grid — every beat equal,
nothing tied to what the ear actually hears. Two shipped fixes:

- **KICK-LOCK (v24)**: dial ember + rim flash ride the current song's
  real kick pattern.
- **EAR-LOCK (v25)**: the rhythm-game literature is unanimous that
  AUDIO LATENCY is the feel-killer — audio output lags the game clock,
  worst on phones, different on every device (NecroDancer ships an
  auto-sync; Rhythm Quest's devlog splits audio/visual/input latency and
  calls audio the largest). The pulse clock now compensates by the
  device's measured AudioContext outputLatency automatically.

What the literature says we could STILL do better (not built, pending):
1. **Tap-to-calibrate** (NecroDancer's approach): press on the beat 8
   times, store the personal offset. Needed for bluetooth speakers that
   do not report their latency. Cheap build, settings drawer.
2. **Judge by scheduled-audio time, not frame time**, everywhere a
   timing window is scored — the dial's zones judge needle POSITION (not
   tap timing) so we are naturally protected, but any future tap-on-beat
   mechanic MUST judge against the audio clock.
3. **Never punish the eye for the ear** (Hi-Fi Rush lesson): quantize
   RESULTS to the beat, never gate INPUTS — already our shipped law.

## PART 2 — BEAT TACTICS LAB ROUND 3 (pitched, build on thumbs)

Research pass over the current tactics canon (Shogun Showdown's
sequencing praise, Hoplite's movement ballet, Into the Breach's perfect
information — sources in the session reply). Four NEW lab modes pitched
for the BEAT TACTICS LAB, none built until Paolo thumbs:

- **E. THE QUEUE** (Shogun Showdown, third time it has surfaced —
  strongest candidate): you LOAD actions (shot, shove, step) into a
  visible queue over 2-3 beats, then the bar EXECUTES them in order
  while enemies act between. Greed made spatial: a longer queue is a
  longer time you cannot react.
- **F. THE PHRASE** (rhythm idea 3 made playable): the fight breathes in
  4-beat bars — enemies commit on beats 1-3, EVERYTHING resolves on
  beat 4 (the volley beat, on the kick). Teaches the music structurally.
- **G. THE BREAK** (rhythm idea 4 made playable): kill streaks bank
  GROOVE; cash it to drop the song to half-time for one bar — the
  time-dilation bar, earned, on the beat.
- **H. THE METRONOME DUEL**: 1v1 standoff where the dial's kick-locked
  pulse IS the tell — the enemy fires on kicks; your safe pops live in
  the off-beats. A pure test of whether KICK-LOCK teaches timing.

My pick if told "you pick": E first (it keeps winning research rounds),
then F (it makes the music the turn structure, the most Bohemia-native).

## RULINGS CARRIED
- Vital = 2-turn stun, NEVER a second shot; only a killshot chains (v24, LOCKED by Paolo's message).
- No double exposure: positional exposure kills the pop-out option (v24).
- Movement vs guns is LINE OF SIGHT: only breaking the line resets an
  acquisition clock; walking in the open keeps you tracked (v24,
  supersedes v22's blanket move-reset).
