/* ==== __THE_FIGHT_SAVES_AT_ITS_START__ (FINISHER 11/2/26; rule 233, ask lines 155 and 165) ====
   PAOLO 10/26: 'The fight saves only at its start, like Battle Brothers: a reload or crash puts me at the start of the same
   fight; nothing is saved until I'm back on the map.' And again: 'If I lose a fight badly I can close the browser, reopen it
   and restart the fight, any time before the map; the loot screen counts as the fight.'

   MEASURED before this file: the game's fight kept itself at the start of every one of his turns (the fight's own keep,
   bohemia.fight.kept.v1), and the map, the company's wounds, the stash and the purse were written the moment the fight
   ended, before the loot screen. A reload mid-fight put him back on the map with the fight never fought (a free way out),
   and a reload on the loot screen kept the dead dead and the loot half taken.

   NOW, the Battle Brothers way, in one place: the moment a fight opens (the shell's nfOpen), every one of the game's keys
   is copied into ONE record (this file's KEY), with the map's own hand-over that opened the fight. Until the map is back
   on screen (the shell's nfHome) that record stands. If the page dies anywhere in between (a reload, a crash, a closed
   browser, the loot screen), the next boot puts every key back as it was at the bell BEFORE any other script reads one,
   and the shell hands the same fight to the map again once the map is up: the same band, the same ground, his men as they
   walked in, turn one. The fight's own per-turn keep is switched off inside the game (keep:false, resume:false), so
   nothing in a fight is ever saved but its start.

   What never rolls back: his settings (sound, the phone's corner, brightness), his notes and votes, the fight's pace.
   Only the game's own keys (boh...) are copied, and a key the fight made that did not exist at the bell is removed.
   NEW GAME forgets the record (the start screen's forget list). */
(function (root) {
  'use strict';
  var KEY = 'bohemia.fight.start.v1';
  /* his, not the run's: never copied, never rolled back */
  var HIS = /^bohemia\.fight\.(start|kept|speed)|vol|setting|corner|bright|notes|vote|music|^bohemia_sfx/i;
  var GAME = /^boh/i;
  function ls() { try { return root.localStorage; } catch (e) { return null; } }
  function keysNow(L) { var out = []; try { for (var i = 0; i < L.length; i++) out.push(L.key(i)); } catch (e) {} return out; }
  function read() {
    var L = ls(); if (!L) return null;
    var R = null; try { R = JSON.parse(L.getItem(KEY) || 'null'); } catch (e) { R = null; }
    return (R && R.v === 1 && R.keys && R.d) ? R : null;
  }
  /* at the bell: the game as it stands, and the hand-over that opened the fight */
  function write(d) {
    var L = ls(); if (!L || !d) return false;
    var keys = {}, size = 0;
    keysNow(L).forEach(function (k) { if (!k || k === KEY || HIS.test(k) || !GAME.test(k)) return; var v = L.getItem(k); if (v == null) return; keys[k] = v; size += k.length + v.length; });
    var hand = null; try { hand = JSON.parse(JSON.stringify(d)); } catch (e) { return false; }
    var R = { v: 1, at: Date.now(), d: hand, keys: keys, size: size, n: Object.keys(keys).length, restored: 0 };
    try { L.setItem(KEY, JSON.stringify(R)); } catch (e) { root.__FIGHT_START_FULL = (e && e.name) || 'full'; try { L.removeItem(KEY); } catch (e2) {} return false; }
    root.__FIGHT_START_AT = R.at;
    return R.at;
  }
  /* back on the map: the fight is over and its results are the game's now */
  function clear(at) {
    var L = ls(); if (!L) return false;
    if (at) { var R = read(); if (R && R.at !== at) return false; }   /* never a newer fight's record */
    try { L.removeItem(KEY); } catch (e) { return false; }
    root.__FIGHT_START_AT = null; root.__FIGHT_START_PENDING = null;
    return true;
  }
  /* at boot, before anything else reads the game: every key as it was at the bell */
  function restore() {
    var L = ls(), R = read(); if (!L || !R) { if (L) { try { if (L.getItem(KEY)) L.removeItem(KEY); } catch (e) {} } return null; }
    var put = 0, gone = 0;
    keysNow(L).forEach(function (k) { if (!k || k === KEY || HIS.test(k) || !GAME.test(k) || Object.prototype.hasOwnProperty.call(R.keys, k)) return; try { L.removeItem(k); gone++; } catch (e) {} });
    Object.keys(R.keys).forEach(function (k) { if (HIS.test(k)) return; try { if (L.getItem(k) !== R.keys[k]) { L.setItem(k, R.keys[k]); put++; } } catch (e) {} });
    R.restored = (R.restored | 0) + 1; R.lastRestore = Date.now();
    try { L.setItem(KEY, JSON.stringify(R)); } catch (e) {}
    root.__FIGHT_START_AT = R.at;
    root.__FIGHT_START_PENDING = R.d;
    root.__FIGHT_START_RESTORED = { at: R.at, why: R.d.why || null, label: R.d.label || null, put: put, gone: gone, times: R.restored };
    return R;
  }
  root.BohemiaFightStart = { KEY: KEY, HIS: HIS, write: write, clear: clear, read: read, restore: restore,
    pending: function () { return root.__FIGHT_START_PENDING || null; } };
  /* the boot: this file is the shell's first script, so nothing has read the game yet */
  try { if (root.document) restore(); } catch (e) {}
})(typeof window !== 'undefined' ? window : this);
