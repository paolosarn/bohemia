#!/usr/bin/env python3
"""
BOHEMIA - DEATH SOUNDS THAT TERRIFY, INTO THE GAME (SOUNDS 10/26/26, row [death sounds that terrify], rule 235; a sound
effect, not music, so it goes straight in (rule 181(c)) and is registered in the VOTE tab for him to hear on its own).

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __DEATH_SOUNDS__: engine/bohemia_death_sounds.js inlined verbatim (the gate holds it byte for byte), and the glue: one
     player (window.DEATH) on the effects bus (window.__sfxOut, so the EFFECTS slider, his mix and the one beat's 16th hold),
     loading its sprite late (30 s after the music first runs, or the moment a fight starts: never before the door).
  2. The one line where the fight's BOHEMIA_SFX reaches the shell: DEATH hears it first; a death it plays stands the old
     fall and the bullet's man-going-down down; everything else goes on to the bullets and playSFX untouched.
AND IN THE FIGHT (slices/BOHEMIA_FIGHT.html, the sound block this lane wrote, rule 54b): SND.death(u, e) says how a man died
(the killing weapon's class and blow, a gun, a beast's bite, the plate that gave, the small blow that finished him, the head,
a beast's own death); startAnim keeps the last blow that landed on a man; the dead note and a skipped turn send the facts.

Idempotent: every insert sits between markers or checks for its own result.
  python3 tools/bohemia_death_sounds_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
FIGHT = os.path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html')
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_death_sounds.js')
START = '<!-- __DEATH_SOUNDS__ (SOUNDS 10/26, rule 235) -->\n<script>\n'
END = '</script>\n<!-- /__DEATH_SOUNDS__ -->\n'
ANCHOR = '</script>\n<!-- /__THE_BULLET_LANDS__ -->\n'

GLUE = r"""/* ---- __DEATH_SOUNDS__: the glue (tools/bohemia_death_sounds_patch.py) ---- */
(function () {
  if (!window.BOH_DEATH) return;
  var D = window.DEATH = BOH_DEATH.make({
    dir: 'fight_death/',
    out: function () { return window.__sfxOut ? window.__sfxOut() : null; }
  });
  addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || !d.type) return;
    try { if (d.type === 'BOHEMIA_COMBAT_STARTED' && !D.ready()) D.load(); } catch (_e) {}
  });
  /* the sprite (0.8 MB) loads late: 30 s after the music first runs, or the moment a fight comes up, whichever is first.
     Until it is in, a death plays exactly what it played before. */
  var since = 0, iv = setInterval(function () {
    try {
      if (D.ready() || D.loading) { clearInterval(iv); return; }
      if (typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running') { since = since || Date.now(); if (Date.now() - since > 30000) { D.load(); clearInterval(iv); } }
    } catch (_e) {}
  }, 1000);
})();
"""

RECV_OLD = "        var _bl=null; try{ _bl = window.BULLET ? BULLET.heard(d) : null; }catch(_e){ _bl=null; }\n"
RECV_NEW = ("        /* __DEATH_SOUNDS__ (SOUNDS 10/26, rule 235): a death plays its kind first, and stands the old fall down */\n"
            "        var _dh=null; try{ _dh = window.DEATH ? DEATH.heard(d) : null; }catch(_e){ _dh=null; }\n"
            "        var _bl=null; if(_dh==='done') _bl='done'; else { try{ _bl = window.BULLET ? BULLET.heard(d) : null; }catch(_e){ _bl=null; } }\n")

FIGHT_EDITS = [
    ("""  fall: function (dead, f) { sfx(dead ? 'kill' : 'went_down', f); },
  flee: function () { tone(220, 0.15, 0.06, 'triangle'); tone(196, 0.3, 0.05, 'triangle'); }
};""", """  fall: function (dead, f) { sfx(dead ? 'kill' : 'went_down', f); },
  flee: function () { tone(220, 0.15, 0.06, 'triangle'); tone(196, 0.3, 0.05, 'triangle'); },
  /* DEATH SOUNDS THAT TERRIFY (SOUNDS [death sounds that terrify], rule 235(b): 'the killing weapon picks the kind'): how he
     died, for the shell's death player (engine/bohemia_death_sounds.js). u is the dead man, e the fight's 'dead' note (e.by:
     who killed him); u._blow is the last blow that landed on him (startAnim keeps it). Nothing here changes the fight. */
  death: function (u, e) {
    const f = { side: u.side }, a = e && e.by ? FIGHT.byId(e.by) : null, w = a && a.weapon, b = u._blow || {};
    if (u.machine || u.ghost) f.victim = u.machine ? 'machine' : 'ghost';
    if (u.beast || /wolf|hyena|dog|hound|unhold|lindwurm|schrat|kraken|ghoul|nachzehrer|serpent|spider|webknecht/.test(u.kind || '')) f.beast = u.kind || u.beast;
    if (w) {
      const c = (w.of && w.of.class) || w.class, nm = String(w.name || w.id || '');
      f.weapon = c;
      f.gun = !!(FIGHT.isGun(w) || c === 'bow' || c === 'crossbow' || c === 'firearm');
      if (c === 'natural') { f.blow = 'natural'; f.by_beast = !!a.beast || /bite|claw|gore|gorge|tail|fang/i.test(nm); }
      else if (['mace', 'hammer', 'flail'].indexOf(c) >= 0 || (c === 'throwing' && !/axe|knife|javelin|spear/i.test(nm))) f.blow = 'blunt';
      else f.blow = ['dagger', 'spear', 'polearm', 'bow', 'crossbow', 'firearm'].indexOf(c) >= 0 ? 'piercing' : 'cutting';
    }
    if (b.armour > 0 && (b.head ? u.armH : u.armB) <= 0 && (b.head ? u.armHMax : u.armBMax) >= 100) f.armour_gave = true;   /* real plate (mail and up, 100 or more) broke on the blow that killed */
    if (b.hp > 0 && u.hpMax && b.hp < 0.2 * u.hpMax) f.finish = true;            /* a small blow finished a man already going */
    if (u.headGone || b.head) f.head = true;
    (UI.deaths = UI.deaths || []).push(f); if (UI.deaths.length > 80) UI.deaths.shift();   /* what each death told the shell, for the gate */
    return f;
  }
};""", "  death: function (u, e) {"),
    ("""    const u = FIGHT.byId(e.id), t = FIGHT.byId(e.to);
    const ranged = e.shot === undefined ? FIGHT.isRanged(u.weapon) : e.shot;   /* the arm that struck: a gun's is always its shot (rule 195) */
