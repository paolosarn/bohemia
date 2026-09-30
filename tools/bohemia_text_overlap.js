/* NO TWO TEXTS ON TOP OF EACH OTHER (PLUMBER 9/30/26, row [no overlap], rule 44c)
   ================================================================================
   Paolo 9/29: "for the demo, keep in mind when texts are overlapping each other, I
   don't know why it's so difficult for you to understand." Said more than once.

   What this reads, on whatever the one driver is showing right now:
     - EVERY VISIBLE DOM TEXT, in the shell and in every visible frame: one box per
       line of text (a Range's client rects), clipped by any ancestor that clips
       (overflow), skipped when it or an ancestor is display:none, visibility:hidden,
       opacity 0, or its colour is fully transparent.
     - EVERY TEXT DRAWN ON A CANVAS that is on the page: fillText and strokeText are
       wrapped before any page script runs (the driver's `arm`), so the draw's own
       text, position, alignment, baseline, measured width and the canvas transform are
       recorded; the box is mapped from canvas pixels to the page. Only draws on a
       canvas that is in the document count (sprite scratch canvases are not text on
       the screen), and only draws from the last quarter second (what is on screen now).
   What it refuses:
     - OVERLAP: two texts from different elements (or two canvas draws) whose boxes
       cross by at least 2 px each way AND at least a quarter of the shorter one's
       height. Tight line spacing inside one paragraph is not an overlap; two labels
       printed through each other is.
     - COVERED: a text whose middle, asked of the page the way a finger asks it
       (elementFromPoint, in the shell and then inside the frame), lands on a different
       element that PAINTS: a background at least half opaque, a picture, a canvas or
       an SVG. An invisible overlay is not a panel and is not counted.
   What it cannot see, stated: text drawn on a scratch canvas and then copied to the
   screen as a picture; an overlay that ignores the finger (pointer-events: none) and
   paints over a text; a canvas drawing that paints over its own earlier text.

   node tools/bohemia_text_overlap.js      the demo and the alpha, every surface reachable
   require(...)  { ARM, measure, overlaps, planted }
   ================================================================================ */
'use strict';
const path = require('path');

/* Runs in EVERY document before its scripts (driver opts.arm). */
const ARM = `(() => {
  if (window.__TXT_HOOKED) return; window.__TXT_HOOKED = true;
  window.__TXT_DRAWS = [];
  const P = CanvasRenderingContext2D.prototype;
  const wrap = (name) => { const orig = P[name]; if (!orig) return;
    P[name] = function (text, x, y) {
      try {
        const c = this.canvas;
        if (c && c.isConnected && text != null && String(text).trim()) {
          const m = this.measureText(String(text));
          const t = this.getTransform();
          if (!c.__txtId) c.__txtId = 'c' + Math.random().toString(36).slice(2, 8);
          window.__TXT_DRAWS.push({ at: performance.now(), cid: c.__txtId, text: String(text).slice(0, 40),
            x: +x, y: +y, align: this.textAlign, base: this.textBaseline, w: m.width,
            asc: m.actualBoundingBoxAscent || 0, desc: m.actualBoundingBoxDescent || 0,
            t: [t.a, t.b, t.c, t.d, t.e, t.f] });
          if (window.__TXT_DRAWS.length > 4000) window.__TXT_DRAWS.splice(0, 2000);
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    }; };
  wrap('fillText'); wrap('strokeText');
})();`;

