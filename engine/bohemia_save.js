/* bohemia_save.js — the Bohemia save file. Bundles WORLD state (position, seed,
   time, whatever the walkable world serializes) with QUEST state (one runtime
   state per active quest) into ONE versioned JSON blob, behind a storage adapter.
   UI/engine-agnostic. Pairs with bohemia_quest_runtime.js.

   Why it exists: the runtime already serializes a single quest's state, but a save
   FILE must carry the world AND every in-flight quest together, tolerate a garbled
   or older blob without crashing (voice-to-text / never-lose spirit), and swap
   storage (localStorage in the browser, an injected mock in tests). This is the
   quest-aware save the vertical slice needs; the walkable build just calls it.

   No dependencies. Node + browser. */
(function(root){
'use strict';
var VERSION=1;

/* world: any plain-object the world serializes. quests: map questId -> runtime.state.
   meta: optional {stamp, gen, ...}. Timestamps are passed IN (kept deterministic). */
function pack(world, quests, meta){
  return JSON.stringify({ v:VERSION, world:world||{}, quests:quests||{}, meta:meta||{} });
}

/* Never throws. A null/garbled/older blob returns null or a safe shape. */
function unpack(str){
  if(str==null) return null;
  var o; try{ o=(typeof str==='string')?JSON.parse(str):str; }catch(e){ return null; }
  if(!o || typeof o!=='object') return null;
  return { v:(typeof o.v==='number'?o.v:0), world:o.world||{}, quests:o.quests||{}, meta:o.meta||{} };
}

/* storage adapter: default localStorage in a browser; an in-memory map otherwise;
   or inject your own {get(k),set(k,v)} (tests do this). */
function makeStore(adapter){
  var a = adapter || (typeof localStorage!=='undefined'
    ? { get:function(k){ return localStorage.getItem(k); }, set:function(k,v){ localStorage.setItem(k,v); } }
    : (function(){ var m={}; return { get:function(k){ return (k in m)?m[k]:null; }, set:function(k,v){ m[k]=v; } }; })());
  return {
    save:function(key, world, quests, meta){ a.set(key, pack(world, quests, meta)); return true; },
    load:function(key){ return unpack(a.get(key)); },
    has:function(key){ return a.get(key)!=null; },
    _adapter:a
  };
}

/* integration helper: rebuild a live runtime from a saved quest state.
   RT = the bohemia_quest_runtime API; Q = the parsed quest; saved = quests[id] or null. */
function restoreQuest(RT, Q, saved){
  if(!saved) return new RT.Runtime(Q).start();
  return RT.Runtime.load(Q, saved);
}

var API={ VERSION:VERSION, pack:pack, unpack:unpack, makeStore:makeStore, restoreQuest:restoreQuest };
if(typeof module!=='undefined' && module.exports) module.exports=API;
root.BQSave=API;
})(typeof globalThis!=='undefined'?globalThis:this);