""", """    const u = FIGHT.byId(e.id), t = FIGHT.byId(e.to);
    const ranged = e.shot === undefined ? FIGHT.isRanged(u.weapon) : e.shot;   /* the arm that struck: a gun's is always its shot (rule 195) */
    if (e.hit && t) t._blow = { hp: e.hp | 0, armour: e.armour | 0, head: !!e.head };   /* SND.death reads the blow that killed (rule 235) */
""", "SND.death reads the blow that killed (rule 235)"),
    ("""    else if (e.t === 'dead') { SND.fall(true, { side: u.side }); u.seenFall = true;""",
     """    else if (e.t === 'dead') { SND.fall(true, SND.death(u, e)); u.seenFall = true;""", "SND.fall(true, SND.death(u, e))"),
    ("""  skipped: function (all) {
    const heard = [], add = function (s) { if (heard.indexOf(s) < 0) heard.push(s); };""",
     """  skipped: function (all) {
    const heard = [], facts = {}, add = function (s) { if (heard.indexOf(s) < 0) heard.push(s); };""", "const heard = [], facts = {}, add"),
    ("""      if (e.t === 'dead' || e.t === 'down') { const v = FIGHT.byId(e.id); if (v && v.side === 'them') MUSIC.kill(v); add(e.t === 'dead' ? 'kill' : 'went_down'); }
    });
    heard.forEach(function (s, i) { setTimeout(function () { sfx(s); }, beatMs() / 4 * i); });""",
     """      if (e.t === 'attack' && e.hit) { const t = FIGHT.byId(e.to); if (t) t._blow = { hp: e.hp | 0, armour: e.armour | 0, head: !!e.head }; }
      if (e.t === 'dead' || e.t === 'down') { const v = FIGHT.byId(e.id); if (v && v.side === 'them') MUSIC.kill(v);
        if (e.t === 'dead' && v && !facts.kill) facts.kill = SND.death(v, e);   /* rule 235: the death the skip held still says how */
        add(e.t === 'dead' ? 'kill' : 'went_down'); }
    });
    heard.forEach(function (s, i) { setTimeout(function () { sfx(s, facts[s]); }, beatMs() / 4 * i); });""", "facts.kill = SND.death(v, e)"),
]


def die(msg):
    print('THE DEATH SOUNDS PATCH: ' + msg)
    sys.exit(1)


def once(s, old, new, done_mark, what):
    if done_mark in s:
        return s
    n = s.count(old)
    if n != 1:
        die('%s: anchor found %d times' % (what, n))
    return s.replace(old, new)


def block():
    return ('/* ==== inlined verbatim from %s (the gate holds it byte for byte) ==== */\n' % os.path.relpath(ENGINE, ROOT)
            + open(ENGINE, encoding='utf-8').read().rstrip() + '\n' + GLUE)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    body = block()
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END)
        s = s[:a] + START + body + END + s[b:]
    else:
        if s.count(ANCHOR) != 1: die('the block: anchor found %d times' % s.count(ANCHOR))
        s = s.replace(ANCHOR, ANCHOR + START + body + END)
    s = once(s, RECV_OLD, RECV_NEW, "_dh = window.DEATH ? DEATH.heard(d) : null;", "the fight's sound line")
    open(ALPHA, 'w', encoding='utf-8').write(s)
    f = open(FIGHT, encoding='utf-8').read()
    for i, (old, new, mark) in enumerate(FIGHT_EDITS):
        f = once(f, old, new, mark, 'the fight, edit %d' % (i + 1))
    open(FIGHT, 'w', encoding='utf-8').write(f)
    print('THE DEATH SOUNDS PATCH: the alpha carries the player (%d bytes) and the fight\'s sound line; the fight says how each man died' % len(body))


if __name__ == '__main__':
    main()
