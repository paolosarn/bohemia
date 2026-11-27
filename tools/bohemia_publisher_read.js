#!/usr/bin/env node
/* ============================================================================
   THE PUBLISHER'S READ (PLUMBER 9, 11/27/26, VAMILY rule 495(c) and (d)).

   Paolo 11/27: "don't just fuck it up and fix it with fucked up coding duct tape...
   everything has to have the final organizational work of the code in mind... when
   we give it to a publisher."

   This is the census a publisher's engineer would run on day one, written down so
   it is the same census every time. It reads the code, it never changes it. It
   counts five things:

   1. THE BIGGEST FILES: bytes, lines, and how much of a page is code, how much is
      inlined data (data: URIs, long string literals).
   2. THE PATCH LAYERS in the five big pages rule 495(c) names (the fight, the
      alpha, the demo, the city world, the settlement screen). A patch is a named
      marker in a comment, __LIKE_THIS__. A BLOCK is the marker's opening line
      ("/* ==== __NAME__ ..." or "<!-- ==== __NAME__ ..."). A HOOK is a line
      outside the marker's own block that carries the marker: the place a later
      fix reached back into older code. OVERRIDES are a function the page or its
      scripts already declare, declared again at the top level or assigned over
      ("x = function", "window.x = function"): the layering in code terms, where
      the newest copy silently wins.
   3. THE COPIES: a function body (comments out, whitespace folded, at least
      MIN_BODY characters) that is byte-identical in two or more of the files the
      game loads. The demo is a cut of the alpha (tools/bohemia_cut_the_demo.js,
      byte-identical by demo_build_gate), so the demo is not counted twice.
      NAME FORKS (one name, two different bodies in two files) are listed, never
      ratcheted: two files may honestly both have a `draw`.
   4. DEAD CODE: code files in slices/ and engine/ the game never loads (reached by
      walking every string that names a file, from the demo and the alpha, with a
      prefix rule for names built at run time), and functions declared in loaded
      code whose name appears nowhere else in loaded code (an upper bound: a name
      called only through a string built at run time would be missed).
   5. WHAT LINKS TO WHAT: for each big page, the scripts it loads, the pages it
      frames, and how many times it reaches into another frame by name
      (parent.x, contentWindow.x, postMessage).

   Usage:
     node tools/bohemia_publisher_read.js            print the census
     node tools/bohemia_publisher_read.js --json F   also write it to F
   The gate gates/the_patch_layers_only_go_down_gate.js requires census() from here.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const ENGINE = path.join(ROOT, 'engine');

// The five big pages rule 495(c) names, in its order.
const BIG_PAGES = [
  'slices/BOHEMIA_FIGHT.html',
  'slices/BOHEMIA_ALPHA_0_9.html',
  'slices/BOHEMIA_DEMO.html',
  'slices/BOHEMIA_CITY_WORLD.html',
  'slices/BOHEMIA_SETTLEMENT_SCREEN.html',
];
// The product a stranger opens is the demo; the workshop is the alpha. Everything
// the game can load is reached from these two.
const ENTRY_PAGES = ['slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_ALPHA_0_9.html'];
// Generated from another file by a tool, so its functions are not hand copies.
const GENERATED = { 'slices/BOHEMIA_DEMO.html': 'slices/BOHEMIA_ALPHA_0_9.html (tools/bohemia_cut_the_demo.js)' };
const MIN_BODY = 100;          // a copy shorter than this is a one-liner (clamp, lerp): listed by name only

// ---------------------------------------------------------------------------
// THE LEXER. One pass over JavaScript; every character gets a kind:
// 0 code, 1 comment, 2 string or template text, 3 regex literal.
// ---------------------------------------------------------------------------
const KW_BEFORE_REGEX = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete',
  'void', 'throw', 'yield', 'await', 'instanceof']);
const PUNCT_BEFORE_REGEX = '(,=:[!&|?{};~+-*%<>^';

function isIdChar(c) { return (c >= 97 && c <= 122) || (c >= 65 && c <= 90) || (c >= 48 && c <= 57) || c === 95 || c === 36; }

function lexJS(src) {
  const n = src.length;
  const kind = new Uint8Array(n);
  let i = 0;
  let lastSig = '';        // last significant code char
  let lastWord = '';       // last identifier/keyword if lastSig ended one
  // a stack of template contexts: each entry is the brace depth inside its ${ }
  const tpl = [];
  function regexAllowed() {
    if (lastSig === '') return true;
    if (lastWord) return KW_BEFORE_REGEX.has(lastWord);
    return PUNCT_BEFORE_REGEX.indexOf(lastSig) >= 0;
  }
  function scanTemplate() {   // at a backtick or after a closing } of ${ }: template text until ` or ${
    while (i < n) {
      const ch = src.charCodeAt(i);
      if (ch === 92) { kind[i] = 2; if (i + 1 < n) kind[i + 1] = 2; i += 2; continue; }
      if (ch === 96) { kind[i] = 2; i++; return false; }                 // closing backtick
      if (ch === 36 && src.charCodeAt(i + 1) === 123) {                // ${
        kind[i] = 2; kind[i + 1] = 0; i += 2; tpl.push(0); lastSig = '{'; lastWord = ''; return true;
      }
      kind[i] = 2; i++;
    }
    return false;
  }
  while (i < n) {
    const c = src.charCodeAt(i);
    // whitespace
    if (c === 32 || c === 9 || c === 10 || c === 13) { i++; continue; }
    // comments
    if (c === 47 && src.charCodeAt(i + 1) === 47) {
      const e = src.indexOf('\n', i); const end = e < 0 ? n : e;
      kind.fill(1, i, end); i = end; continue;
    }
    if (c === 47 && src.charCodeAt(i + 1) === 42) {
      const e = src.indexOf('*/', i + 2); const end = e < 0 ? n : e + 2;
      kind.fill(1, i, end); i = end; continue;
    }
    // strings
    if (c === 39 || c === 34) {
      const q = c; const s = i; i++;
      while (i < n) { const d = src.charCodeAt(i); if (d === 92) { i += 2; continue; } if (d === q || d === 10) { i++; break; } i++; }
      kind.fill(2, s, i); lastSig = '"'; lastWord = ''; continue;
    }
    if (c === 96) { kind[i] = 2; i++; scanTemplate(); lastSig = '"'; lastWord = ''; continue; }
    // template expression braces
    if (tpl.length && (c === 123 || c === 125)) {
      if (c === 123) { tpl[tpl.length - 1]++; i++; lastSig = '{'; lastWord = ''; continue; }
      if (tpl[tpl.length - 1] === 0) { tpl.pop(); kind[i] = 2; i++; scanTemplate(); lastSig = '"'; lastWord = ''; continue; }
      tpl[tpl.length - 1]--; i++; lastSig = '}'; lastWord = ''; continue;
    }
    // regex literal
    if (c === 47 && regexAllowed()) {
      const s = i; i++; let cls = false;
      while (i < n) {
        const d = src.charCodeAt(i);
        if (d === 92) { i += 2; continue; }
        if (d === 10) break;                          // not a regex after all; stop at the line
        if (cls) { if (d === 93) cls = false; }
        else if (d === 91) cls = true;
        else if (d === 47) { i++; break; }
        i++;
      }
      while (i < n && isIdChar(src.charCodeAt(i))) i++;   // flags
      kind.fill(3, s, i); lastSig = '/'; lastWord = ''; continue;
    }
    // identifiers and numbers
    if (isIdChar(c)) {
      const s = i; while (i < n && isIdChar(src.charCodeAt(i))) i++;
      const w = src.slice(s, i);
      lastSig = 'a'; lastWord = (c >= 48 && c <= 57) ? '' : w;
      if (c >= 48 && c <= 57) lastWord = '';
      continue;
    }
    lastSig = src[i]; lastWord = ''; i++;
  }
  return kind;
}

