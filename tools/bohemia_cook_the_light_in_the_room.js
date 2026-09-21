/* THE LIGHT THAT WAS IN THE ROOM  (9/21/26, PORTRAIT lane, row [horror face] inside [faces first])
 *
 * Rule 20 / the analog horror bible, RULE 4: "every lumen has a source you can point at
 * (sky, CRT, sign, lamp) ... no mood gradient, ever."
 * Rule 22 (Paolo 9/21): a making lane cooks every round.
 *
 * *** THE SCENE HAS BEEN NAMING ITS OWN LIGHT THE WHOLE TIME AND NO FACE HAS EVER READ IT. ***
 * The authored scene data carries a `light` field on every beat. Seven of them:
 *     warm_interior  x2      dim_interior  x4      open_sky  x1
 * and "warm_interior" appears exactly twice in the entire alpha -- both times in the scene
 * data. Zero mentions in any renderer. The family sit at a table under a bulb and the game
 * knows it, writes it down, and then paints their faces with nothing.
 * So the fixture does not have to be invented, argued for, or asked about. It is already
 * his, in the file, waiting to be read. MECHANISM MINE, CONTENTS HIS.
 *
 * WHAT A FIXTURE CHANGES, AND WHAT IT DELIBERATELY DOES NOT:
 *   IT CHANGES THE SHAPE OF THE LIGHT. A bulb a foot from somebody's face is a point
 *     source: the lit band is narrow and the falloff is fast. The sky is broad: the turn is
 *     even and gentle. A dim room is the same shape as the bulb with the key pulled down so
 *     most of the face sits in the dark band and the lit edge is barely above it.
 *   IT DOES NOT CHANGE THE HUE. A warm bulb really is amber, and painting that would mean
 *     inventing colours this face does not own. STRUCTURE-NOT-COLOR, and the same rule this
 *     lane held last round: every shaded pixel lands on one of the FOUR ENTRIES THAT FACE
 *     ALREADY OWNS. The fixture is carried by falloff and key, not by tint. Saying so out
 *     loud rather than quietly shipping a colour nobody approved.
 *
 * THE FACE STILL HOLDS (bible rule 6, THE STILL FACE). Nothing here animates. This file
 * also MEASURES the idle against that rule's own number and prints it.
 *
 * REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 9/21 at the seam --
 * third cook tool this stretch to ship without one, the pattern is routed to the
 * coordinator): the rulers are AH-01 (the bible; rules 4 and 6 are quoted above
 * as the whole brief) and FACE-01 with FACE-02 (the portrait construction the
 * lit form must keep). Both resolve in the reference library index.
 *
 * RIG CHECK: renders and reads; no joint, no bone, no painted pixel. IT DOES NOT CHANGE THE
 * SHIPPED RENDERER -- rule 18 keeps code off the play surface, rule 15 says he sees it in
 * VOTE first. renderFace is untouched and the approved player face has not moved.
 * REUSE CHECK: cooks no new art and no second lighting model -- it is last round's pass
 * (tools/bohemia_cook_the_face_has_light.js) with the fixture made a parameter.
 *
 *   node tools/bohemia_cook_the_light_in_the_room.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CARDS = path.join(REPO, 'slices/vote');
const SHEET = path.join(REPO, 'records/target/BOHEMIA_THE_LIGHT_IN_THE_ROOM_9_21_26.png');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_LIGHT_IN_THE_ROOM.json');

/* THE THREE FIXTURES THE SCENE DATA ALREADY NAMES. Nothing else is offered, because
   offering a fourth would be inventing content that has no ruling behind it. */
