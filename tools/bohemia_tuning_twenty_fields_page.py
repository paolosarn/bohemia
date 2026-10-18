#!/usr/bin/env python3
"""TUNING, research only (rule 38g). Renders banks/BOHEMIA_TUNING_THE_TWENTY_FIELDS_FOUR_STUDIOS_10_18_26.json
into the record (records/...md) and the VOTE page (slices/...html). The JSON is the source; edit it, re-run this.
Nothing in the game reads any of the three files."""
import json, os, html, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_TUNING_THE_TWENTY_FIELDS_FOUR_STUDIOS_10_18_26.json')
REC = os.path.join(ROOT, 'records', 'BOHEMIA_TUNING_THE_TWENTY_STYLE_GUIDE_FIELDS_AS_FOUR_STUDIOS_SET_THEM_10_18_26.md')
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_TUNING_THE_TWENTY_FIELDS_10_18_26.html')

GAMES = [('bb', 'Battle Brothers'), ('dc', 'Dead Cells'), ('bl', 'Blasphemous'), ('ew', 'Eastward')]


def load():
    with open(BANK) as f:
        return json.load(f)


def cell(d, c):
    srcs = ' '.join('[%s]' % s for s in c.get('src', []))
    conf = c.get('conf', '')
    tag = '' if conf == 'studio' else ' (%s)' % conf
    return '%s%s %s' % (c['v'].replace('|', '/'), tag, srcs)


def counts(d):
    n = {'studio': 0, 'secondary': 0, 'community': 0, 'inference': 0, 'not published': 0}
    for f in d['fields']:
        for g, _ in GAMES:
            n[f[g]['conf']] += 1
    return n


