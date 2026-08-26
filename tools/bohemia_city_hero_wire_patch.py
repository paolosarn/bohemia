#!/usr/bin/env python3
"""BOHEMIA CITY HERO WIRE PATCH (7/24/26) — married the approved DISTRICT HERO
sprites into the CITY tab's zoomed-out render.

Paolo 7/24 approved the matched heroes and asked for "the same treatment" across
the walkable district roster. So the city-view render draws each district's baked
hero PNG on its tile instead of a crude dia+prism block. The mechanism is ONE
format-agnostic guard on the render switch:

    switch(d){ ... }   ->   if(!(HERO_IMG[d]&&drawHero(d,p)))switch(d){ ... }

so any district that HAS a hero (and whose sprite has decoded) draws the sprite
and skips the block; every other district — and the first frame before images
load — falls through to the existing block unchanged (zero-risk, additive). The
sprite is anchored on the cell ground-center, scaled so its plate == one cell
diamond (TW wide).

REUSE CHECK: reuses the approved hero bank verbatim
(banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt, opened + read here) — no new
pixels cooked. Sprites are matched to each walkable district by the hero factory.

Idempotent (markers HERO_WIRE_START/END + the guarded switch). Decodes the alpha
CITY_B64, injects, re-encodes. Rerun after the factory re-bakes / adds districts.

  python3 tools/bohemia_city_hero_wire_patch.py
"""
import base64
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
# THE CITY MOVED OUT OF THE ALPHA (8/2, the payload-wall pass in another lane): the city app
# is its own file now and the alpha loads it in an iframe. This tool follows the file rather
# than assuming where the city lives, so a lane moving a payload cannot silently stop the
# heroes being drawn. Both paths are tried; whichever carries CITY_B64 gets patched.
CITY_FILES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html']
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'


