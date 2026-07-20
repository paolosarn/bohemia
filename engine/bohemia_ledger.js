/* bohemia_ledger.js — the two-ledger engine (RECORDED vs UNRECORDED).
   Implements the locked principle from BOHEMIA_ADDENDUM_RECORDED_VS_UNRECORDED_7_1_26:
   the world is a deterministic function of the WHOLE choice log, but the Amalgamation
   can only see/model the entries flagged recorded:true. The dynasty's advantage is the
   recorded:false (off-ledger) entries the machine never compiled. One boolean between
   determinism (engine) and invisibility (antagonist).

   MECHANISM ONLY (mechanism-mine / contents-Paolo's law): this decides NOTHING about
   WHICH choices are unrecorded. That rule is Paolo's [PENDING] call. The caller sets
   `recorded` per entry; default is TRUE (the feed is mandatory, so the world is recorded
   by default and unrecorded is the rare, deliberate exception, per the spec).

   No dependencies. Node + browser. Part of the save (serialize -> the choice log). */
(function(root){
'use strict';

function Ledger(entries){ this.entries = Array.isArray(entries) ? entries.slice() : []; }

/* record a consequential choice. recorded defaults TRUE; pass {recorded:false} for an
   off-ledger (tunnel/family/face-to-face) choice the feed never saw. */
Ledger.prototype.record = function(key, value, opts){
  opts = opts || {};
  this.entries.push({
    key: key,
    value: (value===undefined ? true : value),
    recorded: opts.recorded !== false,
    gen: (opts.gen!=null ? opts.gen : null),
    tags: opts.tags || []
  });
  return this;
};

Ledger.prototype.all        = function(){ return this.entries.slice(); };
Ledger.prototype.recorded   = function(){ return this.entries.filter(function(e){ return e.recorded; }); };
Ledger.prototype.unrecorded = function(){ return this.entries.filter(function(e){ return !e.recorded; }); };

/* WORLD VIEW: the full truth the world is computed from (all entries, last write wins). */
Ledger.prototype.worldView = function(){
  var m={}; this.entries.forEach(function(e){ m[e.key]=e.value; }); return m;
};
/* AMALGAMATION VIEW: only what the feed compiled (recorded:true). This IS the
   antagonist's entire knowledge model, for free, no hand-authoring. */
Ledger.prototype.amalgamationView = function(){
  var m={}; this.entries.forEach(function(e){ if(e.recorded) m[e.key]=e.value; }); return m;
};

/* can the machine model this key? (a recorded entry exists) */
Ledger.prototype.sees   = function(key){ return this.entries.some(function(e){ return e.recorded && e.key===key; }); };
/* did it happen at all in world truth? */
Ledger.prototype.has    = function(key){ return this.entries.some(function(e){ return e.key===key; }); };
/* is it in the BLIND SPOT? happened, but the machine never compiled it.
   (once a key is recorded even once, it is compiled -> no longer hidden. Spec: if it is
   in the recorded log, it was seen. This also gives the "accidental exposure" hook for
   free: adding a recorded entry for a hidden key flips sees()->true.) */
Ledger.prototype.hidden = function(key){ return this.has(key) && !this.sees(key); };

Ledger.prototype.serialize = function(){ return JSON.stringify(this.entries); };
Ledger.load = function(json){ return new Ledger(typeof json==='string' ? JSON.parse(json) : json); };

var API={ Ledger:Ledger, VERSION:'ledger-1.0.0' };
if(typeof module!=='undefined' && module.exports) module.exports=API;
root.BQLedger=API;
})(typeof globalThis!=='undefined'?globalThis:this);
