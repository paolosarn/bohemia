#!/usr/bin/env python3
"""THE FIRST-LOAD HUNKS (PLUMBER 10/9/26, row [first load], rounds 1 and 2; rule 66a).

PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."

Six exact hunks for the page RUN owns (the alpha; the demo is cut from it). This lane may not edit
slices/ (ONE SYSTEM ONE SESSION), so the hunks live here and RUN runs this, once, on its own file:

    python3 tools/bohemia_first_load_hunks.py                  # dry run on the alpha: says what applies
    python3 tools/bohemia_first_load_hunks.py --write          # apply to slices/BOHEMIA_ALPHA_0_9.html
    python3 tools/bohemia_first_load_hunks.py --only "bind once" --write
    python3 tools/bohemia_first_load_hunks.py --in A --out B   # a copy, for measuring (how PLUMBER measured)

Each hunk's OLD text must sit in the file exactly once, or its NEW text must already be there (then it
is skipped, so running twice is safe). Anything else refuses the whole run and writes nothing.

[load patch] (round 1, records/BOHEMIA_WHY_THE_DEMO_MAKES_A_PHONE_WAIT_10_9_26.md): the tile warm-up and
  the build watcher; 29.7 MB -> 9.0 MB downloaded before NEW GAME at phone speed, nothing twice.
[bind once] (round 2, records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md): the skinner's
  bind, the boot's biggest single cost. Bit for bit the same binding (fuzzed 1,600 cases; compared on all
  1,256 binds of a real boot, and every one of the 1,082 cache hits re-bound fresh and compared): the
  demo's own work in the boot 13.0 s -> 6.8 s at full speed; NEW GAME ready 21.3 s -> 16.5 s.
The rig's lane (ANIMATION) owns what the skinner draws; nothing it draws changes, which is the point.
"""
import argparse, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HUNKS = [
    ('load patch', 'the tile warm-up stands down when the city frame is already in the page',
r'''var begin=function(){ if(started)return; started=true; step(); };''',
r'''var begin=function(){ if(started)return; started=true; if(document.getElementById('cityFrame'))return; step(); };'''),
    ('load patch', 'the build watcher reads until the stamp and stops',
r'''  function check(){ fetch(location.href,{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
      var m=t.match(/id="buildstamp"[^>]*>([^<]+)</); if(!m)return;
      if(cur&&m[1]!==cur)show(m[1]); }).catch(function(){}); }
''',
r'''  function found(t){ var m=t.match(/id="buildstamp"[^>]*>([^<]+)</); if(!m)return; if(cur&&m[1]!==cur)show(m[1]); }
  /* READ UNTIL THE STAMP AND STOP (PLUMBER 10/9, [load patch]): the stamp sits 290 KB into a 6.3 MB
     page, and reading the whole page cost 2.4 MB on cell data 15 s in and every 2 minutes after. */
  function check(){ fetch(location.href,{cache:'no-store'}).then(function(r){
      if(!r.body||!r.body.getReader) return r.text().then(found);
      var rd=r.body.getReader(), dec=new TextDecoder(), buf='';
      var pump=function(){ return rd.read().then(function(x){
        if(x.done) return found(buf);
        buf+=dec.decode(x.value,{stream:true});
        if(/id="buildstamp"[^>]*>[^<]+</.test(buf)){ try{rd.cancel();}catch(_e){} return found(buf); }
        if(buf.length>2000000){ try{rd.cancel();}catch(_e){} return; }
        return pump(); }); };
      return pump(); }).catch(function(){}); }
'''),
    ('bind once', 'cohereBind without an object per pixel (bit for bit the same)',
r'''function cohereBind(L, bo) {
  for (let pass = 0; pass < 2; pass++) {
    const nb = Int8Array.from(bo);
    for (let i = 0; i < CW*CH; i++) {
      if (!L[i]) continue;
      const x = i % CW, y = (i / CW) | 0;
      const cnt = {}; let cur = bo[i], curN = 0;
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
        if (!dx && !dy) continue;
        const nx=x+dx, ny=y+dy;
        if (nx<0||nx>=CW||ny<0||ny>=CH) continue;
        const jj = ny*CW+nx; if (!L[jj]) continue;
        const b = bo[jj]; cnt[b]=(cnt[b]||0)+1; if (b===cur) curN++;
      }
      let bb=cur, bn=curN;
      for (const k in cnt) { if (cnt[k] > bn+1) { bn=cnt[k]; bb=+k; } }
      if (bb!==cur && bn>=3) nb[i]=bb;
    }
    bo.set(nb);
  }
  const seen = new Uint8Array(CW*CH);
  for (let i = 0; i < CW*CH; i++) {
    if (!L[i] || seen[i]) continue;
    const b0 = bo[i]; const comp=[]; const st=[i]; seen[i]=1; const adj={};
    while (st.length) {
      const c = st.pop(); comp.push(c);
      const cx=c%CW, cy=(c/CW)|0;
      for (const [nx,ny] of [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]]) {
        if (nx<0||nx>=CW||ny<0||ny>=CH) continue;
        const jj=ny*CW+nx; if (!L[jj]) continue;
        if (bo[jj]===b0) { if (!seen[jj]) { seen[jj]=1; st.push(jj); } }
        else adj[bo[jj]]=(adj[bo[jj]]||0)+1;
      }
    }
    if (comp.length < 4) {
      let bb=-2, bn=0;
      for (const k in adj) { if (adj[k]>bn) { bn=adj[k]; bb=+k; } }
      if (bb>-2) for (const c of comp) bo[c]=bb;
    }
  }
}
''',
r'''/* SAME BINDING, NO OBJECT PER PIXEL (PLUMBER 10/9, row [first load] round 2, a review patch for RUN
   and ANIMATION: records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md). The boot profile put
   this function first: 4.4 of 25 s at full speed, because it built a fresh {} and walked it with for-in
   for every painted pixel of every part of every direction of every body the street cast bakes. The
   counts now live in two small typed arrays. THE RESULT IS BIT FOR BIT THE SAME: a for-in walks integer
   keys ascending and then the negative ones in the order they were met, and the ">" in the vote lets
   that order break ties, so the same order is walked here by hand (checked against the old function
   on every body the demo bakes: records/ above). */
const _COHERE = { kv: new Int32Array(256), kc: new Int32Array(256), nb: null, seen: null, st: null, comp: null, pix: null };
function cohereBind(L, bo) {
  const N = CW*CH, kv = _COHERE.kv, kc = _COHERE.kc;
  if (!_COHERE.nb || _COHERE.nb.length !== N) {
    _COHERE.nb = new Int8Array(N); _COHERE.seen = new Uint8Array(N);
    _COHERE.st = new Int32Array(N); _COHERE.comp = new Int32Array(N); _COHERE.pix = new Int32Array(N);
  }
  const nb = _COHERE.nb, pix = _COHERE.pix;
  let np = 0; for (let i = 0; i < N; i++) if (L[i]) pix[np++] = i;   /* the painted pixels, in scan order */
  for (let pass = 0; pass < 2; pass++) {
    nb.set(bo);
    for (let q = 0; q < np; q++) {
      const i = pix[q];
      const x = i % CW, y = (i / CW) | 0;
      const cur = bo[i]; let curN = 0, nk = 0;
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) {
        if (!dx && !dy) continue;
        const nx=x+dx, ny=y+dy;
        if (nx<0||nx>=CW||ny<0||ny>=CH) continue;
        const jj = ny*CW+nx; if (!L[jj]) continue;
        const b = bo[jj]; let t = 0; while (t < nk && kv[t] !== b) t++;
        if (t === nk) { kv[nk] = b; kc[nk] = 0; nk++; }
        kc[t]++; if (b===cur) curN++;
      }
      let bb=cur, bn=curN;
      for (let last = -1;;) {
        let m = -1, mt = -1;
        for (let t = 0; t < nk; t++) { const v = kv[t]; if (v > last && (mt < 0 || v < m)) { m = v; mt = t; } }
        if (mt < 0) break;
        if (kc[mt] > bn+1) { bn=kc[mt]; bb=m; }
        last = m;
      }
      for (let t = 0; t < nk; t++) if (kv[t] < 0 && kc[t] > bn+1) { bn=kc[t]; bb=kv[t]; }
      if (bb!==cur && bn>=3) nb[i]=bb;
    }
    bo.set(nb);
  }
  const seen = _COHERE.seen, st = _COHERE.st, comp = _COHERE.comp;
  seen.fill(0);
  for (let r = 0; r < np; r++) {
    const i = pix[r]; if (seen[i]) continue;
    const b0 = bo[i]; let sp = 0, cn = 0, nk = 0;
    st[sp++] = i; seen[i]=1;
    while (sp) {
      const c = st[--sp]; comp[cn++] = c;
      const cx=c%CW, cy=(c/CW)|0;
      for (let q = 0; q < 4; q++) {
        const nx = q===0 ? cx-1 : q===1 ? cx+1 : cx, ny = q===2 ? cy-1 : q===3 ? cy+1 : cy;
        if (nx<0||nx>=CW||ny<0||ny>=CH) continue;
        const jj=ny*CW+nx; if (!L[jj]) continue;
        const b = bo[jj];
        if (b===b0) { if (!seen[jj]) { seen[jj]=1; st[sp++]=jj; } }
        else { let t = 0; while (t < nk && kv[t] !== b) t++; if (t === nk) { kv[nk] = b; kc[nk] = 0; nk++; } kc[t]++; }
      }
    }
    if (cn < 4) {
      let bb=-2, bn=0;
      for (let last = -1;;) {
        let m = -1, mt = -1;
        for (let t = 0; t < nk; t++) { const v = kv[t]; if (v > last && (mt < 0 || v < m)) { m = v; mt = t; } }
        if (mt < 0) break;
        if (kc[mt] > bn) { bn=kc[mt]; bb=m; }
        last = m;
      }
      for (let t = 0; t < nk; t++) if (kv[t] < 0 && kc[t] > bn) { bn=kc[t]; bb=kv[t]; }
      if (bb>-2) for (let q = 0; q < cn; q++) bo[comp[q]]=bb;
    }
  }
}
'''),
    ('bind once', '_rebind reads each bone once per part (bit for bit the same)',
r'''  _rebind() {
    const R = this.rest;
    const bb = {};
    for (let p = 1; p <= NP; p++) {
      const L = this.layers[p], bo = this.bone[p], cs = this.candFor(p);
      for (let i = 0; i < CW*CH; i++) {
        if (!L[i]) { bo[i] = -1; continue; }
        const x = i % CW, y = (i / CW) | 0;
        let best = -1, bd = 1e9;
        for (let k = 0; k < cs.length; k++) {
          const bn = cs[k], a = R[BONES[bn][0]], b = R[BONES[bn][1]];
          const d = segd(x+.5, y+.5, a, b);
          if (d < bd) { bd = d; best = BKEYS.indexOf(bn); }
        }
        bo[i] = best;
      }
      cohereBind(L, bo);
      for (let i = 0; i < CW*CH; i++) {
        if (!L[i]) continue;
        const x = i % CW, y = (i / CW) | 0, best = bo[i];
        if (best >= 0) {
          const key = p+':'+best, e = bb[key];
          if (!e) bb[key] = [x,y,x,y];
          else { if(x<e[0])e[0]=x; if(y<e[1])e[1]=y; if(x>e[2])e[2]=x; if(y>e[3])e[3]=y; }
        }
      }
    }
    this.bbox = bb;
  }

''',
r'''  _rebind() {
    /* SAME BINDING, LESS WORK PER PIXEL (PLUMBER 10/9, [first load] round 2, review patch): each
       candidate bone's segment and key index are read ONCE per part, on its first painted pixel,
       instead of once per pixel per bone; the distance is segd's own arithmetic in segd's own order,
       so every pixel picks the same bone. The boxes are kept per bone and written in the order the
       bones are first met, which is the order the old string keys went in. */
    const R = this.rest;
    const bb = {};
    for (let p = 1; p <= NP; p++) {
      const L = this.layers[p], bo = this.bone[p], cs = this.candFor(p);
      let nc = -1, sx = null, sy = null, sdx = null, sdy = null, sl2 = null, sk = null;
      for (let i = 0; i < CW*CH; i++) {
        if (!L[i]) { bo[i] = -1; continue; }
        if (nc < 0) {
          nc = cs.length; sx = new Float64Array(nc); sy = new Float64Array(nc); sdx = new Float64Array(nc);
          sdy = new Float64Array(nc); sl2 = new Float64Array(nc); sk = new Int32Array(nc);
          for (let k = 0; k < nc; k++) {
            const bn = cs[k], a = R[BONES[bn][0]], b = R[BONES[bn][1]];
            const ax=a[0]+.5, ay=a[1]+.5, bx=b[0]+.5, by=b[1]+.5;
            const dx=bx-ax, dy=by-ay;
            sx[k]=ax; sy[k]=ay; sdx[k]=dx; sdy[k]=dy; sl2[k]=dx*dx+dy*dy; sk[k]=BKEYS.indexOf(bn);
          }
        }
        const x = i % CW, y = (i / CW) | 0, px = x+.5, py = y+.5;
        let best = -1, bd = 1e9;
        for (let k = 0; k < nc; k++) {
          const ax = sx[k], ay = sy[k], dx = sdx[k], dy = sdy[k], L2 = sl2[k];
          let t = L2 ? ((px-ax)*dx+(py-ay)*dy)/L2 : 0;
          t = t<0?0:t>1?1:t;
          const cx=ax+t*dx, cy=ay+t*dy;
          const d = (px-cx)**2 + (py-cy)**2;
          if (d < bd) { bd = d; best = sk[k]; }
        }
        bo[i] = best;
      }
      cohereBind(L, bo);
      const box = new Int32Array(1024), met = new Uint8Array(256), order = [];
      for (let i = 0; i < CW*CH; i++) {
        if (!L[i]) continue;
        const x = i % CW, y = (i / CW) | 0, best = bo[i];
        if (best >= 0) {
          const o = best*4;
          if (!met[best]) {
            met[best] = 1; order.push(best); box[o]=x; box[o+1]=y; box[o+2]=x; box[o+3]=y;
          } else { if(x<box[o])box[o]=x; if(y<box[o+1])box[o+1]=y; if(x>box[o+2])box[o+2]=x; if(y>box[o+3])box[o+3]=y; }
        }
      }
      for (const best of order) { const o = best*4; bb[p+':'+best] = [box[o],box[o+1],box[o+2],box[o+3]]; }
    }
    this.bbox = bb;
  }

'''),
    ('bind once', 'the bind cache, above the Skinner class',
r'''class Skinner {
''',
r'''/* ONE BODY IS BOUND ONCE (PLUMBER 10/9, row [first load] round 2, a review patch for RUN and
   ANIMATION: records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md). Measured on the demo's
   boot: 1,256 binds, 174 different ones, the player's own body bound 73 times, because the street
   cast and the family and outfit builds each call rebuildFromRig and it binds all eight directions
   from scratch. A bind reads only this direction's painted pixels, its rest skeleton and its candidate
   bones, so the same three give back the binding they gave before. The key is a hash for the lookup;
   the painted pixels are kept and compared in full before a hit is used, so a hash collision is a
   miss, never a wrong body. Holds at most 256 bodies (about 4 MB at the measured sizes). */
const _BIND_CACHE = new Map();
function _bindKey(sk) {
  let h1 = 0x811c9dc5, h2 = 0x9747b28c, n = 0;
  const cs = [];
  for (let p = 1; p <= NP; p++) {
    const px = sk.pixList[p];
    h1 = Math.imul(h1 ^ (p + 0x100), 0x01000193); h2 = Math.imul(h2 ^ (p + 0x100), 0x5bd1e995); h2 ^= h2 >>> 15;
    for (let q = 0; q < px.length; q++) { const v = px[q]; h1 = Math.imul(h1 ^ v, 0x01000193); h2 = Math.imul(h2 ^ v, 0x5bd1e995); h2 ^= h2 >>> 15; }
    n += px.length; cs.push(sk.candFor(p).join(','));
  }
  return sk.dir + '|' + JSON.stringify(sk.rest) + '|' + cs.join(';') + '|' + n + '|' + (h1 >>> 0).toString(36) + '.' + (h2 >>> 0).toString(36);
}
function _bindFromCache(sk) {
  const key = _bindKey(sk), hit = _BIND_CACHE.get(key);
  if (hit) {
    let same = true;
    for (let p = 1; p <= NP && same; p++) { const px = sk.pixList[p], w = hit.pix[p]; if (px.length !== w.length) same = false; else for (let q = 0; q < px.length; q++) if (px[q] !== w[q]) { same = false; break; } }
    if (same) {
      for (let p = 1; p <= NP; p++) { const bo = sk.bone[p], px = sk.pixList[p], v = hit.bone[p]; for (let q = 0; q < px.length; q++) bo[px[q]] = v[q]; }
      const bb = {}; for (const k in hit.bbox) bb[k] = hit.bbox[k].slice(); sk.bbox = bb;
      return true;
    }
  }
  sk._rebind();
  const bone = [null], pix = [null];
  for (let p = 1; p <= NP; p++) { const bo = sk.bone[p], px = sk.pixList[p], v = new Int8Array(px.length); for (let q = 0; q < px.length; q++) v[q] = bo[px[q]]; bone.push(v); pix.push(Int32Array.from(px)); }
  const bb = {}; for (const k in sk.bbox) bb[k] = sk.bbox[k].slice();
  _BIND_CACHE.delete(key);
  if (_BIND_CACHE.size >= 256) _BIND_CACHE.delete(_BIND_CACHE.keys().next().value);
  _BIND_CACHE.set(key, { bone, pix, bbox: bb });
  return false;
}
class Skinner {
'''),
    ('bind once', 'the Skinner binds through the cache',
r'''    if (this.rest) this._rebind();
''',
r'''    if (this.rest) _bindFromCache(this);
'''),
]