/* Runs INSIDE one document. Returns its texts in that document's viewport pixels. */
function collect(windowMs) {
  const out = [];
  const vw = innerWidth, vh = innerHeight;
  const hidden = (el) => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return true; } return false; };
  const clipOf = (el) => { let r = { l: 0, t: 0, r: vw, b: vh };
    for (let e = el.parentElement; e && e.nodeType === 1; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (/(hidden|auto|scroll|clip)/.test(s.overflow + s.overflowX + s.overflowY)) {
        const b = e.getBoundingClientRect();
        r = { l: Math.max(r.l, b.left), t: Math.max(r.t, b.top), r: Math.min(r.r, b.right), b: Math.min(r.b, b.bottom) };
      } }
    return r; };
  const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
    + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  let k = 0;
  const w = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const text = (n.nodeValue || '').replace(/\s+/g, ' ').trim();
    const el = n.parentElement;
    if (!text || !el || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|OPTION|TITLE)$/.test(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(cs.color)) continue;
    if (hidden(el)) continue;
    const clip = clipOf(el);
    const rg = document.createRange(); rg.selectNodeContents(n);
    const id = 'd' + (k++);
    el.__txtKey = el.__txtKey || ('e' + Math.random().toString(36).slice(2, 8));
    for (const b of rg.getClientRects()) {
      const l = Math.max(b.left, clip.l), t = Math.max(b.top, clip.t);
      const r = Math.min(b.right, clip.r), bt = Math.min(b.bottom, clip.b);
      if (r - l < 1 || bt - t < 1) continue;
      out.push({ kind: 'dom', id, owner: el.__txtKey, el: name(el), text: text.slice(0, 40), x: l, y: t, w: r - l, h: bt - t });
    }
  }
  /* canvas draws from the last windowMs, on canvases in this document */
  const now = performance.now();
  const byId = {};
  for (const c of document.querySelectorAll('canvas')) if (c.__txtId) byId[c.__txtId] = c;
  const seen = new Set();
  const canvasBoxes = [];
  for (const d of (window.__TXT_DRAWS || [])) {
    if (now - d.at > windowMs) continue;
    const c = byId[d.cid]; if (!c || hidden(c)) continue;
    const key = d.cid + '|' + d.text + '|' + Math.round(d.x) + '|' + Math.round(d.y);
    if (seen.has(key)) continue; seen.add(key);
    let x0 = d.x; if (d.align === 'center') x0 -= d.w / 2; else if (d.align === 'right' || d.align === 'end') x0 -= d.w;
    const hgt = (d.asc + d.desc) || 10;
    let y0 = d.y - d.asc;
    if (d.base === 'top' || d.base === 'hanging') y0 = d.y; else if (d.base === 'middle') y0 = d.y - hgt / 2;
    else if (d.base === 'bottom' || d.base === 'ideographic') y0 = d.y - hgt;
    const [a, b, cc, dd, e, f] = d.t;
    const pts = [[x0, y0], [x0 + d.w, y0], [x0, y0 + hgt], [x0 + d.w, y0 + hgt]].map(([px, py]) => [a * px + cc * py + e, b * px + dd * py + f]);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const r = c.getBoundingClientRect(), sx = r.width / c.width, sy = r.height / c.height;
    const l = r.left + Math.min(...xs) * sx, t = r.top + Math.min(...ys) * sy;
    const R = r.left + Math.max(...xs) * sx, B = r.top + Math.max(...ys) * sy;
    const L2 = Math.max(l, r.left, 0), T2 = Math.max(t, r.top, 0), R2 = Math.min(R, r.right, vw), B2 = Math.min(B, r.bottom, vh);
    if (R2 - L2 < 1 || B2 - T2 < 1) continue;
    /* ONE LABEL, NOT NINE. Measured 9/30: the map draws "HOME" nine times one pixel apart
       (eight offsets make the outline, the ninth is the word). Same canvas, same text,
       within 3 px is the same label; its box is the union. */
    const same = canvasBoxes.find(o => o.cid === d.cid && o.text === d.text && Math.abs(o.x - L2) <= 3 && Math.abs(o.y - T2) <= 3);
    if (same) { const r2 = Math.max(same.x + same.w, R2), b2 = Math.max(same.y + same.h, B2);
      same.x = Math.min(same.x, L2); same.y = Math.min(same.y, T2); same.w = r2 - same.x; same.h = b2 - same.y; continue; }
    canvasBoxes.push({ kind: 'canvas', id: 'k' + (k++), cid: d.cid, owner: d.cid + '|' + d.text + '|' + Math.round(L2) + '|' + Math.round(T2),
      el: 'canvas' + (c.id ? '#' + c.id : ''), text: d.text, x: L2, y: T2, w: R2 - L2, h: B2 - T2 });
  }
  return out.concat(canvasBoxes);
}

