#!/usr/bin/env node
/* THE FIGHT, HEADLESS (COMBAT [the fight holds the grid], rule 117(e), 10/18). One loader for every bench and gate that plays
   the live fight's rules in node: the fight-data and fight-rules scripts of slices/BOHEMIA_FIGHT.html, unchanged, with the
   data files the page itself lists (its DATA_FILES) put where the page's own loadAll() puts them (its 'DB.x = a[i]' lines).
   A bench that copies the file list by hand falls out of step the day the fight reads a new file (TUNING's bench did, when
   the fight began reading WORLD's ground table); this one cannot.

     const { engine } = require('./bohemia_fight_headless.js');
     const ctx = engine();                      // ctx.FIGHT, ctx.DB, ctx.setSeed(n)
     const ctx = engine({ patch: rules => rules.replace(a, b), extra: { HOOK: {...} } });   // a bench's own splice, its own globals

   Nothing here changes a rule or a number; patch is the caller's, in its own memory copy. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const FIGHT_FILE = path.join(ROOT, 'slices/BOHEMIA_FIGHT.html');

function scripts(html) {
  const grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('THE FIGHT MOVED: no script ' + id); return m[1]; };
  return { data: grab('fight-data'), rules: grab('fight-rules') };
}

function engine(opt) {
  opt = opt || {};
  const html = fs.readFileSync(FIGHT_FILE, 'utf8'), sc = scripts(html);
  const rules = opt.patch ? opt.patch(sc.rules) : sc.rules;
  const ctx = Object.assign({ console, Math, JSON, Date, Object, Array, String, Number, Error, Map, Set,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } }, opt.extra || {});
  vm.createContext(ctx);
  vm.runInContext(sc.data + ';this.DB=DB;this.DATA_FILES=DATA_FILES;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  fill(ctx, sc.data);
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}

/* the page's own hand-out: 'DB.rules = a[0]; DB.ours = a[1]; ...' inside loadAll(), every file of DATA_FILES read from disk into
   ctx.DB where the page puts it. A bench with its own context (TUNING's) calls this after it runs the fight-data script. */
function fill(ctx, dataScript) {
  const files = vm.runInContext('DATA_FILES', ctx), db = vm.runInContext('DB', ctx);
  const load = dataScript.slice(dataScript.indexOf('function loadAll'));
  const hand = {};
  let m; const re = /DB\.(\w+)\s*=\s*a\[(\d+)\]/g;
  while ((m = re.exec(load.slice(0, load.indexOf('function R(')))) !== null) hand[Number(m[2])] = m[1];
  files.forEach((f, i) => {
    if (!hand[i]) throw new Error('THE FIGHT MOVED: its data file ' + f + ' has no DB.x = a[' + i + '] line');
    db[hand[i]] = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', f), 'utf8'));
  });
  return db;
}

/* play one fight to its end on the fight's own brain (AUTO both sides); returns the state */
function playOut(ctx, opts, limit) {
  const F = ctx.FIGHT;
  F.setup(Object.assign({ auto: true, formation: null }, opts));
  let g = 0;
  while (!F.S.over && g < (limit || 200000)) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
  return { S: F.S, steps: g };
}

module.exports = { engine, fill, playOut, FIGHT_FILE };
