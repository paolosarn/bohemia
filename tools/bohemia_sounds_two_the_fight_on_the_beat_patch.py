#!/usr/bin/env python3
"""
BOHEMIA - THE FIGHT ON THE BEAT, AS HE HEARS IT (SOUNDS TWO, 11/7/26, rule 427(a); asks 47 and 212).

PAOLO, for months: 'every action lands on the beat at 120 BPM, by hand and on AUTO'; 'one pace for every turn, no speeding
up and slowing down'. MEASURED OFF THE AUDIO in the demo (tools/bohemia_sounds_two_the_fight_heard.js, a road fight on AUTO,
the computer): 23 of 86 blows were HEARD 123 to 130 ms after their beat, a whole sixteenth late; and between two motions of
one side the fight waited one beat or two at random, the same two attacks back to back 1.00 beats apart one time and 2.00
the next. Two causes in the fight's clock, both measured:

  1. THE COIN FLIP BETWEEN TWO MOTIONS. The next motion's beat is the first point of the song's grid at or after the last
     motion's end (songGrid: ceil with a tolerance of 0.0005 ms). The grid's anchor, SONG.at, is re-read from the one beat
     five times a second and moves by a tenth of a millisecond each read (measured: -0.11 to +0.08 ms over 70 motions).
     When it moved earlier by any fraction of a millisecond, a motion that ends exactly on a beat 'ended after it', and the
     next one waited a whole beat more. FIX: a motion chained to the one before (its ask is that motion's end) takes the
     grid point within GRID_SNAP_MS (8 ms, never more than an eighth of its grid) before it; a fresh tap is untouched (it
     still begins on the next beat, never the frame of the tap: rule 158(a)).
  2. THE SOUND ASKED FOR AT THE LAST MOMENT, WITH NO MOMENT ON IT. The fight's timers send a sound the way to the ear
     (SONG.lat) ahead of its picture and say nothing of when it should be heard, so the shell's one beat books it 'now' if it
     comes within 12 ms after a sixteenth and on the NEXT sixteenth if later: a timer or a frame 13 ms late put the blow 125
     ms after its beat. FIX: every sound the fight sends while a motion plays carries `at`, the moment it is meant to be
     heard (the shell's one beat books exactly that, on its grid point within 20 ms); and the sounds on a motion's own timers
     (the shot, the landing, a sweep's others, the dry click, a net, a door) are sent SFX_LEAD (80 ms) earlier, so the shell
     has them in hand before their beat and books them to the sample; on a slow device the lead is three of its frames, up to
     300 ms (MEASURED on his phone's profile at 4x: with 80 ms, 46 of 87 blows still came to the shell 100 to 270 ms after their
     beat). Only the SOUND goes early: what the strip says at the landing, the crew's call, the ladder's hit and the dry click's
     blink keep their own moment (onTime), and every picture keeps its own clock (goreHit, punchLand, the dodge read a.at). The moment
     is the song's nearest sixteenth (heardOn16): the shell put an early sound on its next sixteenth, so a gun's shot, a tenth
     of a beat before its landing, sounded on the beat with it; that stays, exact.
     MEASURED ON HIS PHONE'S PROFILE AT 4x: the shell's audio clock lags in big render blocks, so a sound that came on time
     read 134 to 200 ms 'early' and was put a whole sixteenth BEFORE its beat (60 of 62 blows); `at` is read through the
     output timestamp, not the lagging clock, so it lands where it is meant to.

Idempotent (a marked block; a re-run replaces nothing it already did). python3 tools/bohemia_sounds_two_the_fight_on_the_beat_patch.py
Gate: gates/the_fight_as_he_hears_it_gate.js (off the audio); COMBAT's gates/every_action_on_the_beat_gate.js reads the lead.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIGHT = os.path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html')
MARK = '__SOUNDS_TWO_ON_THE_BEAT__'


def die(m):
    print('THE FIGHT ON THE BEAT PATCH: ' + m)
    sys.exit(1)


def once(s, old, new, what):
    n = s.count(old)
    if n != 1:
        die(what + ': found %d times' % n)
    return s.replace(old, new)


def main():
    s = open(FIGHT, encoding='utf-8').read()
    if MARK in s:
        print('THE FIGHT ON THE BEAT PATCH: already in (' + MARK + ')')
        return
    # 0. the two numbers, beside the song's grid
    s = once(s, "function songGrid(t, g) { return SONG.at + Math.ceil((t - SONG.at) / g - 1e-6) * g; }",
             "function songGrid(t, g) { return SONG.at + Math.ceil((t - SONG.at) / g - 1e-6) * g; }\n"
             "/* " + MARK + " (SOUNDS TWO 11/7, rule 427(a), asks 47 and 212; tools/bohemia_sounds_two_the_fight_on_the_beat_patch.py):\n"
             "   GRID_SNAP_MS: a motion chained to the one before takes the grid point this close before its ask, so the anchor's tenth of a\n"
             "   millisecond of jitter never costs a whole beat (measured: two attacks back to back 1 beat apart, then 2, at random);\n"
             "   SFX_LEAD: a motion's timed sounds go this much before the way to the ear, carrying the moment they are heard (`at`), so the\n"
             "   shell books them on the beat to the sample (measured: 23 of 86 blows heard a whole sixteenth late) */\n"
             "const GRID_SNAP_MS = 8, SFX_LEAD = 80, SFX_LEAD_MAX = 300;   /* the lead grows to three of the device's frames on a slow one */\n"
             "/* the moment a sound is heard, on the song's nearest sixteenth (the shell used to put a sound that came early on the next\n"
             "   sixteenth, so a shot a tenth of a beat before its landing sounded on the beat with it: that stays, now to the sample) */\n"
             "function heardOn16(t) { const q = songBeat() / 4; return SONG.at + Math.round((t - SONG.at) / q) * q; }\n"
             "/* the facts a sound goes with, its moment on them; a gun's facts carried the target's tile as `at` ({x, y}), read by nothing\n"
             "   in the shell, and it clobbered the moment: the tile rides as `tile` */\n"
             "function heardFacts(facts) { const f = Object.assign({}, facts || {}); if (f.at && typeof f.at === 'object') { f.tile = f.at; delete f.at; }\n"
             "  if (UI.sfxAt != null && typeof f.at !== 'number') f.at = performance.timeOrigin + heardOn16(UI.sfxAt); return f; }", 'songGrid')
    # 1. the chained motion snaps to its grid point
    s = once(s, "a.qAt = g ? songGrid(from + land, g) - land : from; a.g = g;",
             "a.qAt = g ? songGrid(from + land - (from === UI.animEnd ? Math.min(GRID_SNAP_MS, g / 8) : 0), g) - land : from; a.g = g;   /* " + MARK + " */",
             'onTheBeat qAt')
    # 2a. every sound sent while a motion plays carries the moment it is heard
    s = once(s, "try { if (window.parent && window.parent !== window) window.parent.postMessage(Object.assign({ type: 'BOHEMIA_SFX', ev: ev }, facts || {}), '*'); } catch (_e) {} }",
             "try { if (window.parent && window.parent !== window) window.parent.postMessage(Object.assign({ type: 'BOHEMIA_SFX', ev: ev }, heardFacts(facts)), '*'); } catch (_e) {} }   /* " + MARK + ": `at`, when he hears it */",
             'sfx post')
    # 2b. startAnim runs with its moment set (its own sounds are heard at a.at)
    s = once(s, "function startAnim(a) {\n",
             "function startAnim(a) { const at0 = UI.sfxAt; UI.sfxAt = a.at === undefined ? performance.now() : a.at; try { return startAnimHeard(a); } finally { UI.sfxAt = at0; } }   /* " + MARK + " */\n"
             "function startAnimHeard(a) {\n", 'startAnim')
    i0 = s.index("function startAnimHeard(a) {\n")
    i1 = s.index("\n}\n", i0)
    body = s[i0:i1]
    n0 = body.count('setTimeout(function () {')
    body = body.replace('setTimeout(function () {', 'later(function () {')
    out, k, n1 = [], 0, 0
    while True:
        j = body.find('}, sd(', k)
        if j < 0:
            out.append(body[k:])
            break
        out.append(body[k:j] + '}, ')
        p, depth = j + len('}, sd('), 1
        q = p
        while depth:
            c = body[q]
            depth += (c == '(') - (c == ')')
            q += 1
        out.append(body[p:q - 1])
        k = q
        n1 += 1
    body = ''.join(out)
    if n0 != 7 or n1 != 7:
        die('startAnim: %d timers and %d sd() closings (7 and 7 measured on 11/7)' % (n0, n1))
    s = s[:i0] + body + s[i1:]
    # 2c. the motion's own timers: SFX_LEAD early, each with its moment
    s = once(s, "const D = a.at - SONG.lat - performance.now(), sd = function (ms) { return Math.max(0, ms + D); };",
             "const D = a.at - SONG.lat - performance.now(), LEAD = Math.min(SFX_LEAD_MAX, Math.max(SFX_LEAD, 3 * (UI.frameMs || 0))), sd = function (ms) { return Math.max(0, ms + D - LEAD); },   /* " + MARK + " */\n"
             "    later = function (fn, ms) { return setTimeout(function () { const p = UI.sfxAt; UI.sfxAt = a.at + ms; try { fn(); } finally { UI.sfxAt = p; } }, sd(ms)); },\n"
             "    onTime = function (fn, ms) { return setTimeout(fn, Math.max(0, ms + D)); };   /* what is SEEN or SAID at the landing keeps its moment */",
             'startAnim sd')
    s = once(s, "(UI.landDue = UI.landDue || []).push({ due: performance.now() + sd(B * 0.45), land: a.at + B * 0.45, lat: SONG.lat });",
             "(UI.landDue = UI.landDue || []).push({ due: performance.now() + sd(B * 0.45), land: a.at + B * 0.45, lat: SONG.lat, lead: LEAD });",
             'landDue')
    # the landing: its sound goes ahead with its moment; the hit on his man for the ladder, the strip's words and the crew's call
    # stay at the landing
    s = once(s, "later(function () { const bf = ranged ? bullet('lands', u, t, e) : undefined; e.hit ? SND.resolve(ranged, !!e.head, t.side === 'you', bf, u, t) : SND.miss(bf, ranged ? null : u); if (e.hit && t.side === 'you') MUSIC.hit(t, e);",
             "later(function () { const bf = ranged ? bullet('lands', u, t, e) : undefined; e.hit ? SND.resolve(ranged, !!e.head, t.side === 'you', bf, u, t) : SND.miss(bf, ranged ? null : u); }, B * 0.45);\n"
             "    onTime(function () { if (e.hit && t.side === 'you') MUSIC.hit(t, e);", 'landing split')
    s = once(s, "later(function () { sfx('dry_fire'); UI.dryAt = performance.now(); teach('reload'); }, B * 0.8);",
             "later(function () { sfx('dry_fire'); }, B * 0.8); onTime(function () { UI.dryAt = performance.now(); teach('reload'); }, B * 0.8);",
             'dry fire split')
    open(FIGHT, 'w', encoding='utf-8').write(s)
    print('THE FIGHT ON THE BEAT PATCH: in (the chained grid point; every motion sound with its moment; its timed sounds sent ahead)')


if __name__ == '__main__':
    main()
