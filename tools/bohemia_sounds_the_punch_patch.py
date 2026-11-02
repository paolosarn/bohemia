#!/usr/bin/env python3
"""
BOHEMIA - THE PUNCH HEARD, INTO THE GAME (SOUNDS 11/3/26, ask line 266). A sound effect, not music: it goes straight in
(rule 181(c)) and is registered in the VOTE tab for him to hear on its own.

WHAT THIS PATCH DOES, every change the one line where an event asks for its sound (rule: SOUNDS adds sound files and the hooks
that play them, nothing else):
  ALPHA (the demo is cut from it):
    1. __THE_PUNCH_HEARD__: engine/bohemia_punch_heard.js inlined verbatim (the gate holds it byte for byte) and its glue: one
       player (window.PUNCH) on the effects bus (window.__sfxOut), its 300 KB sprite loading 6 s after the music first runs
       (the door is long past) or the moment a fight comes up.
    2. The one line where BOHEMIA_SFX reaches the shell: DEATH first (unchanged), then PUNCH, then the bullets, then playSFX.
  FIGHT (slices/BOHEMIA_FIGHT.html, the sound block this lane wrote, rule 54b, and the lines that call it):
    a machine's step is steel and servo (a man's keeps the fight's own: his DOWN on REAL SHOES IN THE FIGHT, 10/18); the swing
    says who; a blow and a miss say they
    were a blow and what kind, and whether the man struck is a machine; the body landing on COMBAT's thud asks for its sound
    on the fall's last key; a machine going down says so; the reload says which gun (the real reloads of [the guns heard],
    BULLET's, were never asked for by name).
  MAP (slices/BOHEMIA_CITY_WORLD.html, slices/bohemia_his_map.js): WORLD's three moments (camp made, camp broken and the hours
    rolled, they come), the road card, the boss found each post one BOHEMIA_SFX to the shell.
  PHONE (slices/bohemia_phone.js): a press, a page opening, a page closing.

Idempotent: every insert checks for its own result.  python3 tools/bohemia_sounds_the_punch_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
ALPHA, FIGHT, CITY, HISMAP, PHONE = P('slices', 'BOHEMIA_ALPHA_0_9.html'), P('slices', 'BOHEMIA_FIGHT.html'), P('slices', 'BOHEMIA_CITY_WORLD.html'), P('slices', 'bohemia_his_map.js'), P('slices', 'bohemia_phone.js')
ENGINE = P('engine', 'bohemia_punch_heard.js')
START = '<!-- __THE_PUNCH_HEARD__ (SOUNDS 11/3, ask 266) -->\n<script>\n'
END = '</script>\n<!-- /__THE_PUNCH_HEARD__ -->\n'
ANCHOR = '</script>\n<!-- /__DEATH_SOUNDS__ -->\n'

GLUE = r"""/* ---- __THE_PUNCH_HEARD__: the glue (tools/bohemia_sounds_the_punch_patch.py) ---- */
(function () {
  if (!window.BOH_PUNCH) return;
  var P = window.PUNCH = BOH_PUNCH.make({
    dir: 'fight_punch/',
    out: function () { return window.__sfxOut ? window.__sfxOut() : null; }
  });
  addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || !d.type) return;
    try { if (d.type === 'BOHEMIA_COMBAT_STARTED' && !P.ready()) P.load(); } catch (_e) {}
  });
  /* the sprite (300 KB) loads 6 s after the music first runs, or the moment a fight comes up. Until it is in, every event
     plays exactly what it played before. */
  var since = 0, iv = setInterval(function () {
    try {
      if (P.ready() || P.loading) { clearInterval(iv); return; }
      if (typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running') { since = since || Date.now(); if (Date.now() - since > 6000) { P.load(); clearInterval(iv); } }
    } catch (_e) {}
  }, 1000);
})();
"""

RECV_OLD = "        var _bl=null; if(_dh==='done') _bl='done'; else { try{ _bl = window.BULLET ? BULLET.heard(d) : null; }catch(_e){ _bl=null; } }\n"
RECV_NEW = ("        /* __THE_PUNCH_HEARD__ (SOUNDS 11/3, ask 266): a blow, its swing and its miss, a fall, the robot, the map's moments and the phone, from real recordings, before the bullets */\n"
            "        var _bl=null; if(_dh==='done') _bl='done'; else { try{ _bl = window.PUNCH ? PUNCH.heard(d) : null; }catch(_e){ _bl=null; } if(_bl!=='done'){ try{ _bl = window.BULLET ? BULLET.heard(d) : null; }catch(_e){ _bl=null; } } }\n")

SND_NEW_HEAD = "  /* THE PUNCH HEARD (SOUNDS 11/3, ask 266): a machine's step is steel and servo; who swung */\n"
FIGHT_EDITS = [
    ("  step: function () { tone(70, 0.05, 0.05, 'triangle'); },\n  swing: function () { sfx('swing_air'); },\n",
     SND_NEW_HEAD + "  step: function () { tone(70, 0.05, 0.05, 'triangle'); },\n"
     "  metal: function (u) { if (u && u.machine) sfx('fight_step', { side: u.side, machine: true }); },   /* a man's step stays this one (his DOWN on REAL SHOES IN THE FIGHT, 10/18) */\n"
     "  swing: function (u) { sfx('swing_air', u ? { side: u.side, machine: !!u.machine } : undefined); },\n"
     "  /* a blow is a blow (melee), its kind (blunt or blade, SND.death's rule) and whether it landed on steel */\n"
     "  blow: function (u, t) { const w = u && u.weapon, c = w && ((w.of && w.of.class) || w.class);\n"
     "    return { melee: true, side: u ? u.side : null, target_machine: !!(t && t.machine),\n"
     "      blow: ['mace', 'hammer', 'flail', 'natural', 'throwing'].indexOf(c) >= 0 || !c ? 'blunt' : ['dagger', 'spear', 'polearm'].indexOf(c) >= 0 ? 'piercing' : 'cutting' }; },\n"
     "  /* the body lands on the fall's last key: COMBAT's thud (thudAt), heard where it is seen */\n"
     "  thud: function (u, at, B) { const k = DB.rig.keys_per_beat; setTimeout(function () { sfx('body_land', { side: u.side, machine: !!u.machine }); }, Math.max(0, at + B * (k - 1) / k - SONG.lat - performance.now())); },\n",
     "  thud: function (u, at, B) {"),
    ("  resolve: function (ranged, head, hurtsYou, f) {\n    if (hurtsYou) { sfx('hurt', f); return; }\n",
     "  resolve: function (ranged, head, hurtsYou, f, u, t) {\n    if (!ranged && u) f = Object.assign(SND.blow(u, t), f || {});   /* THE PUNCH HEARD: a blow says so */\n    if (hurtsYou) { sfx('hurt', f); return; }\n",
     "resolve: function (ranged, head, hurtsYou, f, u, t) {"),
    ("  miss: function (f) { sfx('miss', f); },\n",
     "  miss: function (f, u) { sfx('miss', f || (u ? SND.blow(u, null) : undefined)); },\n", "miss: function (f, u) {"),
    ("  if (a.k === 'step') { SND.step();", "  if (a.k === 'step') { SND.step(); SND.metal(FIGHT.byId(e.id));", "SND.metal(FIGHT.byId(e.id));"),
    ("SND.swing(); }, sd(B * 0.35));", "SND.swing(u); }, sd(B * 0.35));", "SND.swing(u); }, sd(B * 0.35));"),
    ("SND.resolve(ranged, !!e.head, t.side === 'you', bf) : SND.miss(bf);", "SND.resolve(ranged, !!e.head, t.side === 'you', bf, u, t) : SND.miss(bf, ranged ? null : u);", "bf, u, t) : SND.miss(bf, ranged ? null : u);"),
    ("SND.resolve(ranged, !!o.head, ot.side === 'you', bf) : SND.miss(bf);", "SND.resolve(ranged, !!o.head, ot.side === 'you', bf, u, ot) : SND.miss(bf, ranged ? null : u);", "bf, u, ot) : SND.miss(bf, ranged ? null : u);"),
    ("      if (u.side === 'you' || u._seen) thudAt(a.at, B);", "      if (u.side === 'you' || u._seen) { thudAt(a.at, B); SND.thud(u, a.at, B); }", "{ thudAt(a.at, B); SND.thud(u, a.at, B); }"),
    ("SND.fall(true, { side: u.side }); say('The mechanic", "SND.fall(true, { side: u.side, victim: 'machine' }); say('The mechanic", "victim: 'machine' }); say('The mechanic"),
    ("if (e.t === 'down') { SND.fall(false, { side: u.side });", "if (e.t === 'down') { SND.fall(false, { side: u.side, victim: u.machine ? 'machine' : undefined });", "SND.fall(false, { side: u.side, victim: u.machine ? 'machine' : undefined });"),
    ("if (e.t === 'reload' && u) { sfx('mag_home');", "if (e.t === 'reload' && u) { sfx('mag_home', { gun: u.job, side: u.side });", "sfx('mag_home', { gun: u.job, side: u.side });"),
]

POST = "try { if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'BOHEMIA_SFX', ev: %s }, '*'); } catch (_e) {}"
CITY_EDITS = [
    ("  BETWEEN.log.push({ kind: kind, at: Math.round(m.t0), dur: dur, fromCamp: !!m.o.fromCamp });\n",
     "  BETWEEN.log.push({ kind: kind, at: Math.round(m.t0), dur: dur, fromCamp: !!m.o.fromCamp });\n"
     "  " + POST % "({ campIn: 'camp_make', campOut: 'camp_break', come: 'they_come' })[kind] || 'none'" + "   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): the moment heard */\n",
     "campIn: 'camp_make', campOut: 'camp_break'"),
    ("  try{ roadCardSeen(); }catch(_e){}", "  " + POST % "'road_stop'" + "   /* __THE_PUNCH_HEARD__: the road stops you */\n  try{ roadCardSeen(); }catch(_e){}", "ev: 'road_stop'"),
]
HISMAP_EDITS = [
    ("    try { root.dispatchEvent(new CustomEvent('bohemia:boss-found'",
     "    try { if (root.parent && root.parent !== root) root.parent.postMessage({ type: 'BOHEMIA_SFX', ev: 'boss_found' }, '*'); } catch (e) {}   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): the boss is marked */\n"
     "    try { root.dispatchEvent(new CustomEvent('bohemia:boss-found'", "ev: 'boss_found'"),
]
SELF = "try { window.postMessage({ type: 'BOHEMIA_SFX', ev: '%s' }, '*'); } catch (_e) {}"
PHONE_EDITS = [
    ("    H.presses++; window.__PHONE_PRESSES = H.presses;\n",
     "    H.presses++; window.__PHONE_PRESSES = H.presses;\n    " + SELF % 'phone_tap' + "   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): rule 301, a gear tooth and a click */\n", "ev: 'phone_tap'"),
    ("  function pageOpen(which) {\n",
     "  function pageOpen(which) {\n    if (!H.page) " + SELF % 'phone_open' + "   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): gears and a rubber band */\n", "ev: 'phone_open'"),
    ("  function pageClose() { var pg = H.el.querySelector('.page');",
     "  function pageClose() { var pg = H.el.querySelector('.page'); if (H.page) " + SELF % 'phone_close', "ev: 'phone_close'"),
]


def die(msg):
    print('THE PUNCH PATCH: ' + msg); sys.exit(1)


def apply(path, edits):
    s = open(path, encoding='utf-8').read(); n = 0
    for old, new, mark in edits:
        if mark in s: continue
        if s.count(old) != 1: die('%s: anchor found %d times: %s' % (os.path.basename(path), s.count(old), old[:90]))
        s = s.replace(old, new); n += 1
    open(path, 'w', encoding='utf-8').write(s)
    return n


def main():
    eng = open(ENGINE, encoding='utf-8').read()
    s = open(ALPHA, encoding='utf-8').read()
    block = START + '/* ==== inlined verbatim from engine/bohemia_punch_heard.js (the gate holds it byte for byte) ==== */\n' + eng + GLUE + END
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END); s = s[:a] + block + s[b:]
    else:
        if s.count(ANCHOR) != 1: die('the death sounds block is not in the alpha once')
        s = s.replace(ANCHOR, ANCHOR + block)
    if RECV_NEW not in s:
        if s.count(RECV_OLD) != 1: die('the BOHEMIA_SFX line is not in the alpha once')
        s = s.replace(RECV_OLD, RECV_NEW)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('alpha: block + receiver; fight %d, map %d, his map %d, phone %d edits' % (
        apply(FIGHT, FIGHT_EDITS), apply(CITY, CITY_EDITS), apply(HISMAP, HISMAP_EDITS), apply(PHONE, PHONE_EDITS)))


if __name__ == '__main__':
    main()