def apply(src, only=None):
    """-> (new source, report lines, ok). Refuses on any hunk that neither applies once nor is already in."""
    rep, ok = [], True
    for row, what, old, new in HUNKS:
        if only and row != only:
            continue
        if new in src:
            rep.append('  already in  [%s] %s' % (row, what))
        elif src.count(old) == 1:
            src = src.replace(old, new, 1)
            rep.append('  applied     [%s] %s' % (row, what))
        else:
            ok = False
            rep.append('  REFUSED     [%s] %s (the old text is there %d times)' % (row, what, src.count(old)))
    return src, rep, ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--in', dest='inp', default=os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'))
    ap.add_argument('--out', default=None)
    ap.add_argument('--write', action='store_true')
    ap.add_argument('--only', default=None)
    a = ap.parse_args()
    src = open(a.inp, encoding='utf8').read()
    new, rep, ok = apply(src, a.only)
    print('THE FIRST-LOAD HUNKS on %s' % os.path.relpath(a.inp, ROOT))
    print('\n'.join(rep))
    if not ok:
        print('NOTHING WRITTEN: a hunk no longer matches. The page changed under it; tell PLUMBER.')
        sys.exit(2)
    dest = a.out or (a.inp if a.write else None)
    if dest:
        open(dest, 'w', encoding='utf8').write(new)
        print('wrote %s (%+d bytes)' % (os.path.relpath(dest, ROOT) if dest.startswith(ROOT) else dest, len(new) - len(src)))
    else:
        print('dry run: nothing written (--write to apply, --out to write a copy)')


if __name__ == '__main__':
    main()