/* WHAT PAINTS OVER A TEXT, at the point asked. Shared by both page-side questions.
   A canvas paints where ITS PIXEL is opaque (a see-through canvas over a label is not a
   panel); an SVG paints only if it has a solid background, because the phone's CRACKS are
   an SVG of thin lines over the feed, and calling the whole drawing a panel hid all 24
   feed lines from this checker on 9/30 (26 texts read as 2). A picture paints. Anything
   else paints when its background colour is at least half opaque, or its background is
   a picture, or a gradient with at least one colour half opaque. */
const PAINTS_SRC = `(e, x, y) => { if (!e || e.nodeType !== 1) return false;
  const tag = e.tagName.toUpperCase();
  if (tag === 'CANVAS') { try { const g = e.getContext('2d'); if (!g) return true;
      const r = e.getBoundingClientRect(); const px = Math.floor((x - r.left) * e.width / r.width), py = Math.floor((y - r.top) * e.height / r.height);
      if (px < 0 || py < 0 || px >= e.width || py >= e.height) return false;
      return g.getImageData(px, py, 1, 1).data[3] >= 128; } catch (err) { return true; } }
  const s = getComputedStyle(e);
  const bgA = (() => { const m = /rgba?\\(([^)]+)\\)/.exec(s.backgroundColor); if (!m) return 0; const p = m[1].split(',').map(Number); return p.length < 4 ? 1 : p[3]; })();
  if (tag === 'SVG') return bgA >= 0.5;
  if (tag === 'IMG' || tag === 'VIDEO') return true;
  /* A GRADIENT PAINTS ONLY IF ONE OF ITS COLOURS IS HALF OPAQUE. The phone's glass is a
     sheen from rgba(255,255,255,0) laid over the whole feed; counting it solid hid the
     feed from this checker a second time on 9/30. A picture (url) paints. */
  if (s.backgroundImage && s.backgroundImage !== 'none') {
    if (/url\\(/.test(s.backgroundImage)) return true;
    const cols = s.backgroundImage.match(/rgba?\\([^)]*\\)/g) || [];
    const maxA = cols.reduce((mx, c) => { const p = c.slice(c.indexOf('(') + 1, -1).split(',').map(Number);
      return Math.max(mx, p.length < 4 ? 1 : p[3]); }, 0);
    if (maxA >= 0.5) return true;
  }
  return bgA >= 0.5; }`;

/* Runs INSIDE one document. For each box, at five points along its middle line: is the
   text ON TOP here (true) or UNDER something that paints (false)?
   "Something that paints" is judged on the whole stack between the finger's hit and the
   text, not the hit alone. Measured 9/30: on the alpha's loading screen the hit over a
   hidden tab was the splash's title letters, which have no background; the splash panel
   holding them does. Asking only the top element called the tab visible and the title
   "overlapping" it, on a screen where the glass shows no tab at all. */
function coveredIn(arg) {
  const boxes = arg.boxes; const PAINTS = eval('(' + arg.paints + ')');
  const paints = PAINTS;
  /* the painting element between hit and the text, or null if the text is on top */
  /* EVERY ELEMENT TAKES THE FINGER FOR THE QUESTION. elementFromPoint skips anything with
     pointer-events: none, both the label (then it answers with what is under the label)
     and a panel that lets taps through (then it misses the panel). UI said it on its
     own row: a hit test "cannot tell covered from click-through". One style rule for the
     length of the question makes the answer the painted stack, not the tap stack. */
  const st = document.createElement('style'); st.textContent = '*{pointer-events:auto!important}';
  (document.head || document.documentElement).appendChild(st);
  const coverAt = (x, y, own, isCanvas) => {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return null;
    if (own && (own === hit || own.contains(hit))) return null;
    for (let e = hit; e && e.nodeType === 1; e = e.parentElement) {
      if (own && e.contains(own)) return null;        /* reached a box that holds the text: nothing painted over it */
      if (isCanvas && own === e) return null;
      if (paints(e, x, y) && !(isCanvas && e === own)) return e;
    }
    return null;
  };
  const res = [];
  for (const bx of boxes) {
    let own = null;
    if (bx.kind === 'canvas') { for (const c of document.querySelectorAll('canvas')) if (c.__txtId === bx.cid) { own = c; break; } }
    else for (const e of document.querySelectorAll('*')) if (e.__txtKey === bx.owner) { own = e; break; }
    const pts = [0.1, 0.3, 0.5, 0.7, 0.9].map(f => [bx.x + bx.w * f, bx.y + bx.h / 2]);
    const cov = pts.map(([x, y]) => coverAt(x, y, own, bx.kind === 'canvas'));
    const by = cov.find(Boolean);
    res.push({ on: cov.map(c => !c), by: by ? by.tagName.toLowerCase() + (by.id ? '#' + by.id : '') : null });
  }
  st.remove();
  return res;
}

