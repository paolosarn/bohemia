#!/usr/bin/env python3
"""V132 THE BUTTON USES THE TEN REAL FACES, AND THE CROSSFADE IS DEAD.

v131 made the face generator produce ten real damage frames, placed on each
face's own bones. This is the other half: combat has to USE them, and the thing
they replace has to go.

WHAT DIES HERE, AND IT SHOULD: v129's crossfade from `you` to `dying`. Paolo:
"Pretty dogshit all u did was change the opacity of the nose bleed." He was
literally right -- `dying` is the same face with blood:true, and blood:true is
six pixels of nosebleed, so a crossfade between them could only ever change that
bleed's opacity. There is nothing to salvage in it; it is deleted, not tuned.

WHAT REPLACES IT: the tier picks a frame. hpTier() already returns 0..9 with
Doom hysteresis, and there are now exactly ten frames, so it is an index. No
blending, no wash, no filter -- the button shows the face that belongs to that
tier, and every one of those faces was rendered from buildSpec() so it is HIS
character at every stage.

THE VALUE/BLOOD OVERLAY FROM v129 ALSO GOES. It was the other half of what he
called dogshit: a multiply-darken and a red radial gradient laid over the top,
which is a FILTER, and a filter is what you reach for when the art underneath is
not doing the work. The art is doing the work now. What stays is only the
frame-under-40% red border, because that is a UI edge state and not a pretence
of injury.

FALLBACK, AND IT IS HONEST: if the ten frames never arrive (an older parent, a
handoff before the sprite message lands) it falls back to `you` unchanged rather
than to a half-broken effect. The button is never blank.

REUSE CHECK: cooks NO graphic pixels. Every pixel it shows was authored by the
face generator in v131. It selects a frame by index and deletes an overlay.

TASTE CHECK: authors no art. The taste rule is the one his rejection taught:
DAMAGE IS SHAPE, NOT A FILTER. A darkening pass and a red gradient are the
signature of art that is not carrying itself; ten drawn states with a swelling
eye are the art carrying itself. So the filter is removed rather than tuned down.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package + the v131 face frames
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V132 THE BUTTON USES THE TEN REAL FACES'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v132 already in; nothing to do')
        return

    # ---- the frame replaces the crossfade AND the filter ---------------
    old = """  const _t=_hpTier, _f=_t/(HP_TIERS-1);           /* 0 = untouched, 1 = nearly dead */
  x.save();
  if(_lean)x.setTransform(1,0,0,1,Math.round(_lean*3),0);   /* the Doom lean, toward the shooter */
  x.drawImage(SPR.portraits.you,0,0);
  if(JUICE.AU&&SPR.portraits.dying&&_f>0.45){        /* the dying face fades IN, never pops */
    x.globalAlpha=Math.min(1,(_f-0.45)/0.4); x.drawImage(SPR.portraits.dying,0,0); x.globalAlpha=1; }
  x.setTransform(1,0,0,1,0,0); x.restore();
  if(JUICE.AU&&_f>0){
    /* VALUE FIRST, COLOUR SECOND -- the same discipline the TEXTURE MATCH gate
       found in his own art: his is rougher, greyer and less saturated. A face
       going dark reads as hurt long before a red one does. */
    x.save(); x.globalCompositeOperation='multiply';
    x.fillStyle='rgba('+Math.round(255-90*_f)+','+Math.round(255-120*_f)+','+Math.round(255-125*_f)+',1)';
    x.fillRect(0,0,64,64); x.restore();
    /* blood creeps in from the edges as it gets worse */
    if(_f>0.2){ const g2=x.createRadialGradient(32,32,10,32,32,40);
      g2.addColorStop(0,'rgba(150,20,15,0)');
      g2.addColorStop(1,'rgba(150,20,15,'+(0.62*(_f-0.2)/0.8).toFixed(3)+')');
      x.fillStyle=g2; x.fillRect(0,0,64,64); }
    if(_f>0.75){ x.strokeStyle='rgba(170,22,16,'+(0.9*(_f-0.75)/0.25).toFixed(3)+')';
      x.lineWidth=5; x.strokeRect(0,0,64,64); } }"""
    new = """  /* ===== V132 THE BUTTON USES THE TEN REAL FACES ===================
     Paolo on what was here: "Pretty dogshit all u did was change the opacity of
     the nose bleed." HE WAS LITERALLY RIGHT -- `dying` is this same face with
     blood:true, and blood:true is SIX PIXELS of nosebleed, so a crossfade
     between `you` and `dying` could only ever change that bleed's opacity.
     Deleted, not tuned. There was nothing in it to save.
     AND THE FILTER GOES WITH IT. The multiply-darken and the red radial were
     the other half of the same problem: a filter is what you reach for when the
     art underneath is not doing the work. v131 made the art do the work -- ten
     states drawn on each face's own bones, with the eye swelling shut -- so the
     filter is removed rather than turned down.
     hpTier() already returns 0..9 with hysteresis and there are exactly ten
     frames, so the tier IS the index. No blending. */
  const _t=_hpTier, _f=_t/(HP_TIERS-1);           /* 0 = untouched, 1 = nearly dead */
  const _dmgSet=(JUICE.AU&&SPR.portraits.dmg&&SPR.portraits.dmg.length)?SPR.portraits.dmg:null;
  const _face=_dmgSet?(_dmgSet[Math.max(0,Math.min(_dmgSet.length-1,_t))]||SPR.portraits.you)
                     :SPR.portraits.you;   /* honest fallback: an older parent shows the clean face, never a half-effect */
  x.save();
  if(_lean)x.setTransform(1,0,0,1,Math.round(_lean*3),0);   /* the Doom lean, toward the shooter */
  x.drawImage(_face,0,0);
  x.setTransform(1,0,0,1,0,0); x.restore();
  /* the only thing kept from the old pass: the border is a UI edge state, not a
     pretence of injury, and it is the one read that survives at thumb size. */
  if(JUICE.AU&&_f>0.75){ x.strokeStyle='rgba(170,22,16,'+(0.9*(_f-0.75)/0.25).toFixed(3)+')';
    x.lineWidth=5; x.strokeRect(0,0,64,64); }"""
    s = subN(s, old, new)

    # ---- accept the frames off the sprite message ----------------------
    old = """    SPR.portraits={you:mkAt(d.portraits.you,64,64),"""
    new = """    /* V132: the ten damage frames ride the same message as every other sprite */
    if(d.portraits&&d.portraits.dmg&&d.portraits.dmg.length){
      try{ SPR._dmgRaw=d.portraits.dmg.map(fr=>mkAt(fr,64,64)); }catch(_e){ SPR._dmgRaw=null; } }
    SPR.portraits={you:mkAt(d.portraits.you,64,64),"""
    s = subN(s, old, new)

    old = """      dying:crop()};"""
    new = """      dying:crop()};
    if(SPR._dmgRaw)SPR.portraits.dmg=SPR._dmgRaw;   /* V132 */"""
    if old in s:
        s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v132: the tier picks a real face; the crossfade and the filter are gone (%d chars)' % len(s))


if __name__ == '__main__':
    main()
