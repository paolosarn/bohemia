// BOHEMIA SAVE (8/6/26) — THE IPHONE-PROOF SAVE. One canonical body; the alpha
// inlines it, gates/save_iphone_gate.js drives it against a hostile fake browser.
//
// WHY THIS EXISTS. CITYSAVE v1 (7/7/26) was one key, one write, no verify, and a
// one-byte probe. Every one of those is a way to lose a run on an iPhone, and the
// demo is played on an iPhone. What v1 actually did, in the four situations iOS
// Safari really produces:
//
//   1. THE PROBE LIED. It wrote the string '1'. A one-byte write succeeds in
//      exactly the situations where a 200KB save throws QuotaExceededError, so
//      mode reported 'disk' and the first real autosave silently fell to memory.
//      v2 probes with a blob the SIZE OF THE REAL SAVE and reads it back.
//
//   2. THE TIME MACHINE. v1's own comment promised "Never a time machine" and
//      then built one. When a disk write failed, v1 flipped to memory and left
//      the OLD save sitting in localStorage. Next launch the one-byte probe
//      passed, mode went back to 'disk', and load() returned THE STALE SAVE.
//      The player is silently sent backwards with no message. v2 POISONS the
//      disk slots the instant a write fails: they are deleted and a tombstone is
//      written, so a stale save can never be resurrected. A run that went
//      memory-only stays memory-only, loudly, and EXPORT is the line out.
//
//   3. ONE SLOT. A single key means the write that fails is the write that
//      destroys the only copy. iOS kills backgrounded tabs hard and without
//      warning. v2 keeps TWO slots and a generation counter and ALWAYS writes to
//      the OLDER one, so the newest good save is never the target of a write. A
//      torn or refused write costs you the newest state, never everything.
//
//   4. NO INTEGRITY. v1 did JSON.parse in a try and returned null on throw, so a
//      truncated blob was indistinguishable from having no save at all: the game
//      quietly started over. v2 stamps every envelope with a byte length and an
//      FNV-1a checksum, verifies both on load, and REPORTS corruption instead of
//      swallowing it. On load it takes the highest generation that VERIFIES, so a
//      corrupt newest slot falls back to the intact older one by itself.
//
// AND THE ONE THAT CANNOT BE FIXED IN CODE, so it gets told to the player
// instead: iOS Safari's ITP wipes all script-writable storage after 7 days
// without a visit. Nothing a page can do survives that. A HOME SCREEN install is
// exempt, and navigator.standalone says whether you have one. So status() reports
// evictionRisk, and the surface can say "add this to your home screen or export"
// while it is still true rather than after the run is gone.
//
// DELIBERATELY NOT INDEXEDDB. ITP evicts IndexedDB on the same 7-day schedule, so
// mirroring there buys nothing for the failure that matters, and costs an async
// path in an autosave that has to be synchronous at page-hide. EXPORT is the real
// durable line, exactly as the 7/7 comment said.
//
// REUSE CHECK: cooks no graphic pixels of any kind. This is storage plumbing; it
// opens no bank because there is nothing to draw.
(function (root) {
  'use strict';

  var V = 2;
  var PROBE_MIN = 64 * 1024;      // never probe smaller than a plausible save
  var PROBE_HEAD = 1.25;          // and probe for headroom over the last real one

  /* FNV-1a 32-bit. Cheap, synchronous, and good enough to catch the failure this
     actually guards: a truncated or half-written blob, not an adversary. */
  function fnv(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i) & 0xff;
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      if (s.charCodeAt(i) > 0xff) {           // keep wide chars in the digest
        h ^= (s.charCodeAt(i) >> 8) & 0xff;
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      }
    }
    return h >>> 0;
  }

  function isQuota(e) {
    if (!e) return false;
    var n = e.name || '', c = e.code;
    return n === 'QuotaExceededError' || n === 'NS_ERROR_DOM_QUOTA_REACHED' ||
           c === 22 || c === 1014;
  }

  function make(opts) {
    opts = opts || {};
    var NAME = opts.name || 'bohemia_city_save';
    var now = opts.now || function () { return Date.now(); };

    var K_A = NAME + '.a', K_B = NAME + '.b';
    var K_TOMB = NAME + '.dead';
    var K_PROBE = NAME + '.probe';
    var DEADMARK = '{"bohemia":"DEAD"}';   // see poison(): a kill that needs no space
    var K_V1 = NAME;                 // the 7/7 single-slot key, migrated once

    var S = {
      V: V,
      KEY: NAME,                     // kept: v1 callers read CITYSAVE.KEY
      mode: 'memory',
      mem: null,                     // the in-memory envelope string, ALWAYS kept
      gen: 0,
      corrupt: 0,                    // slots that failed verify this session
      poisoned: false,               // a disk write failed; disk is dead this run
      migrated: false,
      lastLen: 0,
      quotaHits: 0,
      _lastErr: null
    };

    /* The backend. Injectable so the gate can hand us a hostile browser; in the
       page it is real localStorage, and a launcher with no localStorage at all
       (file://) lands straight on memory without throwing. */
    var store = opts.store;
    if (store === undefined) {
      try { store = (typeof localStorage !== 'undefined') ? localStorage : null; }
      catch (e) { store = null; }    // some launchers THROW on the mere access
    }

    function get(k) { try { return store.getItem(k); } catch (e) { return null; } }
    function del(k) { try { store.removeItem(k); return true; } catch (e) { return false; } }

    /* ---- the envelope ------------------------------------------------------
       payload is a STRING inside the JSON on purpose: the checksum then covers
       exactly the bytes we compare, with no re-serialisation ambiguity. */
    function wrap(data, prefabs, gen) {
      var p = JSON.stringify({ data: data, prefabs: prefabs === undefined ? null : prefabs });
      return JSON.stringify({ v: V, gen: gen, t: now(), len: p.length, ck: fnv(p), p: p });
    }

    /* Returns the v1-shaped object the rest of the game already reads
       ({t,data,prefabs}), or null with a REASON recorded. */
    function unwrap(blob) {
      if (!blob) return null;
      var e;
      try { e = JSON.parse(blob); } catch (err) { return null; }
      if (!e || typeof e !== 'object') return null;

      /* v1 envelope: {v:1,t,data,prefabs}. No integrity to check, and that is the
         whole point of v2, but a real v1 save is still a real save. Migrate it. */
      if (e.v === 1 && e.data !== undefined) {
        return { v: 1, gen: 0, t: e.t || 0, data: e.data, prefabs: e.prefabs || null, legacy: true };
      }
      if (e.v !== V || typeof e.p !== 'string') return null;
      if (e.p.length !== e.len) return null;             // truncated / torn write
      if (fnv(e.p) !== e.ck) return null;                // corrupted bytes
      var inner;
      try { inner = JSON.parse(e.p); } catch (err) { return null; }
      if (!inner || inner.data === undefined) return null;
      return { v: V, gen: e.gen | 0, t: e.t || 0, data: inner.data, prefabs: inner.prefabs || null };
    }

    function readSlot(k) {
      var raw = get(k);
      if (!raw) return null;
      if (raw === DEADMARK) return null;    // deliberately killed, not corrupted
      var got = unwrap(raw);
      if (!got) { S.corrupt++; return null; }
      return got;
    }

    /* ---- POISON: the fix for the time machine ------------------------------
       The instant a disk write fails, whatever is on disk is OLDER than the state
       the player is now living in. Leaving it there means the next launch loads
       it and silently rewinds him. So it dies now. The tombstone carries the
       generation it killed, because removeItem can fail too (a store that refuses
       writes may refuse deletes) and the next boot has to be able to tell that
       the slots it can still see are dead ones. */
    function poison(why) {
      S.poisoned = true;
      S.mode = 'memory';
      S._lastErr = why || 'write refused';
      del(K_A); del(K_B); del(K_V1); del(K_PROBE);
      /* AND OVERWRITE, because delete is not always available. The gate's
         worst case is a device that is FULL and whose removeItem throws: nothing
         can be deleted and the tombstone will not fit, so the stale save
         survives and the next launch rewinds him. Stamping each slot with a tiny
         DEAD marker always fits — replacing a big string with a small one can
         never exceed a quota — so the kill works even when the device has no
         room and no delete. */
      try { store.setItem(K_A, DEADMARK); } catch (e) {}
      try { store.setItem(K_B, DEADMARK); } catch (e) {}
      try { store.setItem(K_V1, DEADMARK); } catch (e) {}
      try { store.setItem(K_TOMB, JSON.stringify({ t: now(), gen: S.gen, why: S._lastErr })); }
      catch (e) { /* no room even for this; the DEAD markers above are the
                     protection that does not depend on space. */ }
    }

    function tombGen() {
      var raw = get(K_TOMB);
      if (!raw) return -1;
      try { var t = JSON.parse(raw); return (t && typeof t.gen === 'number') ? t.gen : 0; }
      catch (e) { return 0; }
    }

    /* ---- probe: SIZED, and read back --------------------------------------
       bytes defaults to 64KB, or 125% of the biggest save we have actually
       written, whichever is larger. Reading it back catches the case a bare
       setItem cannot: a store that accepts the write and does not keep it. */
    function probe(bytes) {
      S._lastErr = null;
      if (!store) { S.mode = 'memory'; S._lastErr = 'no storage in this launcher'; return S.mode; }
      var n = Math.max(PROBE_MIN, Math.round((S.lastLen || 0) * PROBE_HEAD), bytes || 0);
      var blob = new Array(n + 1).join('x');
      try {
        store.setItem(K_PROBE, blob);
        var back = store.getItem(K_PROBE);
        /* the cleanup is deliberately OUTSIDE the verdict: a store that refuses
           removeItem but honours setItem is a WORKING store, and treating a
           failed delete as a failed write condemned it to memory for nothing.
           Stamp it small either way so a refused delete cannot strand 64KB. */
        try { store.removeItem(K_PROBE); } catch (e2) { try { store.setItem(K_PROBE, DEADMARK); } catch (e3) {} }
        if (back !== blob) { S.mode = 'memory'; S._lastErr = 'storage did not keep what it was given'; return S.mode; }
      } catch (e) {
        if (isQuota(e)) S.quotaHits++;
        del(K_PROBE);
        S.mode = 'memory';
        S._lastErr = isQuota(e) ? 'storage is full' : 'storage refused the write';
        return S.mode;
      }
      S.mode = S.poisoned ? 'memory' : 'disk';
      return S.mode;
    }

    /* ---- save --------------------------------------------------------------
       ALWAYS writes the older slot. The newest good save is never the target, so
       a refused or torn write costs the newest state and nothing else. */
    function save(st, prefabs) {
      var a = readSlot(K_A), b = readSlot(K_B);
      var best = Math.max(a ? a.gen : -1, b ? b.gen : -1, S.gen);
      S.gen = best + 1;

      var blob = wrap(st, prefabs === undefined ? (opts.prefabs && opts.prefabs()) : prefabs, S.gen);
      S.mem = blob;                                  // memory copy, unconditionally
      S.lastLen = blob.length;

      /* THE SECOND ROUTE TO THE TIME MACHINE, found by the gate on 8/6 and not
         by reading the code. It is not only a FAILED write that strands a stale
         save on disk. A session that came up in MEMORY mode because the device
         was already full plays on, never writes, and leaves the old save sitting
         there; the next launch finds room, probes disk, and loads it. Same
         rewind, different door.
         So the real rule is not "poison on write failure", it is: THE MOMENT THE
         LIVE STATE DIVERGES FROM WHAT IS ON DISK AND WE CANNOT UPDATE DISK, THE
         DISK COPY IS A TIME MACHINE AND IT DIES. That moment is the first
         memory-mode save, not before it: until the player has saved, the disk
         copy is still the legitimate resume point, which is why load() above is
         allowed to return it. */
      if (S.mode !== 'disk') {
        if (store && !S.poisoned) poison(S._lastErr || 'this launcher will not store a save');
        return S.mode;
      }
      if (S.poisoned) return S.mode;

      // the OLDER slot is the one we are allowed to destroy
      var target = (a ? a.gen : -1) <= (b ? b.gen : -1) ? K_A : K_B;
      try {
        store.setItem(target, blob);
      } catch (e) {
        if (isQuota(e)) S.quotaHits++;
        poison(isQuota(e) ? 'storage is full' : 'storage refused the write');
        return S.mode;
      }
      // and verify it actually landed, byte for byte
      if (get(target) !== blob) { poison('storage did not keep what it was given'); return S.mode; }

      del(K_V1);                                     // the migration is complete
      return S.mode;
    }

    /* ---- load --------------------------------------------------------------
       Highest generation that VERIFIES wins, so a corrupt newest slot falls back
       to the intact older one on its own. */
    function load() {
      S.corrupt = 0;
      var best = null;

      if (store && !S.poisoned) {
        var dead = tombGen();
        var a = readSlot(K_A), b = readSlot(K_B);
        if (a && a.gen <= dead) a = null;            // killed by a poisoned run
        if (b && b.gen <= dead) b = null;
        if (a) best = a;
        if (b && (!best || b.gen > best.gen)) best = b;

        if (!best && dead < 0) {                     // the 7/7 single-slot save
          var v1 = readSlot(K_V1);
          if (v1) { best = v1; S.migrated = true; }
        }
      }

      var m = unwrap(S.mem);
      if (m && (!best || m.gen >= best.gen)) best = m;
      if (!best) return null;
      S.gen = Math.max(S.gen, best.gen);
      return { v: best.v, t: best.t, data: best.data, prefabs: best.prefabs };
    }

    /* ---- status: what the player is actually told --------------------------
       Never claims durability it does not have. The eviction line is the honest
       one: on iOS Safari a tab-launched page loses everything after 7 quiet days,
       a home-screen install does not, and there is no code that changes that. */
    function status() {
      var standalone = opts.standalone !== undefined ? !!opts.standalone
        : (typeof navigator !== 'undefined' && !!navigator.standalone);
      var ios = opts.ios !== undefined ? !!opts.ios
        : (typeof navigator !== 'undefined' &&
           /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
           (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' &&
            (navigator.maxTouchPoints || 0) > 1));
      var risk = S.mode === 'disk' && ios && !standalone;
      var line;
      if (S.mode !== 'disk') {
        line = 'MEMORY ONLY — ' + (S._lastErr || 'this launcher will not store a save') +
               '. Your run is safe until you close the tab. EXPORT SAVE is the only way out.';
      } else if (risk) {
        line = 'Saved to this device. Safari erases it after 7 days without a visit — ' +
               'add Bohemia to your Home Screen, or EXPORT SAVE.';
      } else {
        line = 'Saved to this device. Autosaves survive a reload.';
      }
      return {
        mode: S.mode, gen: S.gen, bytes: S.lastLen, corrupt: S.corrupt,
        poisoned: S.poisoned, migrated: S.migrated, quotaHits: S.quotaHits,
        standalone: standalone, evictionRisk: risk, reason: S._lastErr, line: line
      };
    }

    S.probe = probe; S.save = save; S.load = load; S.status = status;
    S.fnv = fnv; S._poison = poison;
    return S;
  }

  var API = { make: make, fnv: fnv, isQuota: isQuota, V: V };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaSave = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