/* Runs in the SHELL: for texts inside a frame, is the shell painting over them? */
function shellOver(arg) {
  const pts = arg.pts; const PAINTS = eval('(' + arg.paints + ')');
  const paints = PAINTS;
  const st = document.createElement('style'); st.textContent = '*{pointer-events:auto!important}';
  (document.head || document.documentElement).appendChild(st);
  const out = pts.map(([x, y, frameName]) => {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return null;
    for (let e = hit; e && e.nodeType === 1; e = e.parentElement) {
      if (e.tagName === 'IFRAME') return null;
      if (e.querySelector && [...e.querySelectorAll('iframe')].some(f => f.name === frameName || f.id === frameName)) return null;
      if (paints(e, x, y)) return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '');
    }
    return null;
  });
  st.remove();
  return out;
}

/* pure: which pairs cross */
function overlaps(all) {
  const bad = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const A = all[i], B = all[j];
    if (A.owner === B.owner && A.doc === B.doc) continue;
    const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
    const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
    if (ox >= 2 && oy >= 2 && oy >= 0.25 * Math.min(A.h, B.h)) bad.push([A, B, Math.round(ox), Math.round(oy)]);
  }
  return bad;
}

/* One reading of everything the page shows now: the shell and each visible frame,
   in shell coordinates; then overlaps and covered texts. */
async function measure(page, label, windowMs) {
  windowMs = windowMs || 250;
  await page.waitForTimeout(300);
  const docs = [{ frame: page.mainFrame(), off: { x: 0, y: 0 }, name: 'shell' }];
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    let box = null; try { box = await (await f.frameElement()).boundingBox(); } catch (e) {}
    if (!box || box.width < 40 || box.height < 40) continue;
    docs.push({ frame: f, off: { x: box.x, y: box.y }, name: (f.name() || f.url().split('/').pop() || 'frame').slice(0, 30), box });
  }
  const all = [], covered = [], errors = [];
  for (const dc of docs) {
    let got = []; try { got = await dc.frame.evaluate(collect, windowMs); } catch (e) { continue; }
    /* a frame's own text only shows where the frame shows */
    if (dc.box) got = got.filter(t => t.x + t.w > 0 && t.y + t.h > 0 && t.x < dc.box.width && t.y < dc.box.height);
    let cov = []; try { cov = await dc.frame.evaluate(coveredIn, { boxes: got, paints: PAINTS_SRC }); } catch (e) {
      /* NEVER A QUIET PASS: if the covered question cannot be asked, say so and fail */
      errors.push(dc.name + ': the covered test could not run (' + String(e.message || e).slice(0, 100) + ')');
      cov = got.map(() => ({ on: [1, 1, 1, 1, 1], by: null })); }
    let shell = null;
    if (dc.name !== 'shell' && got.length) {
      const pts = []; got.forEach(t => [0.1, 0.3, 0.5, 0.7, 0.9].forEach(f =>
        pts.push([t.x + dc.off.x + t.w * f, t.y + dc.off.y + t.h / 2, dc.frame.name()])));
      try { shell = await page.evaluate(shellOver, { pts, paints: PAINTS_SRC }); } catch (e) { shell = null; errors.push('shell over ' + dc.name + ': could not run (' + String(e.message || e).slice(0, 100) + ')'); }
    }
    got.forEach((t, i) => {
      const g = Object.assign({}, t, { doc: dc.name, x: t.x + dc.off.x, y: t.y + dc.off.y });
      const on = cov[i].on.map((v, q) => v && !(shell && shell[i * 5 + q]));
      const by = cov[i].by || (shell && shell.slice(i * 5, i * 5 + 5).find(Boolean) ? shell.slice(i * 5, i * 5 + 5).find(Boolean) + ' (shell)' : null);
      const shown = on.filter(Boolean).length;
      /* ALL FIVE POINTS UNDER: the text is not on screen (a loading screen, a closed
         panel), so it is neither covered nor overlapping. SOME: the player sees a text
         cut off by a panel -- that is the defect. NONE: on show. */
      if (shown === 0) return;
      all.push(g);
      if (shown < on.length) { g.covered = by; covered.push([g, by]); }
    });
  }
  /* THE GLASS, for every surface with a red: rule 14, never report a break not seen.
     BOHEMIA_OVERLAP_SHOTS=<dir> saves the whole screen beside the numbers. */
  if (process.env.BOHEMIA_OVERLAP_SHOTS) {
    try { const fs = require('fs'); fs.mkdirSync(process.env.BOHEMIA_OVERLAP_SHOTS, { recursive: true });
      await page.screenshot({ path: path.join(process.env.BOHEMIA_OVERLAP_SHOTS, label.replace(/[^a-z0-9]+/gi, '_').slice(0, 60) + '.png') }); } catch (e) {}
  }
  const shown = all;
  return { label, texts: shown, overlaps: overlaps(shown.filter(t => !t.covered)), covered, errors };
}