def md(d):
    n = counts(d)
    L = []
    L.append('# TUNING: THE TWENTY STYLE-GUIDE FIELDS AS FOUR 2D STUDIOS SET THEM, FOR DIRECTION TO READ BEFORE IT PICKS (10/18/26)')
    L.append('# Row: NOTE 10/16 FROM THE COORDINATOR (rule 114a) on the TUNING board, and the WAVE 10/17 line: "next by rule 114a\'s note: the twenty')
    L.append('# style-guide fields as other 2D studios set them, for DIRECTION." Paolo 10/16: "it can\'t look like it\'s vibe coded... read everything')
    L.append('# you can on how to not look like every other vibe coded bullshit." RESEARCH ONLY (rule 38g); a page, registered in VOTE as one line (gray).')
    L.append('# Nothing in the game reads anything written this round. DIRECTION picks the numbers (rule 114a); this page is what it reads first.')
    L.append('# The data: banks/BOHEMIA_TUNING_THE_TWENTY_FIELDS_FOUR_STUDIOS_10_18_26.json (draft:true), rendered by tools/bohemia_tuning_twenty_fields_page.py.')
    L.append('# [bb Battle Brothers never wrote a pixel-art style guide because it is not pixel art: it is painted raster shown one painted pixel per screen')
    L.append('# pixel, busts with no animation so the paint can be detailed, judged at the final size. Its one written rule is readability when zoomed out.]')
    L.append('# [analog horror: the four studios agree on one thing that is also the analog horror rule: the look is decided at the source (a model, a')
    L.append('# painting, a normal map drawn by hand) and never by a filter on the screenshot; Eastward\'s CRT blur is an option on top, not the look.]')
    L.append('')
    L.append('## 1. THE ANSWER FIRST')
    L.append('Of the eighty cells (twenty fields, four studios), %d are a studio\'s own statement, %d are secondary (a journalist or a developer-adjacent list), %d are a community measurement, %d are my inference marked as such, and %d are NOT PUBLISHED by anyone. So the honest shape of this page is: the four studios publish the top of the guide (identity, resolution, camera, how the light works, how a frame is made, what wins when rules fight) and almost none of the bottom (outline rule, dither rule, variation counts, contact line, do-and-don\'t pairs). The bottom is what a studio keeps in its head and its files. DIRECTION will not find those numbers in anybody\'s blog; it has to SET them and let the gates hold them, which is exactly what rule 114a says.' % (n['studio'], n['secondary'], n['community'], n['inference'], n['not published']))
    L.append('')
    L.append('What the four agree on, where they do publish:')
    L.append('- ONE SIZE, DECLARED. The two pixel-art games with a published number both chose 640x360 (Blasphemous from the studio, Dead Cells from a developer-adjacent list); Eastward\'s players measure 360p; Battle Brothers chose no pixel grid at all, one painted pixel per screen pixel. Nobody runs two native pixel sizes in one scene. That is tell 1 of rule 114 and it is unanimous.')
    L.append('- THE LOOK IS DECIDED AT THE SOURCE, NOT ON THE SCREENSHOT. Dead Cells renders a 3D model small with no anti-aliasing and lights it through a hand-drawn normal map; Eastward splits every sprite by its structure and paints a bump map per part; Battle Brothers paints rough at 500x500 and judges at 48x48; Blasphemous places every pixel by hand. Four different sources, one rule: the pixel is authored, never filtered.')
    L.append('- THE LIGHT IS EITHER BAKED OR DYNAMIC, NEVER BOTH. Blasphemous and Battle Brothers bake it into the paint (no runtime light on the sprite). Dead Cells and Eastward run real lights over normal or bump maps and tint whole levels with them. There is no middle: a sprite with a painted key light under a dynamic light is the mixel of lighting.')
    L.append('- READABILITY AT THE SMALLEST SIZE IS THE TIE-BREAKER, SAID OUT LOUD by the only one of the four that wrote it down (Battle Brothers: faces readable at the most zoomed-out level, weapons out of proportion so they read). Dead Cells\' tie-breaker is speed, Blasphemous\' is purity, Eastward\'s is the light.')
    L.append('- A NAMED DEFECT EACH. Dead Cells: flickering pixels. Battle Brothers: noisy downscaled detail. Both name ONE, not eleven. The guide\'s list of eleven mistakes (field 17) is longer than any studio\'s.')
    L.append('')
    L.append('## 2. THE TABLE (every cell with its source key; keys resolve in section 7; "not published" means no developer source states it)')
    L.append('| # | Field | Battle Brothers | Dead Cells | Blasphemous | Eastward | Ours today (what the repo says) |')
    L.append('|---|---|---|---|---|---|---|')
    for f in d['fields']:
        L.append('| %d | %s | %s | %s | %s | %s | %s |' % (f['n'], f['field'], cell(d, f['bb']), cell(d, f['dc']), cell(d, f['bl']), cell(d, f['ew']), f['ours'].replace('|', '/')))
    L.append('')
    L.append('## 3. THE FINDING THAT PROVES US WRONG, MEASURED AGAINST OUR REPO (rule 6: one per round)')
    L.append('FIELD 5, THE COLOUR CAP PER ASSET CLASS, IS NOT A THING THREE OF THE FOUR STUDIOS DO, AND OUR GATE FOR IT WOULD FAIL THE LOOK HE LOCKED.')
    L.append('- Rule 114a\'s Section C example caps colours per sprite (character 12, prop 6, tile 5, portrait 24), and rule 114b\'s gate 2 (palette lock and colour count) is to run "over the PNGs a VOTE sheet carries and over the demo\'s screenshots", with a sheet that fails the first five gates never reaching the tab.')
    L.append('- Battle Brothers is painted raster with thousands of colours per bust and no cap anywhere. Dead Cells ships each frame with a normal map and lets a toon shader and dynamic lights decide the on-screen colour, so a count on a screenshot is a count of the torches. Eastward does the same with deferred lights plus a LUT grade on top. Only Blasphemous, hand-placed and unlit, is a game where a per-sprite colour count on screen means what the gate thinks it means.')
    L.append('- Ours is the Dead Cells case, by his ruling. Rule 115 (10/17, LOCKED) makes the rig the source: a model, clay shading, one hard light, rendered to pixels. DIRECTION\'s own round three measured the rig\'s renders at 10,146 and 13,047 colours per sheet and wrote "his art is not limited-palette; fix the source, not the output", and that is the look he said he fell in love with. A 12-colour cap measured on the render or the screenshot rejects every one of those sheets.')
    L.append('- So field 5 cannot be a count on the output. It has to be a count on the SOURCE: the master palette file\'s roles (field 4) that the rig snaps toward (the round-three population snap, 0.6 of the way toward the pack family), measured on the material colours before the light, with the on-screen count left free. Dead Cells\' "keeping its base colors" under a torch is the same split: base colours are a rule, lit colours are not.')
    L.append('- What this changes: rule 114b\'s gate 2 needs two legs (a palette-lock leg on the source materials and the pack tiles, which are hand-placed and can be capped; no colour-count leg on a lit render or a screenshot), or it culls the rig before he sees it. Routed to DIRECTION (the field) and PLUMBER (the gate) below. Nothing is built by this lane.')
    L.append('')
    L.append('## 4. THE REAL WORLD (the second angle, rule 6): HOW A STUDIO LOCKS A LOOK BEFORE A FRAME IS SHOT')
    L.append('- A 2D animation studio locks colours in a MASTER PALETTE per character, prop and effect; the paint tool refuses a colour outside it, and editing one swatch repaints every zone that used it (Toon Boom Harmony\'s palette model, the industry tool). That is field 4 as a machine gate, in use for decades: the cap is on the palette file, the artist cannot leave it, and the count is never taken on the final composite with the lights and effects on.')
    L.append('- The MODEL SHEET fixes proportions and which colour goes where, per character, from several angles, before animation starts (field 10 and field 4 as one document).')
    L.append('- The COLOUR SCRIPT fixes the palette per sequence as a board of key frames with the colours sketched over them, before production; the big studios\' versions are far more detailed than an independent\'s (field 4 and field 20 as one board, in time order).')
    L.append('- Stop motion, the rig\'s own real-world twin (rule 115): Aardman processes hundreds of pounds of clay several ways so that a character\'s colour and consistency stay the same across a shoot, "the same shade at frame 6800 as it did at frame 1". The palette is a material rule at the source, not a count on the photograph; the light on set is held constant so continuity holds. Same lesson as section 3, from the real world.')
    L.append('')
    L.append('## 5. WHAT DIRECTION READS BEFORE IT PICKS, FIELD BY FIELD (the short form; the table is the long form)')
    L.append('- 2 (pixel size): declare ONE internal canvas and integer scale; 640x360 is the published pick of the two pixel-art games here; Battle Brothers\' 1:1 painting is the other road and it is not ours (rule 114, tell 1). Our person is one size everywhere already (the ground may zoom law); the canvas is the missing number.')
    L.append('- 4 and 5 (palette, cap): a master palette FILE with roles, capped at the source; the cap never measured on a lit render (section 3).')
    L.append('- 6 (light): pick baked OR dynamic for the fight board and the people, never both on one screen; the rig is one hard light baked into the render, so the board\'s tiles must carry the same baked light and no runtime light sits on top.')
    L.append('- 7 and 9 (shading, AA): Dead Cells is the published twin of our pipe (3D, small, no AA, toon steps, hand cleanup where worth it) and it names the leftover defect, flickering pixels; our round-three fault list already has grain and airbrush, so flicker across frames is the one to add to field 17.')
    L.append('- 15 (timing): keys first with the fewest frames that convince, then in-betweens (Dead Cells); ours is 12 keys a bar at 120 BPM and the envelope law; the published practice agrees with drawing fewer keys well.')
    L.append('- 18 (tie-breaker): readability at the smallest size is the only tie-breaker a studio here wrote down; keep it first.')
    L.append('- 8, 11, 12, 13, 16, 17 (outline, detail budget, variation, contact, pairs, mistakes): nobody publishes these; they are ours to set and the gates to hold. The one published hint for 11 is Battle Brothers\': paint at the size it is judged at, because downscaled detail is noise.')
    L.append('')
    L.append('## 6. WHAT COULD NOT BE MEASURED FROM HERE, SAID PER RULE 13')
    L.append('The web is egress-blocked from this machine (every fetch refused with CONNECT 403 on 10/18; the same wall DIRECTION hit 9/28). Every cell comes from search snippets of the named page, not from the page. Not measurable from here, and worth measuring by EYES with the network open: each game\'s hero height in pixels on a 1080p screenshot (run-length histogram, the same instrument as rule 114b gate 1); each game\'s colour count per sprite on an unlit sheet (Blasphemous\' sprite rips on The Spriters Resource would give a true per-sprite count); the outline rule of each (a 1 px darker ring or none) read off the same rips; Battle Brothers\' bust and hex sizes from the unpacked brush metadata (the docs say the size is the cardinal offsets, not the width and height attributes). Those four measurements would turn most of the twenty-two "not published" cells into numbers.')
    L.append('')
    L.append('## 7. SOURCES (the keys in the table)')
    for k, v in d['sources'].items():
        L.append('- [%s] %s' % (k, v))
    L.append('- ours: %s' % d['ours_source'])
    L.append('')
    L.append('## ROUTED (research only; nothing built by this lane)')
    L.append('- DIRECTION [the style guide]: field 5 is a cap on the SOURCE palette, never on a lit render or a screenshot (section 3); the pick list of section 5; the twenty fields\' studio values as the comparison column of the guide.')
    L.append('- PLUMBER [the not vibe coded gates]: gate 2 (palette lock and colour count) needs a source leg and must not count colours on a lit render or a demo screenshot, or it culls the rig\'s sheets before the tab (section 3).')
    L.append('- EYES AND EARS [the five tells by hand]: the four measurements of section 6 when the network opens; they close most of the twenty-two empty cells.')
    L.append('- COMBAT [fight looks]: field 6, the board\'s tiles must carry the rig\'s baked light with no runtime light on top, or the people and the ground disagree.')
    L.append('- TUNING (me, next): once DIRECTION writes the twenty numbers, each becomes a row of the one numbers table with its FEEL line, per the coordinator\'s 10/16 note.')
    L.append('')
    return '\n'.join(L) + '\n'