const FIXTURES = {
  open_sky:      { label: 'OPEN SKY',      key:  0, spread: 0.46, lift: 0.72, drop: 0.22 },
  warm_interior: { label: 'WARM INTERIOR', key:  0, spread: 0.66, lift: 0.80, drop: 0.40 },
  dim_interior:  { label: 'DIM INTERIOR',  key: +1, spread: 0.72, lift: 0.86, drop: 0.50 }
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1700, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function',
    { timeout: 60000 });

  const out = await p.evaluate(({ FIXTURES }) => {
    const N = 64;
    const key = (c) => c[0] + ',' + c[1] + ',' + c[2];
    const lum = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];

    /* ---------- THE IDLE, AGAINST THE BIBLE'S OWN NUMBER ------------------
       Rule 6 MEASURE: "idle portrait: at most one micro-move per 8 beats."
       120 BPM, so a beat is 500 ms and the budget is one move per 4000 ms.
       SIMULATED, NOT DERIVED: I ran the real facePerform rather than doing the
       algebra on its constants, because the algebra cannot see a bug in the code. */
    function idleRate() {
      if (typeof facePerform !== 'function') return null;
      const SPAN = 600000, STEP = 20;         /* ten minutes at 50 Hz */
      const ids = ['FATHER:RAY','MOTHER:DENISE','BROTHER:MARCO','SISTER:NINA'];
      let moves = 0, samples = 0;
      for (const id of ids) {
        let pb = 0, pr = 0;
        for (let t = 0; t < SPAN; t += STEP) {
          const f = facePerform(id, t, null, {});       /* null line = at rest */
          const blinking = f.blink > 0.02, browUp = Math.abs(f.brow) > 0.02;
          if (blinking && !pb) moves++;
          if (browUp && !pr) moves++;
          pb = blinking; pr = browUp; samples++;
        }
      }
      const totalMs = SPAN * ids.length;
      return { moves: moves, perMoveMs: Math.round(totalMs / Math.max(1, moves)),
               budgetMs: 4000, beats: +(totalMs / Math.max(1, moves) / 500).toFixed(2) };
    }

    /* ---------- THE COOK: last round's pass, fixture as a parameter -------- */
    function litFace(spec, ramp, fx) {
      const flat = renderFace(spec, { ramp: ramp });
      const px = new Uint8ClampedArray(flat);
      const L = ramp[0], Mn = ramp[1], Sh = ramp[2];
      const ShSoft = [(Mn[0]*2+Sh[0])/3|0, (Mn[1]*2+Sh[1])/3|0, (Mn[2]*2+Sh[2])/3|0];
      const STEP = [L, Mn, ShSoft, Sh];
      const skin = {}; STEP.forEach((c, i) => skin[key(c)] = i);
      const at = (x,y) => { const i=(y*N+x)*4; return [px[i],px[i+1],px[i+2],px[i+3]]; };
      const put = (x,y,c) => { const i=(y*N+x)*4; px[i]=c[0];px[i+1]=c[1];px[i+2]=c[2];px[i+3]=255; };
      const isSkin = (x,y) => { const c=at(x,y); return c[3] ? (key(c) in skin) : false; };
      const f = spec.face;
      /* *** THE HEAD HAS ONE CENTRE, NOT ONE PER ROW. ***
         The first cut took each row's own span and centred the turn on it. A row's span
         jumps around wherever hair crosses the skin, so the terminator wandered and came
         out as a RECTANGULAR PATCH on the cheek -- it read as a swatch laid over the face
         instead of light wrapping a head. I looked at RAY and saw the block before any
         number said anything. One centre and one half-width for the whole face, taken from
         the mass itself, and the terminator is a single edge down the head. */
      let fx0=1e9, fx1=-1;
      for (let y=0;y<N;y++) for (let x=0;x<N;x++) if (isSkin(x,y)) { if(x<fx0)fx0=x; if(x>fx1)fx1=x; }
      const HC = (fx0+fx1)/2, HH = Math.max(1,(fx1-fx0)/2);
      for (let y=0;y<N;y++){
        for(let x=0;x<N;x++){
          if(!isSkin(x,y)) continue;
          const u=(x-HC)/HH, v=(y-f.top)/Math.max(1,f.len);
          let t = 0.52 + fx.spread*u - 0.16*Math.max(0, v-0.62);
          if (v < 0.10) t += 0.06;
          /* THE TERMINATOR PIVOTS, IT DOES NOT DIM (the defect this lane fixed last
             round: an absolute band plus a never-lighten guard turns a light pass into
             a darkening pass, and the contrast number rises while the face gets worse). */
          const was = skin[key(at(x,y))];
          const delta = (t > fx.lift ? -1 : t > fx.drop ? 0 : t > fx.drop*0.55 ? 1 : 2) + fx.key;
          put(x,y,STEP[Math.max(0,Math.min(3, was + delta))]);
        }
      }
      /* *** THE LIGHT FALLS ON THE HAIR TOO. ***
         The first cut lit the skin and stopped, and the hair is the biggest mass on any of
         these heads -- so a head read as a lit face glued to a flat wig. If the lumen is
         real it lands on everything in the room. The hair is shaded with the TWO VALUES THE
         SPEC ALREADY CARRIES, sp.hair.color and sp.hair.roots: lit side keeps the colour,
         shadow side takes the roots. No third value is derived, so no colour is invented
         and the hair palette this lane fixed on 9/20 is untouched. */
      if (spec.hair && spec.hair.color && spec.hair.roots) {
        const hc = spec.hair.color, hr = spec.hair.roots;
        const hk = key(hc), rk = key(hr);
        for (let y=0;y<N;y++) for (let x=0;x<N;x++) {
          const c = at(x,y); if(!c[3]) continue;
          const k0 = key(c); if (k0 !== hk && k0 !== rk) continue;
          const u=(x-HC)/HH;
          const t = 0.52 + fx.spread*u;
          const wantLit = t > fx.drop;
          put(x,y, wantLit ? hc : hr);
        }
      }
      /* the bones cast, on this face's own numbers */
      const darken=(x,y)=>{ if(!isSkin(x,y))return; const b0=skin[key(at(x,y))]; put(x,y,STEP[Math.min(3,b0+1)]); };
      const e=spec.eyes, ew=e.w>>1, cx=32;
      for(const side of [-1,1]){ const ex=cx+side*(e.gap/2+ew);
        for(let x=Math.round(ex-ew-1);x<=Math.round(ex+ew+1);x++) darken(x,f.eyeY-1); }
      for(let y=f.eyeY+2;y<=f.noseY;y++) darken(cx-(spec.nose.w>>1)-1,y);
      for(let x=cx-(spec.mouth.w>>1);x<=cx+(spec.mouth.w>>1);x++) darken(x,f.mouthY+(spec.mouth.fullLower||1)+1);
      /* the eye stops glowing; the lid sits on it */
      const OLD='230,231,228';
      const scl=[Math.min(255,L[0]*0.96+16|0),Math.min(255,L[1]*0.96+16|0),Math.min(255,L[2]*0.96+16|0)];
      const sclSh=[scl[0]*0.74|0,scl[1]*0.74|0,scl[2]*0.76|0];
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        if(key(at(x,y))!==OLD) continue;
        const ab=(y>0)?at(x,y-1):null;
        put(x,y,(ab&&ab[3]&&key(ab)!==OLD)?sclSh:scl); }
      /* the mouth gets a seam and corners */
      const mc=spec.mouth.color, mk=key(mc);
      const seam=[mc[0]*0.45|0,mc[1]*0.42|0,mc[2]*0.46|0], corner=[mc[0]*0.32|0,mc[1]*0.30|0,mc[2]*0.34|0];
      const lip=[]; for(let y=0;y<N;y++){ let a=-1,z=-1;
        for(let x=0;x<N;x++) if(key(at(x,y))===mk){ if(a<0)a=x; z=x; }
        if(z>=a&&a>=0) lip.push([y,a,z]); }
      if(lip.length){ const t0=lip[0][0];
        for(const [y,a,z] of lip){ if(y===t0) for(let x=a;x<=z;x++) put(x,y,seam);
          put(a,y,corner); put(z,y,corner); } }
      return px;
    }

    function split(buf, ramp) {
      const L=ramp[0],Mn=ramp[1],Sh=ramp[2];
      const ShSoft=[(Mn[0]*2+Sh[0])/3|0,(Mn[1]*2+Sh[1])/3|0,(Mn[2]*2+Sh[2])/3|0];
      const sk={}; [L,Mn,ShSoft,Sh].forEach(c=>sk[key(c)]=1);
      let ls=0,ln=0,rs=0,rn=0, all=0, an=0;
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){
        const i=(y*N+x)*4; if(!buf[i+3])continue;
        const c=[buf[i],buf[i+1],buf[i+2]]; if(!(key(c) in sk))continue;
        all+=lum(c); an++;
        if(x<32){ls+=lum(c);ln++;} else {rs+=lum(c);rn++;} }
      const l=ln?ls/ln:0, r=rn?rs/rn:0;
      return { left:+l.toFixed(1), right:+r.toFixed(1), mean:+(an?all/an:0).toFixed(1),
               spread:+Math.abs(r-l).toFixed(1), litSide: r>l?'RIGHT':'LEFT' };
    }

    const roles=[['MOTHER','DENISE'],['FATHER','RAY'],['SIBLING OLDER','MARCO'],['SIBLING LOST','NINA']];
    const made=[];
    for (const [role,name] of roles){
      let w=null; try{ w=window.openFaceFor(role); }catch(e){}
      if(!w) continue;
      const sp=faceFor(w.id, w.over||undefined), ramp=faceRampFor(sp);
      const flat=renderFace(sp,{ramp:ramp});
      const byFix={};
      for(const fk in FIXTURES){ const px=litFace(sp,ramp,FIXTURES[fk]);
        byFix[fk]={ px:Array.from(px), split:split(px,ramp) }; }
      made.push({ role, name, id:w.id, flat:Array.from(flat), flatSplit:split(flat,ramp), byFix });
    }
    return { made, idle: idleRate() };
  }, { FIXTURES });

  /* ---- the sheet: one row per face, the three fixtures the scene names ---- */
  const sheetPng = await p.evaluate(({ made, FIXTURES }) => {
    const N=64, Z=4, PAD=22, COLS=4;
    const cw=N*Z, cv=document.createElement('canvas');
    cv.width = PAD + COLS*(cw+PAD);
    cv.height = 250 + made.length*(cw+58);
    const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
    cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle='#f0e6d4'; cx.font='bold 30px monospace';
    cx.fillText('THE LIGHT THAT WAS IN THE ROOM', PAD, 46);
    cx.font='17px monospace'; cx.fillStyle='#b8ab95';
    cx.fillText('the opening already writes down what the light in each scene is. a warm bulb over the', PAD, 86);
    cx.fillText('family table, a dim room, open sky. it has said so all along and no face has ever read', PAD, 110);
    cx.fillText('it, so everyone was painted with nothing. now the room lights the face.', PAD, 134);
    cx.fillText('a bulb close to somebody is a narrow light that falls off fast. the sky is broad and even.', PAD, 166);
    cx.fillText('same skin colours in all of them: the room changes the SHAPE of the light, not its colour.', PAD, 190);
    const mk=(arr)=>{const t=document.createElement('canvas');t.width=t.height=N;
      const im=t.getContext('2d').createImageData(N,N); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im,0,0); return t;};
    const order=['open_sky','warm_interior','dim_interior'];
    made.forEach((m,i)=>{
      const y=250+i*(cw+58);
      cx.fillStyle='#8f836f'; cx.font='13px monospace';
      const cells=[['NOW (no light)',m.flat]].concat(order.map(k=>[FIXTURES[k].label,m.byFix[k].px]));
      cells.forEach(([lab,arr],j)=>{
        const x=PAD+j*(cw+PAD);
        cx.drawImage(mk(arr),0,0,N,N,x,y,cw,cw);
        cx.fillStyle= j===0 ? '#6f6552' : '#c7b894';
        cx.fillText(lab,x,y+cw+18);
      });
      cx.fillStyle='#e8dfc8'; cx.font='bold 17px monospace';
      cx.fillText(m.name, PAD, y-8);
    });
    return cv.toDataURL('image/png');
  }, { made: out.made, FIXTURES });

  fs.mkdirSync(CARDS, { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  /* one card per face: what the game says the room is, against what it draws now */
  for (const m of out.made) {
    const one = await p.evaluate(({ m, FIXTURES }) => {
      const N=64, Z=7, PAD=18;
      const cv=document.createElement('canvas');
      cv.width=PAD*3+N*Z*2; cv.height=PAD*2+N*Z+126;
      const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
      cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
      const mk=(arr)=>{const t=document.createElement('canvas');t.width=t.height=N;
        const im=t.getContext('2d').createImageData(N,N); im.data.set(new Uint8ClampedArray(arr));
        t.getContext('2d').putImageData(im,0,0); return t;};
      cx.fillStyle='#f0e6d4'; cx.font='bold 25px monospace';
      cx.fillText(m.name + ' at the family table', PAD, 34);
      cx.fillStyle='#8f836f'; cx.font='15px monospace';
      cx.fillText('NOW', PAD, 58); cx.fillText('LIT BY THE BULB IN THE ROOM', PAD*2+N*Z, 58);
      cx.drawImage(mk(m.flat),0,0,N,N,PAD,68,N*Z,N*Z);
      cx.drawImage(mk(m.byFix.warm_interior.px),0,0,N,N,PAD*2+N*Z,68,N*Z,N*Z);
      cx.fillStyle='#8f836f'; cx.font='14px monospace';
      cx.fillText('the scene has said "warm interior" the whole time. no face ever read it.', PAD, 68+N*Z+30);
      cx.fillText('same skin colours. the room changes the shape of the light, not its colour.', PAD, 68+N*Z+52);
      return cv.toDataURL('image/png');
    }, { m, FIXTURES });
    fs.writeFileSync(path.join(CARDS, 'PORTRAIT_ROOM_' + m.name + '_9_21.png'),
      Buffer.from(one.split(',')[1], 'base64'));
  }

  const summary = {
    when: new Date().toISOString(),
    idle: out.idle,
    faces: out.made.map(m => ({ name: m.name, id: m.id, now: m.flatSplit,
      open_sky: m.byFix.open_sky.split,
      warm_interior: m.byFix.warm_interior.split,
      dim_interior: m.byFix.dim_interior.split }))
  };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page errors ' + errs.length);
  await b.close();
})();