const show = (t) => '"' + t.text + '" (' + t.doc + ' ' + t.el + ' at ' + Math.round(t.x) + ',' + Math.round(t.y) + ' ' + Math.round(t.w) + 'x' + Math.round(t.h) + ')';
function report(m) {
  const lines = [m.label + ': ' + m.texts.length + ' texts (' + m.texts.filter(t => t.kind === 'canvas').length
    + ' drawn on a canvas), ' + m.overlaps.length + ' overlapping pair(s), ' + m.covered.length + ' covered'];
  m.overlaps.slice(0, 12).forEach(([A, B, ox, oy]) => lines.push('   OVERLAP ' + show(A) + '  x  ' + show(B) + '  by ' + ox + 'x' + oy + ' px'));
  m.covered.slice(0, 12).forEach(([A, by]) => lines.push('   COVERED ' + show(A) + '  under ' + by));
  (m.errors || []).forEach(e => lines.push('   COULD NOT MEASURE ' + e));
  return lines.join('\n');
}

/* The surfaces reachable through the one driver today. The loading screen is read
   before the door opens (beforeTap). */
async function readSurfaces(open, which, extra) {
  const out = [];
  const d = await open(Object.assign({ arm: ARM,
    beforeTap: async (page) => { try { out.push(await measure(page, which + ' loading screen')); } catch (e) {} } },
    which === 'alpha' ? { alpha: true } : {}));
  try {
    await d.page.waitForTimeout(1500);
    const s0 = await d.state();
    out.push(await measure(d.page, which + ' first screen after the door (' + s0.mode + ', czoom ' + s0.czoom + ')'));
    if (typeof extra === 'function') { try { for (const m of (await extra(d, which)) || []) out.push(m); } catch (e) {
      out.push({ label: which + ' planted case FAILED TO RUN: ' + String(e.message || e).slice(0, 120), texts: [], overlaps: [], covered: [], broken: true }); } }
    if (!(s0.mode === 'city')) {
      for (let i = 0; i < 4; i++) { if ((await d.state()).mode === 'city') break; await d.pinchOut(); }
      await d.page.waitForTimeout(1200);
      const s1 = await d.state();
      out.push(await measure(d.page, which + ' the map, opening zoom (czoom ' + s1.czoom + ')'));
    }
    await d.toMap(); await d.page.waitForTimeout(1200);
    out.push(await measure(d.page, which + ' the map, far stop'));
  } finally { await d.close(); }
  return out;
}

module.exports = { ARM, PAINTS_SRC, collect, coveredIn, overlaps, measure, report, readSurfaces };

if (require.main === module) {
  const { open } = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
  (async () => {
    for (const which of ['demo', 'alpha']) {
      const ms = await readSurfaces(open, which);
      for (const m of ms) console.log(report(m));
    }
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