def page(d):
    n = counts(d)
    H = []
    H.append('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">')
    H.append('<title>THE TWENTY FIELDS, FOUR STUDIOS</title>')
    H.append('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--mark:#7a2e1c}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}p{max-width:72ch}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid var(--line);padding:5px 6px;vertical-align:top;text-align:left}th{background:#e8dfcd}td.n{white-space:nowrap}.np{color:#6b6052;font-style:italic}.f{background:#f1dcd4}.k{font-size:11px;color:#5b5244}</style></head><body>')
    H.append('<h1>THE TWENTY FIELDS, AS FOUR 2D STUDIOS SET THEM</h1>')
    H.append('<p>TUNING, research only. For DIRECTION to read before it picks the style guide\'s numbers (rule 114a). Eighty cells: %d from the studio itself, %d secondary, %d community, %d inference, %d not published by anyone. The one finding: three of the four studios never cap colours per sprite; the colour is decided at the source (a model, a palette file, a normal map) and the lights change it on screen. A colour count on a lit render or a screenshot would reject the rig\'s look. Full page: records/BOHEMIA_TUNING_THE_TWENTY_STYLE_GUIDE_FIELDS_AS_FOUR_STUDIOS_SET_THEM_10_18_26.md</p>' % (n['studio'], n['secondary'], n['community'], n['inference'], n['not published']))
    H.append('<table><thead><tr><th>#</th><th>Field</th><th>Battle Brothers</th><th>Dead Cells</th><th>Blasphemous</th><th>Eastward</th><th>Ours today</th></tr></thead><tbody>')
    for f in d['fields']:
        row = ['<td class="n">%d</td><td><b>%s</b></td>' % (f['n'], html.escape(f['field']))]
        for g, _ in GAMES:
            c = f[g]
            cls = 'np' if c['conf'] == 'not published' else ''
            keys = ' '.join(c.get('src', []))
            row.append('<td class="%s">%s%s<div class="k">%s</div></td>' % (cls, html.escape(c['v']), '' if c['conf'] == 'studio' else ' <i>(%s)</i>' % html.escape(c['conf']), html.escape(keys)))
        row.append('<td class="%s">%s</td>' % ('f' if f['n'] == 5 else '', html.escape(f['ours'])))
        H.append('<tr>' + ''.join(row) + '</tr>')
    H.append('</tbody></table>')
    H.append('<p class="k">Sources: ' + ' '.join('%s = %s' % (html.escape(k), html.escape(v)) for k, v in d['sources'].items()) + '</p>')
    H.append('</body></html>')
    return '\n'.join(H) + '\n'


if __name__ == '__main__':
    d = load()
    if '--write' in sys.argv:
        with open(REC, 'w') as f:
            f.write(md(d))
        with open(PAGE, 'w') as f:
            f.write(page(d))
        print('wrote', REC)
        print('wrote', PAGE)
    else:
        print(json.dumps(counts(d)))