// The code with everything that is not code blanked to spaces (newlines kept), so
// regexes and brace matching only ever see code.
function codeView(src, kind) {
  const a = new Array(src.length);
  for (let i = 0; i < src.length; i++) a[i] = kind[i] === 0 || src[i] === '\n' ? src[i] : ' ';
  return a.join('');
}
// The text with comments removed (strings kept): what "the same function" means.
function noComments(src, kind, s, e) {
  let o = '';
  for (let i = s; i < e; i++) if (kind[i] !== 1) o += src[i];
  return o;
}
function comments(src, kind) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    if (kind[i] === 1) { const s = i; while (i < n && kind[i] === 1) i++; out.push([s, i]); } else i++;
  }
  return out;
}
function lineStarts(text) {
  const ls = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) ls.push(i + 1);
  return ls;
}
function lineOf(ls, off) {
  let lo = 0, hi = ls.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ls[m] <= off) lo = m; else hi = m - 1; }
  return lo + 1;
}

// ---------------------------------------------------------------------------
// A FILE AS PROGRAMS: an .html page is its inline <script> elements (one global
// scope) plus its non-script comments; a .js file is one program.
// ---------------------------------------------------------------------------
function readUnit(rel) {
  return unitFromText(rel, fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}
function unitFromText(rel, text) {
  const unit = { rel, text, bytes: Buffer.byteLength(text), lines: text.split('\n').length, scripts: [], srcs: [], htmlComments: [] };
  if (rel.endsWith('.js')) {
    unit.scripts.push({ start: 0, end: text.length });
  } else {
    const re = /<script\b([^>]*)>/gi; let m;
    let lastEnd = 0;
    while ((m = re.exec(text))) {
      const attrs = m[1];
      const open = m.index, bodyStart = re.lastIndex;
      const close = text.toLowerCase().indexOf('</script', bodyStart);
      const bodyEnd = close < 0 ? text.length : close;
      // html between the last script and this one: its comments
      htmlCommentsIn(text, lastEnd, open, unit.htmlComments);
      const srcM = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
      const typeM = /\btype\s*=\s*["']([^"']+)["']/i.exec(attrs);
      if (srcM) unit.srcs.push(srcM[1]);
      else if (!typeM || /javascript|module/i.test(typeM[1])) unit.scripts.push({ start: bodyStart, end: bodyEnd });
      else unit.scripts.push({ start: bodyStart, end: bodyEnd, data: true });
      lastEnd = close < 0 ? text.length : close;
      re.lastIndex = lastEnd;
    }
    htmlCommentsIn(text, lastEnd, text.length, unit.htmlComments);
  }
  // lex every program
  unit.progs = unit.scripts.filter(s => !s.data).map(s => {
    const src = text.slice(s.start, s.end);
    const kind = lexJS(src);
    return { base: s.start, src, kind, view: codeView(src, kind) };
  });
  unit.dataScriptBytes = unit.scripts.filter(s => s.data).reduce((a, s) => a + (s.end - s.start), 0);
  return unit;
}
function htmlCommentsIn(text, s, e, out) {
  const seg = text.slice(s, e);
  const re = /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g; let m;
  while ((m = re.exec(seg))) out.push([s + m.index, s + m.index + m[0].length]);
}

// ---------------------------------------------------------------------------
// FUNCTIONS: every `function NAME(...) { ... }` with its body and depth.
// ---------------------------------------------------------------------------
function matchClose(view, i, open, close) {
  let d = 0;
  for (; i < view.length; i++) {
    const ch = view[i];
    if (ch === open) d++;
    else if (ch === close) { d--; if (d === 0) return i; }
  }
  return -1;
}
function functionsOf(prog) {
  const out = [];
  const { view, src, kind } = prog;
  // brace depth at every offset, cheaply: prefix walk
  const re = /\bfunction\b\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/g; let m;
  // precompute depth by a single walk, recorded at match points
  const marks = [];
  while ((m = re.exec(view))) marks.push(m);
  let depth = 0, p = 0;
  for (const mm of marks) {
    for (; p < mm.index; p++) { const ch = view[p]; if (ch === '{') depth++; else if (ch === '}') depth--; }
    const name = mm[1];
    const parOpen = mm.index + mm[0].length - 1;
    const parClose = matchClose(view, parOpen, '(', ')');
    if (parClose < 0) continue;
    let b = parClose + 1; while (b < view.length && /\s/.test(view[b])) b++;
    if (view[b] !== '{') continue;
    const bEnd = matchClose(view, b, '{', '}');
    if (bEnd < 0) continue;
    const body = noComments(src, kind, b, bEnd + 1).replace(/\s+/g, ' ').trim();
    out.push({ name, off: mm.index, depth, body, len: body.length });
  }
  return out;
}

// assignments of a function over a name: x = function / window.x = function / x = (..) =>
function assignmentsOf(prog) {
  const out = [];
  const re = /(?:^|[^\w$.])((?:window\.|self\.|globalThis\.)?)([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b|\([^()]*\)\s*=>)/g; let m;
  while ((m = re.exec(prog.view))) {
    // skip "var x = function" and "let/const" (a fresh name, not an override) and ==, ===, !=, <=, >=
    const before = prog.view.slice(Math.max(0, m.index - 12), m.index + 1);
    if (/\b(var|let|const)\s*$/.test(before)) continue;
    out.push({ name: m[2], off: m.index + 1, global: !!m[1] });
  }
  return out;
}

// ---------------------------------------------------------------------------
// PATCH MARKERS in comments.
// ---------------------------------------------------------------------------
const MARKER = /__([A-Z][A-Z0-9_]*[A-Z0-9])__/g;
function commentRangesAbs(unit) {
  const out = unit.htmlComments.slice();
  for (const pr of unit.progs) for (const [s, e] of comments(pr.src, pr.kind)) out.push([pr.base + s, pr.base + e]);
  out.sort((a, b) => a[0] - b[0]);
  return out;
}
function patchLayers(unit) {
  const text = unit.text; const ls = lineStarts(text);
  const cr = commentRangesAbs(unit);
  // per line: the markers mentioned in a comment on that line, and whether the line is an opener/closer
  const mentions = new Map();   // line -> Set(names)
  const openers = [];           // {name, line}
  const closers = [];           // {name, line}
  const OPEN = /^\s*(?:\/\*|<!--)\s*={3,}\s*__([A-Z][A-Z0-9_]*[A-Z0-9])__/;
  const CLOSE = /^\s*(?:\/\*|<!--)\s*={3,}\s*(?:end\b\s*_*|\/\s*_*|END\b\s*_*)__([A-Z][A-Z0-9_]*[A-Z0-9])__/;
  for (const [s, e] of cr) {
    const body = text.slice(s, e);
    if (body.indexOf('__') < 0) continue;
    // each line of the comment
    let off = s;
    for (const piece of body.split('\n')) {
      MARKER.lastIndex = 0; let m;
      const ln = lineOf(ls, off);
      while ((m = MARKER.exec(piece))) {
        if (!mentions.has(ln)) mentions.set(ln, new Set());
        mentions.get(ln).add(m[1]);
      }
      off += piece.length + 1;
    }
    const first = body.split('\n')[0];
    let m2;
    if ((m2 = CLOSE.exec(first))) closers.push({ name: m2[1], line: lineOf(ls, s) });
    else if ((m2 = OPEN.exec(first))) openers.push({ name: m2[1], line: lineOf(ls, s) });
  }
  // block ranges: opener to its closer; a block with no closer runs to the next opener
  const blocks = [];
  const sortedOpen = openers.slice().sort((a, b) => a.line - b.line);
  for (let k = 0; k < sortedOpen.length; k++) {
    const o = sortedOpen[k];
    const c = closers.find(x => x.name === o.name && x.line > o.line);
    const next = k + 1 < sortedOpen.length ? sortedOpen[k + 1].line - 1 : ls.length;
    blocks.push({ name: o.name, from: o.line, to: c ? c.line : next, closed: !!c });
  }
  const inOwn = (name, ln) => blocks.some(b => b.name === name && ln >= b.from && ln <= b.to);
  let hookLines = 0; const hooksBy = new Map();
  const names = new Set();
  for (const [ln, set] of mentions) {
    let hook = false;
    for (const nm of set) { names.add(nm); if (!inOwn(nm, ln)) { hook = true; hooksBy.set(nm, (hooksBy.get(nm) || 0) + 1); } }
    if (hook) hookLines++;
  }
  const topHooked = [...hooksBy.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  return { namedPatches: names.size, blocks: openers.length, closedBlocks: blocks.filter(b => b.closed).length,
           hookLines, topHooked, blockList: blocks.map(b => ({ name: b.name, from: b.from, to: b.to, closed: b.closed })) };
}

// ---------------------------------------------------------------------------
// THE FILES: the code files on disk, and THE CORE (the big pages and the scripts
// they load by <script src>). The core is what the ratchet holds; it is exact,
// read off the pages' own tags, so it never guesses.
// ---------------------------------------------------------------------------
function listCodeFiles() {
  const out = [];
  for (const f of fs.readdirSync(SLICES)) if (/\.(html|js)$/.test(f)) out.push('slices/' + f);
  for (const f of fs.readdirSync(ENGINE)) if (/\.(html|js)$/.test(f)) out.push('engine/' + f);
  return out.sort();
}
function srcsOf(rel, unit, files) {
  const out = [];
  for (const s of unit.srcs) {
    const r = path.normalize(path.join(path.dirname(rel), s.split(/[?#]/)[0])).replace(/\\/g, '/');
    if (files.includes(r)) out.push(r);
  }
  return out;
}
// A .js file that is a picture or a table, not code: big, and nearly no lines.
function looksLikeData(rel) {
  if (!rel.endsWith('.js')) return false;
  const st = fs.statSync(path.join(ROOT, rel));
  if (st.size < 300000) return false;
  const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  let nl = 0; for (let i = 0; i < t.length; i++) if (t.charCodeAt(i) === 10) nl++;
  return st.size / Math.max(1, nl) > 20000;      // more than 20 KB a line: a data literal
}
function sha(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 12); }
function noCommentsFast(pr) {
  const a = [];
  let s = 0; const k = pr.kind, src = pr.src;
  for (let i = 0; i <= k.length; i++) {
    if (i === k.length || k[i] === 1) { if (i > s) a.push(src.slice(s, i)); while (i < k.length && k[i] === 1) i++; s = i; a.push(' '); }
  }
  return a.join('');
}

// ---------------------------------------------------------------------------
// ONE PAGE: its size, its patch layers, its overrides, its links.
// ---------------------------------------------------------------------------
function pageReport(rel, u, files, readMod, opts) {
  let codeBytes = 0, strBytes = 0, commentBytes = 0;
  for (const pr of u.progs) for (let i = 0; i < pr.kind.length; i++) {
    const k = pr.kind[i]; if (k === 0) codeBytes++; else if (k === 1) commentBytes++; else strBytes++;
  }
  const dataUri = (u.text.match(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]{200,}/g) || []).reduce((a, s) => a + s.length, 0);
  const pl = patchLayers(u);
  // OVERRIDES: a name declared at the top level twice, or a declared name assigned over
  const declared = new Map();
  for (const pr of u.progs) for (const fn of functionsOf(pr)) if (fn.depth === 0) declared.set(fn.name, (declared.get(fn.name) || 0) + 1);
  const loaded = srcsOf(rel, u, files);
  const loadedDecl = new Set();
  for (const r of loaded) { const m = readMod(r); if (m) for (const fn of m.fns) if (fn.depth === 0) loadedDecl.add(fn.name); }
  let redeclared = 0; const redeclaredNames = [];
  for (const [nm, c] of declared) if (c > 1) { redeclared += c - 1; redeclaredNames.push(nm); }
  let assignedOver = 0; const assignedNames = new Map();
  for (const pr of u.progs) for (const a of assignmentsOf(pr)) {
    if (declared.has(a.name) || loadedDecl.has(a.name)) { assignedOver++; assignedNames.set(a.name, (assignedNames.get(a.name) || 0) + 1); }
  }
  // LINKS: the pages it names, and how often it reaches into another frame by name
  const pagesNamed = new Set();
  const re = /BOHEMIA_[A-Z0-9_]+\.html/g; let m;
  for (const pr of u.progs) { const t = noCommentsFast(pr); while ((m = re.exec(t))) if (m[0] !== path.basename(rel)) pagesNamed.add(m[0]); }
  const reA = /\b(?:src|data-src|href)\s*=\s*["']([^"']*BOHEMIA_[A-Z0-9_]+\.html)/g;
  while ((m = reA.exec(u.text))) { const b = path.basename(m[1]); if (b !== path.basename(rel)) pagesNamed.add(b); }
  let parentReach = 0, frameReach = 0, postMsg = 0, globalsSet = new Set();
  for (const pr of u.progs) {
    parentReach += (pr.view.match(/\b(?:parent|top)\.(?!postMessage\b|location\b|document\b)[A-Za-z_$]/g) || []).length;
    frameReach += (pr.view.match(/\bcontentWindow\.(?!postMessage\b|location\b|document\b)[A-Za-z_$]/g) || []).length;
    postMsg += (pr.view.match(/\bpostMessage\s*\(/g) || []).length;
    const rg = /\bwindow\.(__[A-Za-z0-9_$]+)\s*=(?!=)/g; let g;
    while ((g = rg.exec(pr.view))) globalsSet.add(g[1]);
  }
  return {
    bytes: u.bytes, lines: u.lines, inlineScripts: u.progs.length, externalScripts: u.srcs.length,
    codeBytes, commentBytes, stringBytes: strBytes, dataUriBytes: dataUri, dataScriptBytes: u.dataScriptBytes,
    namedPatches: pl.namedPatches, blocks: pl.blocks, closedBlocks: pl.closedBlocks, hookLines: pl.hookLines,
    topHooked: pl.topHooked,
    redeclared, redeclaredNames: redeclaredNames.slice(0, 20),
    assignedOver, assignedOverNames: [...assignedNames.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    overrides: redeclared + assignedOver,
    loads: loaded.length, pagesNamed: [...pagesNamed].sort(), parentReach, frameReach, postMessage: postMsg,
    underscoreGlobals: globalsSet.size,
    generatedFrom: GENERATED[rel] || null,
    blockList: opts.blockList ? pl.blockList : undefined,
  };
}

// ---------------------------------------------------------------------------
// THE COPY CLASSIFIER, pure: bodies is Map(hash -> {name, len, files:Set}),
// CORE a Set of files, srcsOfPage(page) the page's <script src> list.
// ---------------------------------------------------------------------------
function classifyCopies(bodies, CORE, srcsOfPage) {
  // INLINED: a module's bodies carried inside a core page. Counted as (module, page) PAIRS,
  // so adding a function to a module already pasted in costs nothing; pasting a module into
  // one more page costs one. PASTED: a body in two or more core files that no module carries:
  // a hand copy, counted one per extra file. LOADED TWICE: a page that loads a module by
  // <script src> AND carries a pasted copy of it.
  const pairs = new Map();     // "module|page" -> bodies shared
  const pasted = [];
  for (const b of bodies.values()) {
    if (b.files.size < 2) continue;
    const fl = [...b.files];
    const mods = fl.filter(f => f.endsWith('.js'));
    const corePages = fl.filter(f => f.endsWith('.html') && CORE.has(f));
    if (mods.length && corePages.length) {
      for (const mo of mods) for (const pg of corePages) { const k = mo + '|' + pg; pairs.set(k, (pairs.get(k) || 0) + 1); }
    } else if (!mods.length && corePages.length > 1) {
      pasted.push({ name: b.name, len: b.len, files: corePages.sort(), extra: corePages.length - 1 });
    } else if (mods.length > 1 && mods.some(f => CORE.has(f))) {
      pasted.push({ name: b.name, len: b.len, files: mods.sort(), extra: mods.length - 1 });
    }
  }
  // a pair is real when the page carries a fair share of the module, not one shared helper:
  // at least 3 bodies, or the module's only bodies
  const modBodyCount = new Map();
  for (const b of bodies.values()) for (const f of b.files) if (f.endsWith('.js')) modBodyCount.set(f, (modBodyCount.get(f) || 0) + 1);
  const inlined = [];
  for (const [k, n] of pairs) {
    const [mo, pg] = k.split('|');
    const of = modBodyCount.get(mo) || n;
    if (n >= 3 || n === of) inlined.push({ module: mo, page: pg, bodies: n, ofModule: of, alsoLoaded: CORE.has(mo) && (srcsOfPage(pg) || []).some(s => s.endsWith(path.basename(mo))) });
    else pasted.push({ name: '(' + n + ' helper' + (n > 1 ? 's' : '') + ' of ' + path.basename(mo) + ')', len: 0, files: [mo, pg], extra: n });
  }
  inlined.sort((a, b) => b.bodies - a.bodies);
  pasted.sort((a, b) => (b.extra * b.len) - (a.extra * a.len) || b.extra - a.extra);
  const loadedTwice = inlined.filter(x => x.alsoLoaded);
  return {
    inlinedPairs: inlined.length,
    inlinedBodies: inlined.reduce((a, x) => a + x.bodies, 0),
    pastedCopies: pasted.reduce((a, x) => a + x.extra, 0),
    loadedTwice: loadedTwice.length,
    inlined, pasted, loadedTwiceList: loadedTwice,
  };
}

// ---------------------------------------------------------------------------
// THE CENSUS. opts.full also reads the whole site list (tools/bohemia_publish_list.js,
// the one answer to "what can the game load") for the dead-files section; the gate
// does not need it and does not pay its half minute.
// ---------------------------------------------------------------------------
function census(opts) {
  opts = opts || {};
  const t0 = Date.now();
  const files = listCodeFiles();
  const modules = files.filter(f => f.endsWith('.js') && !looksLikeData(f));
  const dataJs = files.filter(f => f.endsWith('.js') && !modules.includes(f));
  // every module read once: its functions and its bodies
  const modCache = new Map();
  function readMod(rel) {
    if (modCache.has(rel)) return modCache.get(rel);
    if (!modules.includes(rel) && !rel.endsWith('.html')) { modCache.set(rel, null); return null; }
    const u = readUnit(rel);
    const fns = []; let code = 0; const tokens = [];
    for (const pr of u.progs) {
      for (const fn of functionsOf(pr)) fns.push(fn);
      for (let i = 0; i < pr.kind.length; i++) if (pr.kind[i] === 0) code++;
      if (opts.tokens) tokens.push(noCommentsFast(pr));
    }
    const rec = { rel, bytes: u.bytes, code, fns, tokens, srcs: u.srcs };
    modCache.set(rel, rec);
    return rec;
  }

  // ---- 1. the biggest code files on disk
  const sizes = files.map(f => ({ file: f, bytes: fs.statSync(path.join(ROOT, f)).size })).sort((a, b) => b.bytes - a.bytes);

  // ---- 2. the five big pages
  const pages = {};
  const pageFns = new Map();
  const CORE = new Set();
  for (const rel of BIG_PAGES) {
    const u = readUnit(rel);
    pages[rel] = pageReport(rel, u, files, readMod, opts);
    const fns = []; for (const pr of u.progs) for (const fn of functionsOf(pr)) fns.push(fn);
    pageFns.set(rel, fns);
    if (!GENERATED[rel]) { CORE.add(rel); for (const r of srcsOf(rel, u, files)) CORE.add(r); }
  }

  // ---- 3. copies. A body (comments out, whitespace folded, MIN_BODY chars or more) is
  // looked up in every module on disk and every big page (the demo is the alpha's cut).
  const bodies = new Map();   // hash -> {name, len, files:Set}
  function addBody(fn, rel) {
    if (fn.len < MIN_BODY) return;
    const h = sha(fn.body);
    if (!bodies.has(h)) bodies.set(h, { name: fn.name, len: fn.len, files: new Set() });
    bodies.get(h).files.add(rel);
  }
  for (const rel of modules) { const m = readMod(rel); for (const fn of m.fns) addBody(fn, rel); }
  for (const [rel, fns] of pageFns) if (!GENERATED[rel]) for (const fn of fns) addBody(fn, rel);
  const copyStats = classifyCopies(bodies, CORE, rel => readUnit(rel).srcs);
  // NAME FORKS inside the core: one name, two bodies, two files (listed, never ratcheted)
  const byName = new Map();
  for (const rel of CORE) {
    const fns = rel.endsWith('.html') ? pageFns.get(rel) : (readMod(rel) || { fns: [] }).fns;
    for (const fn of fns) { if (fn.depth !== 0) continue;
      if (!byName.has(fn.name)) byName.set(fn.name, new Map());
      const bm = byName.get(fn.name); const h = sha(fn.body); if (!bm.has(h)) bm.set(h, new Set()); bm.get(h).add(rel); }
  }
  const forks = [];
  for (const [nm, bm] of byName) {
    const fset = new Set(); for (const s of bm.values()) for (const f of s) fset.add(f);
    if (bm.size > 1 && fset.size > 1) forks.push({ name: nm, versions: bm.size, files: [...fset].sort() });
  }
  forks.sort((a, b) => b.files.length - a.files.length || b.versions - a.versions);

  const out = {
    when: new Date().toISOString(), minBody: MIN_BODY,
    files: { code: files.length, slices: files.filter(f => f.startsWith('slices/')).length, engine: files.filter(f => f.startsWith('engine/')).length,
             modules: modules.length, dataJs: dataJs.length },
    core: [...CORE].sort(),
    coreBytes: [...CORE].reduce((a, f) => a + fs.statSync(path.join(ROOT, f)).size, 0),
    biggest: sizes.slice(0, 25),
    pages,
    totals: {
      blocks: BIG_PAGES.reduce((a, p) => a + pages[p].blocks, 0),
      hookLines: BIG_PAGES.reduce((a, p) => a + pages[p].hookLines, 0),
      namedPatches: BIG_PAGES.reduce((a, p) => a + pages[p].namedPatches, 0),
      overrides: BIG_PAGES.reduce((a, p) => a + pages[p].overrides, 0),
    },
    copies: copyStats,
    forks: { count: forks.length, top: forks.slice(0, 40) },
  };

  // ---- 4. dead code (the full read only)
  if (opts.full) {
    const pl = require('./bohemia_publish_list.js').compute();
    const pub = new Set(pl.files instanceof Set || Array.isArray(pl.files) ? pl.files : Object.keys(pl.files));
    const testNames = new Set();
    for (const dir of ['gates', 'tools']) for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      let t; try { t = fs.readFileSync(path.join(ROOT, dir, f), 'utf8'); } catch (_) { continue; }
      const re = /[\w.-]+\.(?:js|html)\b/g; let m; while ((m = re.exec(t))) testNames.add(path.basename(m[0]));
    }
    // a module a core page carries pasted lives on inside it
    const pastedInto = new Map(); for (const x of copyStats.inlined) if (!pastedInto.has(x.module)) pastedInto.set(x.module, x.page);
    const unpublished = files.filter(f => !pub.has(f));
    const kind = { pasted: [], testsOnly: [], nothing: [] };
    for (const f of unpublished) {
      if (pastedInto.has(f)) kind.pasted.push(f);
      else if (testNames.has(path.basename(f))) kind.testsOnly.push(f);
      else kind.nothing.push(f);
    }
    const bytesOf = arr => arr.reduce((a, f) => a + fs.statSync(path.join(ROOT, f)).size, 0);
    const publishedHtml = files.filter(f => pub.has(f) && f.endsWith('.html'));
    // functions in the core never named again anywhere in the core (an upper bound)
    const tok = new Map(), decl = new Map(), all = [];
    for (const rel of CORE) {
      let texts, fns;
      if (rel.endsWith('.html')) { const u = readUnit(rel); texts = u.progs.map(noCommentsFast); fns = pageFns.get(rel); texts.push(u.text.match(/\bon[a-z]+\s*=\s*["'][^"']*["']/gi)?.join(' ') || ''); }
      else { const m = readMod(rel); if (!m) continue; const u = readUnit(rel); texts = u.progs.map(noCommentsFast); fns = m.fns; }
      for (const t of texts) { const re = /[A-Za-z_$][\w$]*/g; let mm; while ((mm = re.exec(t))) tok.set(mm[0], (tok.get(mm[0]) || 0) + 1); }
      for (const fn of fns) { decl.set(fn.name, (decl.get(fn.name) || 0) + 1); all.push({ file: rel, name: fn.name }); }
    }
    const deadFns = all.filter(d => (tok.get(d.name) || 0) <= (decl.get(d.name) || 1));
    const byFile = new Map(); for (const d of deadFns) byFile.set(d.file, (byFile.get(d.file) || 0) + 1);
    out.dead = {
      unpublished: unpublished.length, unpublishedBytes: bytesOf(unpublished),
      pasted: kind.pasted.length, testsOnly: kind.testsOnly.length, nothing: kind.nothing.length,
      nothingBytes: bytesOf(kind.nothing), pastedList: kind.pasted, testsOnlyList: kind.testsOnly, nothingList: kind.nothing,
      publishedPages: publishedHtml.length, publishedPagesList: publishedHtml,
      coreFunctions: all.length, coreFunctionsNeverNamed: deadFns.length,
      coreDeadByFile: [...byFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15),
      coreDeadSample: deadFns.slice(0, 60).map(d => d.file + ' ' + d.name),
    };
  }
  out.ms = Date.now() - t0;
  return out;
}

module.exports = { census, lexJS, codeView, patchLayers, readUnit, unitFromText, functionsOf, assignmentsOf, pageReport, classifyCopies, sha, BIG_PAGES, MIN_BODY };

if (require.main === module) {
  const want = process.argv.indexOf('--json');
  const full = process.argv.includes('--full') || want > 0;
  const c = census({ blockList: want > 0, full });
  const kb = n => (n / 1024).toFixed(0) + ' KB';
  console.log('THE PUBLISHER\'S READ  (' + c.ms + ' ms)');
  console.log('  code files on disk: ' + c.files.code + ' (slices ' + c.files.slices + ', engine ' + c.files.engine + '); ' + c.files.modules + ' are code modules, ' + c.files.dataJs + ' are data written as .js');
  console.log('  THE CORE (the big pages and the scripts they load): ' + c.core.length + ' files, ' + kb(c.coreBytes));
  console.log('THE FIVE BIG PAGES');
  for (const p of BIG_PAGES) {
    const x = c.pages[p];
    console.log('  ' + path.basename(p).padEnd(30) + ' ' + kb(x.bytes).padStart(8) + ' ' + String(x.lines).padStart(6) + ' lines  code ' + kb(x.codeBytes).padStart(7) +
      '  patches ' + String(x.namedPatches).padStart(4) + '  blocks ' + String(x.blocks).padStart(4) + '  hooks ' + String(x.hookLines).padStart(4) +
      '  overrides ' + String(x.overrides).padStart(3) + '  loads ' + String(x.loads).padStart(3) + (x.generatedFrom ? '  (cut of the alpha)' : ''));
  }
  console.log('  TOTAL blocks ' + c.totals.blocks + ', hook lines ' + c.totals.hookLines + ', overrides ' + c.totals.overrides);
  console.log('COPIES (bodies of ' + c.minBody + '+ chars):');
  console.log('  INLINED: ' + c.copies.inlinedPairs + ' (module, page) pairs, ' + c.copies.inlinedBodies + ' bodies carried twice; LOADED TWICE (by src and pasted): ' + c.copies.loadedTwice);
  for (const x of c.copies.inlined.slice(0, 8)) console.log('    ' + x.module + ' -> ' + path.basename(x.page) + ': ' + x.bodies + ' of ' + x.ofModule + ' bodies');
  console.log('  PASTED (a hand copy, no module carries it): ' + c.copies.pastedCopies);
  for (const x of c.copies.pasted.slice(0, 8)) console.log('    ' + x.name + (x.len ? ' (' + x.len + ' chars)' : '') + ': ' + x.files.map(f => path.basename(f)).join(', '));
  console.log('NAME FORKS in the core (one name, different bodies, two files): ' + c.forks.count);
  if (c.dead) {
    console.log('NOT PUBLISHED (the site list, tools/bohemia_publish_list.js): ' + c.dead.unpublished + ' code files, ' + kb(c.dead.unpublishedBytes) + ': ' +
      c.dead.pasted + ' live on pasted in a page, ' + c.dead.testsOnly + ' named only by gates or tools, ' + c.dead.nothing + ' named by nothing (' + kb(c.dead.nothingBytes) + ')');
    console.log('  published pages: ' + c.dead.publishedPages + '; core functions never named again: ' + c.dead.coreFunctionsNeverNamed + ' of ' + c.dead.coreFunctions);
  }
  if (want > 0) { fs.writeFileSync(path.resolve(process.argv[want + 1]), JSON.stringify(c, null, 1)); console.log('wrote ' + process.argv[want + 1]); }
}