def main():
    bank = json.load(open(BANK))
    heroes = {h['district']: h for h in bank['heroes']}
    districts = sorted(heroes)
    # ---- THE MAP DRAWS THESE AT FORTY-SEVEN PIXELS (8/21, WORLD lane) ----------
    # This embedded the hero PNGs AT BAKE SIZE, which is 1,748 px square since Paolo's
    # 8/2 "BIGGEST AS FUCK" pass. MEASURED on the real page: the city view's tile is
    # TW0 = 18 px and zoomBounds caps CZOOM at 2.6, so the widest a district hero is
    # EVER drawn is 18 * 2.6 = 47 CSS pixels. On a 3x phone that is ~141 device pixels.
    #
    # So the wire was shipping a 1,748 px sprite to paint 47 -- about 1,400x the pixels
    # anyone can see -- 69 times. It took slices/BOHEMIA_CITY_TILES.js from 29 MB to
    # 58 MB the moment the last nine districts were wired, and that file is DOWNLOADED
    # BY THE PLAYER before the map draws. Time-to-first-play is the known problem on the
    # demo board; this was 56 MB of it, and it was self-inflicted.
    #
    # 256 px wide keeps 1.8x headroom over the worst case (141 device px) and throws
    # away nothing anybody can resolve. The BAKE stays 1,748 -- the bank is the master
    # and the judging surfaces still show it full size. Only the MAP COPY is resampled,
    # which is what a mipmap is and why every renderer has them.
    from PIL import Image                      # noqa: PLC0415
    import io as _io                           # noqa: PLC0415
    MAP_W = 256
    # AND A DIGEST OF THE MASTER EACH MAP COPY CAME FROM (8/21). Without one, nothing
    # anywhere could tell a wired sprite from a STALE wired sprite -- and main's map was
    # drawing 451 px cityhall art from before Paolo's 8/2 "biggest as fuck" pass while the
    # bank held the 1,724 px master. Three weeks of icon work (the stadium's field, the
    # basin's hole, the police shield, the radio masts, nine whole new districts) sat in
    # the bank and never reached the map, because this tool had not been re-run and the
    # gate only ever asked whether A sprite was present, never whether it was THE sprite.
    import hashlib                            # noqa: PLC0415
    src, anch, plate, frm = {}, {}, {}, {}
    for d in districts:
        raw = base64.b64decode(heroes[d]['b64'])
        im = Image.open(_io.BytesIO(raw)).convert('RGBA')
        k = min(1.0, float(MAP_W) / im.width)
        if k < 1.0:
            im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))),
                           Image.LANCZOS)
        buf = _io.BytesIO()
        im.save(buf, 'PNG', optimize=True)
        src[d] = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')
        # THE ANCHOR IS IN PIXELS, SO IT SCALES WITH THEM. An unscaled bx/by against a
        # resampled sprite plants every icon in the wrong place, which is the obvious
        # way to get this wrong and is why it is one line away from the resize.
        anch[d] = {'bx': int(round(heroes[d]['bx'] * k)), 'by': int(round(heroes[d]['by'] * k))}
        # AND THE PLATE, MEASURED NOT ASSUMED. drawHero derived it as naturalWidth-28,
        # where 28 is the two 14 px margins bake() leaves. Those margins are resampled
        # too, so the constant is wrong the moment the sprite is scaled -- carry the real
        # number per district instead of a magic one that is only right at one size.
        plate[d] = max(1, int(round((heroes[d]['w'] - 28) * k)))
        frm[d] = hashlib.sha1(heroes[d]['b64'].encode('ascii')).hexdigest()[:12]

    # THE CITY MOVED, AND IT ALSO STOPPED BEING BASE64. The payload-wall pass put the city
    # app in its own file with its source INLINE. So this handles both shapes: a CITY_B64
    # blob to decode and re-encode, or plain text to patch in place. Following the artefact
    # instead of assuming its shape is the only way a tool survives another lane's refactor.
    target, alpha, m, inline = None, None, None, False
    for cand in CITY_FILES:
        if not os.path.exists(cand):
            continue
        txt = open(cand, encoding='utf8').read()
        mm = re.search(r"const CITY_B64='([^']+)'", txt)
        if mm:
            target, alpha, m = cand, txt, mm
            break
        if 'function renderCity(){' in txt:
            target, alpha, inline = cand, txt, True
            break
    if not target:
        print('no city app found in: ' + ', '.join(CITY_FILES)); sys.exit(1)
    dec = alpha if inline else base64.b64decode(m.group(1)).decode('utf8')

    # ---- 0. WHERE DOES THE ART LIVE? (8/9) On 8/6 another lane moved every big pixel
    # payload out of this page into a sibling script -- "this page is rewritten daily and
    # was carrying 27 MB of art it never edits" -- and this tool did not notice, because it
    # ALWAYS wrote HERO_SRC inline. Re-running it silently undid their extraction and put
    # 3 MB back in the page. Same class of bug the docstring above already warns about, so
    # the answer is the same: FOLLOW THE ARTEFACT. Read the page's own <script src=> tags,
    # and if one of those files is where HERO_SRC actually lives, write it THERE.
    extern = None
    for s in re.findall(r'<script src="([^"]+\.js)"', alpha):
        cand = os.path.join(os.path.dirname(target), s)
        if os.path.exists(cand) and re.search(r'^var HERO_SRC=', open(cand, encoding='utf8').read(2048), re.M):
            extern = cand
            break

    src_js = "var HERO_SRC=" + json.dumps(src, separators=(',', ':')) + ";"
    # A PLACEHOLDER IS NOT A HOME (8/25, WORLD lane). The bank was split into chunks on 8/24
    # and the shape changed under this tool: chunk 1 is a small BLOCKING script that DECLARES
    # all eight bank names empty, and the art arrives later, in chunks the page pulls once a
    # world is on screen. `var HERO_SRC={};` in chunk 1 is that declaration -- so the search
    # above finds chunk 1, and rewriting the line there puts 2.85 MB of hero art back on the
    # blocking chunk. Measured: chunk 1 goes 1.75 MB -> 4.47 MB, past the browser cache wall,
    # and the wait before a world appears goes back up with it. The tool printed "already
    # wired; nothing to write" while doing it, which is the T2 disease in its own gate.
    # So: if the line found is an empty declaration and the chunks ALREADY carry exactly
    # these heroes, there is nothing to do and nothing is touched. If they carry something
    # else, the art really is new and it is written -- and the chunker has to run after, which
    # is what the message says, because only the chunker decides which chunk a bank lives in.
    carried = False
    if extern:
        cur = open(extern, encoding='utf8').read()
        _hl = next((ln for ln in cur.split('\n') if ln.startswith('var HERO_SRC=')), '')
        if len(_hl) < 64:                                   # a declaration, not the data
            body = json.dumps(src, separators=(',', ':'))
            want = 'Object.assign(HERO_SRC,' + body + ')'
            d = os.path.dirname(extern)
            for f in sorted(os.listdir(d)):
                if not re.match(r'^BOHEMIA_CITY_TILES_\d+\.js$', f):
                    continue
                if want in open(os.path.join(d, f), encoding='utf8').read():
                    carried = True
                    break
    _extern_note = ('/* HERO_SRC lives in ' + os.path.basename(extern) + ' (8/6, repo budget: this page '
                    'is rewritten daily and was carrying 27 MB of art it never edits) */\n') if extern else ''
    if extern and carried:
        print('HERO WIRE: the %d district heroes are already in the chunked bank; '
              'chunk 1 only declares the name. Nothing written.' % len(src))
        src_line = _extern_note
    elif extern:
        lines = open(extern, encoding='utf8').read().split('\n')
        for i, ln in enumerate(lines):
            if ln.startswith('var HERO_SRC='):
                lines[i] = src_js
                break
        open(extern, 'w', encoding='utf8').write('\n'.join(lines))
        if len(_hl) < 64:
            print('HERO WIRE: new hero art written into %s, which is the DECLARATION chunk. '
                  'Run tools/bohemia_city_chunk_tile_bank.py now or the blocking chunk stays '
                  '2.85 MB heavier and the world takes longer to appear.' % os.path.basename(extern))
        src_line = ('/* HERO_SRC lives in ' + os.path.basename(extern) + ' (8/6, repo budget: this page '
                    'is rewritten daily and was carrying 27 MB of art it never edits) */\n')
    else:
        src_line = src_js + '\n'

    # ---- 1. the HERO block: sprite images + anchors + drawHero(), before renderCity
    block = (
        "/*HERO_WIRE_START*/\n"
        "var HERO_ANCH=" + json.dumps(anch, separators=(',', ':')) + ";\n"
        # the real plate width per district, so drawHero never assumes a bake size
        "var HERO_PLATE=" + json.dumps(plate, separators=(',', ':')) + ";\n"
        # which bank master each map copy was resampled from, so staleness is checkable
        "var HERO_FROM=" + json.dumps(frm, separators=(',', ':')) + ";\n"
        + src_line +
        "var HERO_IMG={};(function(){for(var k in HERO_SRC){var im=new Image();im.src=HERO_SRC[k];HERO_IMG[k]=im;}})();\n"
        "function drawHero(name,p){var im=HERO_IMG[name];if(!im||!im.complete||!im.naturalWidth)return false;"
        "var plate=(HERO_PLATE&&HERO_PLATE[name])||(im.naturalWidth-28),sc=TW/plate,a=HERO_ANCH[name];"
        "g.drawImage(im,p.sx-a.bx*sc,p.sy+TH/2-a.by*sc,im.naturalWidth*sc,im.naturalHeight*sc);return true;}\n"
        "/*HERO_WIRE_END*/\n"
    )
    # ---- NEVER REGENERATE THE REGION. UPDATE THE DATA IN IT. (8/21, WORLD lane) ----
    # This did `re.sub(HERO_WIRE_START .*? HERO_WIRE_END, "")` and wrote a fresh block.
    # That is fine exactly once. By 8/21 the block had ACQUIRED 6,100 characters of other
    # lanes' work -- the 8/15 street-facing mirror (Paolo: "recognize which direction a
    # street should be going... and make it face that way"), `function overpassAt`, and a
    # drawHero that had grown a THIRD ARGUMENT for the flip. Re-running this tool deleted
    # all of it and left the page throwing `ReferenceError: overpassAt is not defined`.
    # Caught by walked_surface_gate before it shipped, and only because I re-ran the gates
    # instead of trusting a green from before the change.
    #
    # This is the third time in two days a tool has destroyed or split a region it does
    # not own (the furnish patch cut the floorplan in half; the interior-ground patch
    # inherited the bad anchor). THE RULE THAT COMES OUT OF IT: a patch tool may CREATE a
    # region and may UPDATE THE DECLARATIONS IT WRITES, but it may never re-emit the whole
    # region, because it cannot know what else has moved in since.
    def _set_line(text, name, payload, after=None):
        """Replace `var NAME=...;` on its own line, or add it after `after`."""
        line = 'var %s=%s;' % (name, payload)
        pat = re.compile(r'^var %s=.*;$' % re.escape(name), re.M)
        if pat.search(text):
            return pat.sub(lambda _m: line, text, count=1)
        if after:
            ap = re.compile(r'^(var %s=.*;)$' % re.escape(after), re.M)
            if ap.search(text):
                return ap.sub(lambda m: m.group(1) + '\n' + line, text, count=1)
        return text

    if '/*HERO_WIRE_START*/' in dec:
        dec = _set_line(dec, 'HERO_ANCH', json.dumps(anch, separators=(',', ':')))
        dec = _set_line(dec, 'HERO_PLATE', json.dumps(plate, separators=(',', ':')), after='HERO_ANCH')
        dec = _set_line(dec, 'HERO_FROM', json.dumps(frm, separators=(',', ':')), after='HERO_PLATE')
        # teach whatever drawHero is there now to use the real plate. Idempotent: after the
        # swap the old spelling is gone, so a second run is a no-op. Everything else in that
        # function -- the flip, the facing, anything a later lane adds -- is left alone.
        dec = dec.replace('var plate=im.naturalWidth-28,',
                          'var plate=(HERO_PLATE&&HERO_PLATE[name])||(im.naturalWidth-28),')
    else:
        anchor = "function renderCity(){"
        if anchor not in dec:
            print('renderCity not found'); sys.exit(1)
        dec = dec.replace(anchor, block + anchor, 1)

    # ---- 2. guard the render switch (idempotent). Older builds may have per-case
    #         drawHero wraps from the first version; the guard supersedes them
    #         (harmless dead paths), so we only need to ensure the guard is present.
    GUARD = "if(!(HERO_IMG[d]&&drawHero(d,p)))switch(d){"
    if GUARD not in dec:
        # the switch lives right after `const d=t.district, r=OM.rng(t.seed);`
        idx = dec.find("const d=t.district")
        sw = dec.find("switch(d){", idx)
        if idx < 0 or sw < 0:
            print('render switch not found'); sys.exit(1)
        dec = dec[:sw] + GUARD + dec[sw + len("switch(d){"):]

    if GUARD not in dec or "function drawHero(" not in dec:
        print('FAILED to wire the switch guard'); sys.exit(1)

    new_b64 = base64.b64encode(dec.encode('utf8')).decode('ascii')
    alpha = (dec if inline else
             alpha[:m.start(1)] + base64.b64encode(dec.encode('utf8')).decode() + alpha[m.end(1):])
    # SAY WHAT ACTUALLY HAPPENED (8/21). This wrote byte-identical content every
    # run and still printed "69 district heroes wired", which reads as work done.
    # The wiring IS correct and idempotent -- the MESSAGE was the only defect --
    # but a success line over an unchanged file is the same disease as a green
    # gate that proves nothing: the next person to read it believes something
    # happened. Gate: gates/tool_idempotent_gate.js
    _before = open(target, encoding='utf8').read() if os.path.exists(target) else None
    if _before == alpha:
        print('HERO WIRE: already wired (%d district heroes); nothing to write.'
              % len(districts))
        return
    open(target, 'w', encoding='utf8').write(alpha)
    print('HERO WIRE: %d district heroes wired via switch-guard; CITY_B64 %d KB' % (len(districts), len(dec) // 1024))
    print('   ', ' '.join(districts))


if __name__ == '__main__':
    main()
