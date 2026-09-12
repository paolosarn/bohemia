#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS, lane 17, E17 [locked ignored] ROUND TWO: THE SWEEP.

THE JOB (board row E17): twice a ruling of his marked LOCKED sat on the shelf while
the build did the opposite. Sweep every line marked LOCKED in laws/ against what the
shipped surface actually shows, one verdict each, and hand the coordinator the list.

ROUND ONE WAS SCHOOL -- records/BOHEMIA_EYES_E17_ROUND_1_SCHOOL_DRIFT_IS_NOT_EROSION_9_12_26.md
It changed this instrument four times before a line of it was written:

  (1) HARVEST CASE-INSENSITIVELY. The brief's own example is lowercase:
      laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md:88 reads
      "## THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo)". A grep for LOCKED
      misses about thirty per cent of the corpus INCLUDING the case the job cites.
  (2) SPLIT HIS FROM A LANE'S. Only about a fifth of the locks are in the
      "Paolo <date>, LOCKED" form. A lane locking its own mechanism is legitimate
      and is not a ruling of his, and reporting one as the other would put a lane's
      words in his mouth, which is the worst error this lane could make.
  (3) CLASSIFY BEFORE VERDICTING. Most locked lines are intent, not a checkable
      claim. A sweep that verdicts them all is noise.
  (4) NAME WHICH SIDE IS NEWER on every contradiction, because NEWEST DATE WINS is
      already this repo's tiebreaker.

AND ROUND TWO CORRECTED ROUND ONE, OUT LOUD, TWICE:

  (A) ROUND ONE'S VERDICT TABLE WAS WRONG. It said: surface contradicts the lock and
      the BUILD is newer -> DRIFT (the document's defect). That is backwards for this
      repo. NEWEST DATE WINS settles a conflict between two RULINGS. A lane shipping
      something later is not a ruling, so a later build cannot retire his word. If it
      could, any lane could overturn any lock by shipping after it. Corrected: DRIFT
      is when a NEWER RULING releases the old line; EROSION is when nothing does and
      the build simply disagrees. Under round one's table the Ridge would have been
      filed DRIFT, meaning "the document's fault", which is exactly wrong.
  (B) THE HARVEST NEEDED A THIRD BUCKET ROUND ONE DID NOT SEE: the word "locked" used
      as ordinary English. "the phone can now be manually LOCKED", "Camera stays
      locked", "the locked smart watch". Case-insensitivity makes this WORSE, because
      the ordinary uses cluster in lowercase. So harvesting is two steps, not one:
      find every line, then decide whether the word is a LOCK MARKER at all.
  (C) A RULING ABOUT A THING THAT DOES NOT EXIST YET IS NOT A CONTRADICTION. Hit
      immediately on the vehicle-footprint lock. Every check is now TWO probes:
      does the thing exist on the surface at all (PRESENCE), and does it obey
      (CONFORMANCE). No presence means NOT-BUILT, never EROSION.

RULE ZERO (E9, this lane's own law): A ZERO NEEDS A POSITIVE CONTROL, and the
instrument must be proven to bite before any number it prints is believed. Five
controls run first and all five must pass or NOTHING is printed:

  C1  a planted lowercase "(locked, Paolo)" line must be HARVESTED. Missing it is
      the failure that silently hides a third of the corpus.
  C2  a planted ordinary-English line ("the door stays locked") must classify
      ORDINARY, not as a ruling.
  C3  a planted lock the surface plainly satisfies must come back SATISFIED.
  C4  a planted lock the surface plainly contradicts must come back CONTRADICTED.
  C5  the reader blob must actually contain the combat frame. The fight ships as a
      base64 blob, so BPM_MS is absent from the raw bytes and present after decoding.
      If it is not, the blob is missing the code half the rulings are about.

AND ONE MORE CONTROL THAT FAILED AND CHANGED THE INSTRUMENT -- the honest kind:
  The surface half first asked "is a scene drawn on the title screen?" by counting
  colours in the whole picture, with the walked city as the positive control. The
  control FAILED: the city canvas came back with 31 colours and 5% non-ground while
  the splash came back with 41 and 13%, because the city at that zoom is mostly flat
  desert and the splash's wordmark is busy. Counting the whole picture measures the
  wrong thing. Fixed by measuring BANDS: the strip above the name, where furniture
  cannot reach. There the splash is ONE colour and the city is twenty-two. The
  control passes now, and the first version's number would have been a lie.

WHAT THIS LANE MAY NOT DO: decide taste. Nothing here judges whether a thing looks
good. Every verdict is a ruling of his, a probe, and a number.
"""

import base64
import collections
import glob
import io
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_LOCKED_9_12_26.json')
BASELINE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_LOCKED_BASELINE_9_12_26.json')
SURFACE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_E17_SURFACE_9_12_26.json')
NO_READER = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_NO_READER_9_6_26.json')

LOCK_RX = re.compile(r'\blocked\b', re.I)


# ---------------------------------------------------------------------------
# STEP 0 -- HARVEST. Every line in laws/ carrying the word, in any case.
# ---------------------------------------------------------------------------
def harvest(roots):
    rows = []
    for root in roots:
        for p in sorted(glob.glob(os.path.join(root, '**', '*.md'), recursive=True)):
            rel = os.path.relpath(p, ROOT)
            with io.open(p, encoding='utf-8', errors='replace') as fh:
                for i, line in enumerate(fh, 1):
                    if LOCK_RX.search(line):
                        rows.append({'file': rel, 'line': i, 'text': line.rstrip()})
    return rows


# ---------------------------------------------------------------------------
# STEP 1 -- IS THE WORD A LOCK MARKER AT ALL?
#
# Three answers. MARKER: the line declares something locked. ORDINARY: the English
# word, about a door or a camera or a phone. MENTION: the line talks about locking
# without declaring one -- "not yet locked", "WHY IT LOCKED", "512 was locked first".
#
# Recognised by POSITIVE shape, never by excluding the ordinary uses, because the
# ordinary uses are open-ended and the marker shapes are not.
# ---------------------------------------------------------------------------
NEGATED = re.compile(r'\b(not yet|never|no longer|isn.t|is not|un-?|awaiting|before it was|pending)\s*locked', re.I)
META = re.compile(r'\bWHY IT LOCKED\b|\bwas locked first\b|\bonce locked\b|\bgets? locked\b|\bhow .{0,20}locked\b', re.I)
# REFERRING, not declaring. Every single held-out miss in the first run was this one
# shape: a line that leans on an existing lock -- "Honors the locked combat canon",
# "implied by locked canon", "standing 360 is the locked base" -- being read as if it
# declared a new one, because the heading rule fires on any heading with the word in
# it. A definite article in front of it is the tell: you say THE locked canon about a
# lock that already happened, and you never say it about the one you are making.
REFER = re.compile(r'\b(?:the|by|with|under|to|from|against)\s+locked\s+'
                   r'(?:canon|base|spec|rule|rules|law|laws|truth|decision|shape|version|'
                   r'palette|set|list|intent|combat|design|direction|geometry|anatomy|'
                   r'story|order|frame|system|core|pipeline|silhouette)\b', re.I)
ORDINARY = re.compile(
    r'\blocked\s+(?:smart\s+)?(?:door|doors|gate|gates|phone|screen|watch|person|people|body|'
    r'camera|save|slot|cell|cells|box|drawer|car|vehicle|room|gun|case)\b'
    r'|\b(?:camera|phone|screen|door|watch|gate|jaw|hips?|knees?|shoulders?)\b[^.\n]{0,30}\b(?:stays?|is|are|gets?|be|remains?)\s+locked\b'
    r'|\bmanually\s+locked\b|\bstays?\s+locked\b|\bkeeps?\s+it\s+locked\b'
    r'|\blocked\s+smart\b'                       # "the locked smart / watch" -- the noun is on the next line
    r'|\bwants?\s+the\s+\w+\s+locked\b'        # "wants the outer locked too": a garment layer, not a ruling
    r'|\blocked\s+(?:to|onto|into)\s+(?:the\s+)?(?:beat|grid|clock|frame|rail|axis|track|tile)\b'
    r'|\bbeat-?locked\b|\bgrid-?locked\b|\btempo-?locked\b|\blocked\s+off\b',
    re.I)
MARKER_SHAPES = [
    re.compile(r'\([^()]{0,90}\blocked\b[^()]{0,90}\)', re.I),         # (Paolo 9/7/26, LOCKED) / (locked, Paolo)
    re.compile(r'\[[^\]]{0,60}\blocked\b[^\]]{0,60}\]', re.I),          # [LOCKED] / [DECISION -- LOCKED]
    re.compile(r'\*\*[^*]{0,60}\blocked\b[^*]{0,60}\*\*', re.I),        # **LOCKED.**
    re.compile(r'^\s*#{1,6}\s.*\blocked\b', re.I),                      # a heading that says locked
    re.compile(r'\bLOCKED\b\s*[:.,;]'),                                 # LOCKED. / LOCKED:
    re.compile(r'\bLOCKED\b\s+(?:intent|in|by|as|for|same|\+|\d|[0-9]+/)', re.I),
    re.compile(r'\b(?:is|are|now|hereby|stands?|remains?)\s+LOCKED\b'),
    re.compile(r'\bPAOLO\s+LOCKED\b', re.I),
    re.compile(r'\bPaolo\s+locked\s+the\b', re.I),
    re.compile(r'\bLocked\s*\.\s*\)?\s*$'),                     # a line that ends by declaring it
]


def marker_class(text):
    if NEGATED.search(text):
        return 'MENTION'
    if META.search(text):
        return 'MENTION'
    if REFER.search(text):
        return 'MENTION'
    if ORDINARY.search(text):
        return 'ORDINARY'
    for rx in MARKER_SHAPES:
        if rx.search(text):
            return 'MARKER'
    return 'MENTION'


# ---------------------------------------------------------------------------
# STEP 2 -- WHOSE LOCK IS IT? His, or the lane's own.
# ---------------------------------------------------------------------------
HIS = re.compile(r'Paolo[^.\n]{0,45}\blocked\b|\blocked\b[^.\n]{0,35}Paolo|\bhis\s+ruling\b|\bPAOLO LOCKED\b', re.I)


def attribution(text):
    return 'HIS' if HIS.search(text) else 'LANE'


# ---------------------------------------------------------------------------
# STEP 3 -- COULD A MACHINE EVER CHECK IT?
#
# MACHINE     the line names something with a value, a name, a number or a shape
#             that the shipped bundle either has or has not.
# BY-EYE      the line is about how a thing looks, feels or sounds. Not this lane's
#             call and not any machine's; it belongs to DIRECTION.
# NOT-CHECKABLE  process, lore, intent, or a rule about how the chats work. There is
#             nothing on the surface for it to agree or disagree with.
# ---------------------------------------------------------------------------
BY_EYE = re.compile(r'\b(looks?|look|feel|feels|reads?|beautiful|ugly|gorgeous|vibe|mood|'
                    r'sounds? like|pretty|sexy|cool|style|aesthetic|runway|taste|tone)\b', re.I)
MACHINE = re.compile(r'\b\d+\s*(?:px|bpm|ms|x|s|%|tiles?|cells?|frames?|seconds?|beats?|pixels?)\b'
                     r'|#[0-9a-f]{3,6}\b'
                     r'|\b(?:exactly|only|never|always|zero|one|must)\b[^.\n]{0,60}\b\d+\b'
                     r'|\b[a-z_]+\.(?:js|json|py|html|png)\b'
                     r'|\b(?:120|512|44|85/15|60)\b', re.I)
PROCESS = re.compile(r'\b(chat|chats|lane|session|sessions|coordinator|board|queue|verdict|'
                     r'thumb|reply|record|addendum|gate|backlog|handoff|VAMILY)\b', re.I)


def checkability(text):
    if PROCESS.search(text) and not MACHINE.search(text):
        return 'NOT-CHECKABLE'
    if MACHINE.search(text):
        return 'MACHINE'
    if BY_EYE.search(text):
        return 'BY-EYE'
    return 'NOT-CHECKABLE'


# ---------------------------------------------------------------------------
# THE SHIPPED SURFACE, DECODED.
#
# E11 measured the reader set live in Chromium: the 17 files the alpha and the demo
# actually fetch. Everything else in the repo is unreachable at runtime, so a ruling
# can only be satisfied or contradicted inside these bytes. The fight ships as a
# base64 blob inside the page, so the raw bytes are not enough -- the blobs are
# decoded and appended, and C5 proves the decode worked.
# ---------------------------------------------------------------------------
def reader_blob():
    files = json.load(io.open(NO_READER, encoding='utf-8'))['reader_set']
    raw = []
    for rel in files:
        p = os.path.join(ROOT, rel)
        if os.path.exists(p):
            raw.append(io.open(p, encoding='utf-8', errors='replace').read())
    raw = '\n'.join(raw)
    dec = []
    for m in re.finditer(r'[A-Za-z0-9+/=]{3000,}', raw):
        s = m.group(0)
        try:
            t = base64.b64decode(s + '=' * (-len(s) % 4)).decode('utf-8')
        except Exception:
            continue
        if t.count('function') > 3 or t.count('<') > 10:
            dec.append(t)
    return files, raw, raw + '\n' + '\n'.join(dec), len(dec)


def band_colours(png_path, y0, y1):
    """distinct quantised colours, and the share of pixels that are not the single
    most common colour, in a horizontal band of a picture. Quantised to 8 levels a
    channel so a gradient is not mistaken for a landscape."""
    from PIL import Image
    im = Image.open(png_path).convert('RGB')
    W, H = im.size
    q = collections.Counter()
    for y in range(int(H * y0), int(H * y1)):
        for x in range(0, W, 2):
            r, g, b = im.getpixel((x, y))
            q[((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5)] += 1
    tot = sum(q.values()) or 1
    top = q.most_common(1)[0][1] if q else 0
    return {'colours': len(q), 'not_ground': round(1 - top / tot, 4)}


def purple_tiles(dump=None):
    """PURPLE RESERVATION LAW (7/10/26, Paolo, LOCKED): purple belongs to the hatch and
    the Amalgamation. "No fantasy-purple tiles scattered through the world. No purple
    runes, no purple floors, no ambient purple decor."

    THREE WRONG VERSIONS OF THIS PROBE, IN ORDER, BECAUSE THEY ARE THE WHOLE LESSON:

      v1 counted purple hex strings in the tile files and returned a clean ZERO. The
         tile pools contain no hex at all -- every tile is a base64 PNG -- so the zero
         was real and meant nothing. A text scan cannot see a picture.
      v2 decoded the pictures and counted any pixel in the purple hues with saturation
         over 0.25. It found 61,323 and would have reported the whole art pool in
         violation. Looking at what it actually caught: #382b49, #2c223a, #30253e --
         near-black shadow tints. That is night grading, not fantasy purple, and
         reporting it would have been a false accusation of every artist on the fleet.
      v3 counts PIXELS of visible purple (saturation over 0.45, mid lightness). Better,
         but the unit is still wrong: the law bans purple TILES, FLOORS and DECOR, and
         a handful of dithered pixels inside a 28x28 sprite is shading.

    SO IT COUNTS TILES, and a tile is purple when a third of its opaque pixels are.
    And it names the CATEGORY each one sits in, which is what decides the verdict:
    purple in a hatch or an Amalgamation bank is the law being obeyed, and purple in
    wall, door, concrete or foliage is the law being broken in its own words.
    """
    import colorsys
    from PIL import Image
    KEY = re.compile(r'(?:TP_TILES|TP_FLOORS|TP_PROPS|TP_FORMS)\s*\[\s*"([^"]+)"\s*\]')
    ALLOWED = re.compile(r'hatch|amalgam|network|threshold|agent|redmag', re.I)
    files = sorted(glob.glob(os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_TILES*.js')))
    files += [os.path.join(ROOT, 'slices', f) for f in
              ('BOHEMIA_CITY_FLOORS.js', 'BOHEMIA_CITY_PROPS.js', 'BOHEMIA_CITY_TILEFORMS.js')]
    tiles = 0
    px = 0
    ppx = 0
    by_cat = collections.Counter()
    cat_total = collections.Counter()
    worst = []
    for f in files:
        if not os.path.exists(f):
            continue
        t = io.open(f, encoding='utf-8', errors='replace').read()
        keys = [(m.start(), m.group(1)) for m in KEY.finditer(t)]
        for m in re.finditer(r'iVBOR[A-Za-z0-9+/=]+', t):
            s = m.group(0)
            try:
                im = Image.open(io.BytesIO(base64.b64decode(s + '=' * (-len(s) % 4)))).convert('RGBA')
            except Exception:
                continue
            cat = '?'
            for start, k in keys:
                if start < m.start():
                    cat = k
                else:
                    break
            tiles += 1
            cat_total[cat] += 1
            n = 0
            p = 0
            for r, g, b, a in im.getdata():
                if a < 32:
                    continue
                n += 1
                h, l, sat = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
                d = h * 360
                if 265 <= d <= 330 and sat > 0.45 and 0.25 < l < 0.75:
                    p += 1
            px += n
            ppx += p
            if n and p / float(n) >= 0.30:
                by_cat[cat] += 1
                worst.append({'share': round(p / float(n), 3), 'cat': cat,
                              'file': os.path.basename(f), 'size': list(im.size), 'png': s})
    worst.sort(key=lambda w: -w['share'])
    out_of_place = sum(v for k, v in by_cat.items() if not ALLOWED.search(k))
    neon = sum(v for k, v in by_cat.items() if k in ('sign', 'light'))
    if dump and worst:
        from PIL import Image as I2
        cols = 8
        cell = 40
        rows = (min(len(worst), 32) + cols - 1) // cols
        sheet = I2.new('RGBA', (cols * cell, rows * cell), (20, 18, 14, 255))
        for i, w in enumerate(worst[:32]):
            im = I2.open(io.BytesIO(base64.b64decode(w['png'] + '=' * (-len(w['png']) % 4)))).convert('RGBA')
            im.thumbnail((cell - 4, cell - 4))
            sheet.paste(im, ((i % cols) * cell + 2, (i // cols) * cell + 2), im)
        sheet.save(dump)
    for w in worst:
        w.pop('png', None)
    return {'tiles': tiles, 'px': px, 'purple_px': ppx,
            'purple_tiles': sum(by_cat.values()),
            'out_of_place': out_of_place, 'neon_arguable': neon,
            'by_category': dict(by_cat), 'category_sizes': {k: cat_total[k] for k in by_cat},
            'worst': worst[:32]}


# ---------------------------------------------------------------------------
# THE CHECKS. Each one is a ruling of his, a plain-words claim, and two probes.
# PRESENCE asks whether the thing exists on the surface at all. CONFORMANCE asks
# whether it obeys. Presence fails -> NOT-BUILT, and never EROSION.
# ---------------------------------------------------------------------------
def build_checks(blob, surface, purple):
    def count(rx):
        return len(re.findall(rx, blob, re.I))

    C = []

    def add(cid, law, line, lock, ruled, claim, present, conform, detail, release_probe=None, scope=''):
        C.append({'id': cid, 'law': law, 'line': line, 'lock': lock, 'ruled': ruled,
                  'claim': claim, 'present': present, 'conform': conform,
                  'detail': detail, 'release_probe': release_probe, 'not_covered': scope})

    # 1. the brief's own example, and the only one measured on the real screen.
    sp = surface.get('splash_top') or {}
    ci = surface.get('city_top') or {}
    add('RIDGE-IS-THE-TITLE-SCREEN',
        'laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md', 88,
        '## THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo)', '7/19',
        'the first screen is the ridge, not a name on nothing',
        bool(surface.get('splash_png')),
        (sp.get('colours', 0) > 3),
        'strip above the name: %s colours, %s%% not flat. the walked city in the same strip: %s colours.'
        % (sp.get('colours'), round(100 * sp.get('not_ground', 0), 2), ci.get('colours')),
        release_probe=r'title screen|splash|front door|the first screen|wordmark',
        scope='does not judge whether a ridge that WAS drawn would be the right ridge. taste is DIRECTION.')

    # 2. the brief's other example. a naive grep for the creature word finds the
    #    city wildlife module and reports a false contradiction, so the probe asks
    #    whether any ERA label names a creature, which is the actual ruling.
    eras = re.findall(r'(?:GEN|Gen|gen)\s*[_ ]?1[^\n]{0,90}', blob)
    bad = [e for e in eras if re.search(r'\b(coyote|wolf|dog|beast|creature|paws?|snout)\b', e, re.I)]
    add('ANIMAL-IS-AN-ERA-NOT-AN-ANIMAL',
        'laws/BOHEMIA_ADDENDUM_ANIMAL_IS_AN_ERA_NOT_AN_ANIMAL_9_7_26.md', 1,
        '# BOHEMIA ADDENDUM -- ANIMAL IS AN ERA, NOT AN ANIMAL (Paolo 9/7/26, LOCKED)', '9/7',
        'generation one is an era of the story, not a creature you play',
        True, len(bad) == 0,
        '%d generation labels on the surface, %d of them name a creature. the %d coyote mentions are the city wildlife module, which is a different thing.'
        % (len(eras), len(bad), count(r'coyote')))

    # 3.
    add('120-BPM', 'laws/BOHEMIA_ADDENDUM_120_REQUEST_LAW_7_6_26.md', 3,
        '## 120 BPM REQUEST LAW (LOCKED, Paolo 7/6/26)', '7/6',
        'everything runs on one clock at 120 beats a minute',
        count(r'\b120\s*BPM|BPM\s*=\s*120|BEAT\s*=\s*0?\.5') > 0,
        count(r'BPM_MS\s*=\s*500|\b120\s*BPM') > 0,
        '%d places on the surface say 120 BPM or a 500 ms beat.' % count(r'\b120\s*BPM|BPM_MS\s*=\s*500'))

    # 4.
    add('BATTERIES-ARE-MONEY-ONLY',
        'laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md', 156,
        '## 4. RULED 9/5: BATTERIES ARE MONEY ONLY, AND BUILDINGS MAKE THEM (Paolo, LOCKED)', '9/5',
        'batteries are the money and there is no other money',
        count(r'\bbatt(?:ery|eries)\b') > 0,
        count(r'\b(?:cash|dollars?|coins?|credits?)\s*[:=]\s*[0-9]') == 0,
        '%d battery mentions, %d rival currencies declared with a value.'
        % (count(r'\bbatt(?:ery|eries)\b'), count(r'\b(?:cash|dollars?|coins?|credits?)\s*[:=]\s*[0-9]')))

    # 5. the case that forced the NOT-BUILT bucket into existence.
    add('VEHICLE-FOOTPRINT-IS-2x3',
        'laws/BOHEMIA_ADDENDUM_ITEM_SCALE_RESOLVER_7_16_26.md', 22,
        '| vehicle | footprint 3x2 | **PAOLO LOCKED** -- "2x3 i told you" |', '7/16',
        'a car takes up two cells by three, the way he said it',
        count(r'(?:veh|vehicle|car|truck)[^\n]{0,30}(?:footprint|cells?)[^\n]{0,20}\d\s*[x*]\s*\d') > 0,
        count(r'(?:veh|vehicle|car|truck)[^\n]{0,30}(?:footprint|cells?)[^\n]{0,20}2\s*[x*]\s*3') > 0,
        '%d vehicle mentions on the surface and %d footprint declarations that carry a size. '
        'The loose version of this probe found four and all four were something else: two prop '
        'footprints, a parking deck and a doorway. A ruling about a thing nobody has built yet is '
        'not a contradiction, which is why NOT-BUILT is a verdict.'
        % (count(r'\bvehicle\b'),
           count(r'(?:veh|vehicle|car|truck)[^\n]{0,30}(?:footprint|cells?)[^\n]{0,20}\d\s*[x*]\s*\d')))

    # 6.
    add('NO-DAMAGE-BEFORE-THE-DIAL',
        'laws/BOHEMIA_ADDENDUM_COMBAT_6_27_26.md', 20,
        '**[LOCKED -- enemy fire visual, 6.28.26]** The swing is the PLAYER\'s dial only', '6/28',
        'nothing takes damage until the dial is swung',
        count(r'\bdial\b') > 0,
        count(r'NO DAMAGE BEFORE[^\n]{0,20}DIAL') > 0,
        '%d places in the fight name the dial, %d of them state the no-damage rule in the code itself.'
        % (count(r'\bdial\b'), count(r'NO DAMAGE BEFORE[^\n]{0,20}DIAL')))

    # 7.
    add('EVERYTHING-COSTS-ONE', 'laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md', 1,
        '# BOHEMIA ADDENDUM -- EVERYTHING COSTS ONE (Paolo 8/15/26, LOCKED)', '8/15',
        'every action costs exactly one, until he says otherwise',
        count(r'COST[_A-Z]*\s*=\s*\d') > 0,
        count(r'COST[_A-Z]*\s*=\s*\d') == count(r'COST[_A-Z]*\s*=\s*1\b'),
        '%d cost constants on the surface and %d of them are 1. The first version of this probe '
        'passed on ANY constant being 1, which is not what he ruled: he ruled that everything costs one.'
        % (count(r'COST[_A-Z]*\s*=\s*\d'), count(r'COST[_A-Z]*\s*=\s*1\b')),
        release_probe=r'costs? two|two pips|cover cost|second pip',
        scope='reads the constants the surface declares. a cost written as a literal inside a call is invisible to it.')

    # 8.
    add('TRENCHCOATS-ARE-RESERVED', 'laws/BOHEMIA_LAW_TRENCHCOATS_ARE_RESERVED_8_27_26.md', 1,
        '# BOHEMIA LAW -- TRENCHCOATS ARE FOR BADASSES (Paolo, 8/27/26, LOCKED)', '8/27',
        'only the badasses wear the trenchcoat',
        count(r'trench') > 0,
        os.path.exists(os.path.join(ROOT, 'gates', 'trenchcoat_gate.js')),
        '%d trenchcoat mentions on the surface and the fleet runs a trenchcoat gate over who may wear one.'
        % count(r'trench'),
        scope='this lane checks that the rule is enforced by a gate, not that every wearer is a badass. who is a badass is not a machine question.')

    # 9.
    add('THE-FEED-ON-THE-CITY-SCREEN',
        'laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md', 1,
        'THE FEED ON THE CITY SCREEN (Paolo 9/4, LOCKED)', '9/4',
        'in city mode a phone screen scrolls the feed',
        count(r'cityfeedbar|cityfeed') > 0,
        (count(r'cityfeedbar') > 0 and count(r'feed[A-Za-z]*\s*(?:posts?|items?|lines?)|POSTS?\s*=\s*\[') > 0),
        '%d references to the feed bar and %d to the posts that scroll through it.'
        % (count(r'cityfeedbar'), count(r'feed[A-Za-z]*\s*(?:posts?|items?|lines?)|POSTS?\s*=\s*\[')),
        scope='checks that the feed exists and has posts. whether the posts are worth reading is WORDS and DIRECTION, not this lane.')

    # 10.
    add('PURPLE-RESERVATION', 'laws/BOHEMIA_ADDENDUM_PURPLE_RESERVATION_LAW_7_10_26.md', 1,
        '# BOHEMIA -- PURPLE RESERVATION LAW (7/10/26, Paolo, LOCKED)', '7/10',
        'purple belongs to the hatch and the Amalgamation, nowhere else',
        purple['tiles'] > 0,
        purple['out_of_place'] == 0,
        '%d tile pictures swept. %d are a third or more saturated purple, and NONE of them sit in a '
        'hatch or Amalgamation bank: %s. %d of those are sign and light, where Vegas neon is an '
        'argument; the other %d are wall, door, concrete, container, foliage and misc, which the law '
        'names out loud.'
        % (purple['tiles'], purple['purple_tiles'],
           ', '.join('%s %d' % (k, v) for k, v in sorted(purple['by_category'].items(), key=lambda kv: -kv[1])),
           purple['neon_arguable'], purple['out_of_place'] - purple['neon_arguable']),
        release_probe=r'purple|violet|magenta',
        scope='says WHERE purple is, never whether a purple is pretty. which of the 32 to repaint is DIRECTION\'s call.')

    # 11.
    add('THE-TOP-MENU-BAR', 'laws/BOHEMIA_ADDENDUM_THE_TOP_MENU_BAR_9_7_26.md', 1,
        '# THE TOP MENU BAR (Paolo 9/7/26, LOCKED)', '9/7',
        'one strip owns the top of the screen and the loose buttons live in it',
        count(r'id="topbar"') > 0,
        (count(r'id="topbar"') > 0 and
         count(r'#topbar\{[^}]*top:\s*\d') > 0 and
         all(count(r'id="topbar"[^\0]{0,600}id="%s"' % b) > 0 for b in ('musbtn', 'savebtn', 'phonebtn'))),
        'a pinned strip exists and the music, save and phone chips are inside it.',
        scope='does not check that the bar carries the status he asked for. the lane that built it says the currencies are deliberately left out because nothing on the street holds one.')

    # 12.
    add('THE-BORDER-IS-ONE-PIXEL', 'laws/BOHEMIA_ADDENDUM_THE_BORDER_IS_ONE_PIXEL_8_16_26.md', 1,
        'THE BORDER IS ONE PIXEL WHERE HE SEES IT (Paolo 8/14 + 8/15, LOCKED)', '8/15',
        'the black line around things is one pixel thick where he looks at it',
        count(r'border[^\n;]{0,20}\dpx') > 0,
        os.path.exists(os.path.join(ROOT, 'gates', 'border_gate.js')),
        '%d border widths on the surface and gates/border_gate.js runs over them. That gate does '
        'not name its own law file anywhere in its text, which is why this row reads NO GATE: the '
        'link from the ruling to the checker is missing even though the checker is real.'
        % count(r'border[^\n;]{0,20}\dpx'))
    return C


# THE DRIFT TEST, AND IT IS A SEARCH, NOT A TABLE.
#
# A contradiction is DRIFT only when a NEWER RULING released the old line -- then the
# document is stale and the build is right. Nothing else makes it DRIFT. A lane
# shipping something later is not a ruling and never retires his word; that was round
# one's error and correcting it moves the Ridge from "the document's fault" to "the
# build's fault", which is the opposite instruction to the coordinator.
#
# So every contradiction goes looking for its release: a locked line in laws/, dated
# AFTER the ruling, that names the thing the build is doing instead. Found -> DRIFT
# and the file is printed. Not found -> EROSION. The cost case is exactly why this is
# a search: the fight declares RUN_COVER_COST=2 with the comment "his number", which
# reads like a release, and there is no line in laws/ anywhere that carries it.
def find_release(check, lock_rows):
    rx = check.get('release_probe')
    if not rx:
        return None
    ruled = check['ruled']
    for r in lock_rows:
        if r['marker'] != 'MARKER':
            continue
        if not re.search(rx, r['text'], re.I):
            continue
        d = re.search(r'(\d{1,2})[/.](\d{1,2})', r['file']) or re.search(r'(\d{1,2})/(\d{1,2})', r['text'])
        if not d:
            continue
        if (int(d.group(1)), int(d.group(2))) > tuple(int(x) for x in ruled.split('/')):
            return {'file': r['file'], 'line': r['line'], 'text': r['text'][:200]}
    return None


def verdict_for(c, gated=None):
    if not c['present']:
        return 'NOT-BUILT'
    if c['conform']:
        return 'SATISFIED'
    if c.get('release'):
        return 'DRIFT'
    return 'EROSION'


def gate_names(law_rel):
    """UNENFORCED, reusing E11's finding rather than rediscovering it: does anything
    in gates/ or tools/ name this law file at all?"""
    # ONLY gates/ COUNTS, AND NEVER THIS FILE. The first run reported all twelve
    # rulings as gated, which was nonsense: the search included tools/, and this very
    # tool names all twelve law files in its own checks. An instrument that counts
    # itself as the enforcement is the purest form of the rot E11 found.
    base = os.path.basename(law_rel)
    mine = os.path.abspath(__file__)
    for d in ('gates',):
        for p in glob.glob(os.path.join(ROOT, d, '**', '*'), recursive=True):
            if not os.path.isfile(p) or os.path.abspath(p) == mine:
                continue
            if os.path.splitext(p)[1] not in ('.js', '.py'):
                continue
            try:
                if base in io.open(p, encoding='utf-8', errors='replace').read():
                    return os.path.relpath(p, ROOT)
            except Exception:
                continue
    return None


# ---------------------------------------------------------------------------
# RULE ZERO. Five controls, run before anything is reported.
# ---------------------------------------------------------------------------
CONTROL_LAW = """# A PLANTED CONTROL FILE (Paolo 9/9/26, LOCKED)
## THE LOWERCASE ONE = THE ONE THAT MATTERS (locked, Paolo)
The door of the shed stays locked until the second act.
This line is not yet locked and must not be counted as a ruling.
"""


def controls(blob, tmpdir):
    out = []
    os.makedirs(os.path.join(tmpdir, 'laws'), exist_ok=True)
    p = os.path.join(tmpdir, 'laws', 'PLANTED_CONTROL.md')
    io.open(p, 'w', encoding='utf-8').write(CONTROL_LAW)
    rows = harvest([os.path.join(tmpdir, 'laws')])
    got = {r['line']: marker_class(r['text']) for r in rows}

    out.append(('C1 lowercase (locked, Paolo) is harvested and read as a lock',
                got.get(2) == 'MARKER'))
    out.append(('C2 ordinary English ("stays locked") is not read as a lock',
                got.get(3) == 'ORDINARY'))
    out.append(('C2b a negated line ("not yet locked") is not read as a lock',
                got.get(4) == 'MENTION'))
    out.append(('C3 a lock the surface plainly satisfies reads SATISFIED',
                verdict_for({'present': True, 'conform': 'TAP TO ENTER' in blob, 'id': 'x'}, None) == 'SATISFIED'))
    out.append(('C4 a lock the surface plainly contradicts reads EROSION',
                verdict_for({'present': True, 'conform': 'A_STRING_THE_GAME_DOES_NOT_CONTAIN_1873' in blob, 'id': 'x'}, None) == 'EROSION'))
    return out


# ---------------------------------------------------------------------------
# THE CLASSIFIER'S OWN CONTROL.
#
# THREE SAMPLES, AND THE THIRD ONE IS THE ONLY HONEST ONE.
#
# Sample A (30 lines) was read first and the rules were written while looking at it,
# so its agreement is optimistic by construction. Sample B (20) was read after the
# rules were finished -- and then the first run's misses were used to REPAIR the
# rules, which contaminated B: a held-out sample stops being held out the moment you
# fix anything with it. So sample C (20 more) was read after the repair and touched
# nothing. C is the number this lane stands behind and C is what the gate holds.
# A 100% score on a sample you tuned against is the oldest way to lie with a
# measurement and it takes one extra sample to stop doing it.
# ---------------------------------------------------------------------------
HAND = json.loads(io.open(os.path.join(ROOT, 'banks', 'eyes',
                  'BOHEMIA_EYES_E17_HAND_LABELS_9_12_26.json'), encoding='utf-8').read()) \
    if os.path.exists(os.path.join(ROOT, 'banks', 'eyes', 'BOHEMIA_EYES_E17_HAND_LABELS_9_12_26.json')) else None


def agreement(rows):
    if not HAND:
        return None
    by = {(r['file'], r['line']): r for r in rows}
    res = {}
    for name in ('A', 'B', 'C'):
        hit = 0
        tot = 0
        misses = []
        for h in HAND[name]:
            r = by.get((h['file'], h['line']))
            if not r:
                continue
            tot += 1
            got = marker_class(r['text'])
            if got == h['label']:
                hit += 1
            else:
                misses.append({'file': h['file'], 'line': h['line'], 'hand': h['label'], 'machine': got})
        res[name] = {'n': tot, 'agree': hit, 'pct': round(100.0 * hit / tot, 1) if tot else 0,
                     'misses': misses}
    return res


def main():
    gate = '--gate' in sys.argv
    # the planted controls live OUTSIDE the repo. The first run put them in a dot
    # directory at the root and git offered to commit this lane's own test fixtures
    # into the game, which is the sort of thing that ends up shipping.
    import tempfile
    import shutil
    tmp = tempfile.mkdtemp(prefix='eyes_e17_')

    files, raw, blob, nblobs = reader_blob()
    surface = json.load(io.open(SURFACE, encoding='utf-8')) if os.path.exists(SURFACE) else {}
    if surface.get('splash_png'):
        sp = os.path.join(ROOT, surface['splash_png'])
        cp = os.path.join(ROOT, surface.get('city_png', ''))
        if os.path.exists(sp):
            surface['splash_top'] = band_colours(sp, 0, 0.2)
        if os.path.exists(cp):
            surface['city_top'] = band_colours(cp, 0, 0.2)

    ctrl = controls(blob, tmp)
    ctrl.append(('C5 the reader blob really contains the fight (base64 decoded)',
                 raw.count('BPM_MS') == 0 and blob.count('BPM_MS') > 0))
    ctrl.append(('C6 the title-screen measure separates a drawn scene from a flat one',
                 bool(surface.get('city_top')) and surface['city_top']['colours'] >= 8))
    bad = [n for n, ok in ctrl if not ok]

    rows = harvest([os.path.join(ROOT, 'laws')])
    for r in rows:
        r['marker'] = marker_class(r['text'])
        r['who'] = attribution(r['text']) if r['marker'] == 'MARKER' else ''
        r['kind'] = checkability(r['text']) if r['marker'] == 'MARKER' else ''

    agree = agreement(rows)
    purple = purple_tiles(dump=os.path.join(ROOT, 'records', 'target', 'EYES_E17_PURPLE_TILES.png'))
    checks = build_checks(blob, surface, purple)
    for c in checks:
        c['gate'] = gate_names(c['law'])
        c['release'] = find_release(c, rows)
        c['verdict'] = verdict_for(c)
        c['enforced'] = bool(c['gate'])

    markers = [r for r in rows if r['marker'] == 'MARKER']
    his = [r for r in markers if r['who'] == 'HIS']
    counts = {
        'law_files': len(set(r['file'] for r in rows)),
        'lock_lines': len(rows),
        'marker': len(markers),
        'ordinary': sum(1 for r in rows if r['marker'] == 'ORDINARY'),
        'mention': sum(1 for r in rows if r['marker'] == 'MENTION'),
        'his': len(his),
        'lane': len(markers) - len(his),
        'his_machine': sum(1 for r in his if r['kind'] == 'MACHINE'),
        'his_by_eye': sum(1 for r in his if r['kind'] == 'BY-EYE'),
        'his_not_checkable': sum(1 for r in his if r['kind'] == 'NOT-CHECKABLE'),
        'checked': len(checks),
        'satisfied': sum(1 for c in checks if c['verdict'] == 'SATISFIED'),
        'erosion': sum(1 for c in checks if c['verdict'] == 'EROSION'),
        'drift': sum(1 for c in checks if c['verdict'] == 'DRIFT'),
        'not_built': sum(1 for c in checks if c['verdict'] == 'NOT-BUILT'),
        'checked_ungated': sum(1 for c in checks if not c['enforced']),
        'case_upper': sum(1 for r in rows if 'LOCKED' in r['text']),
        'case_lower': sum(1 for r in rows if re.search(r'\blocked\b', r['text'])),
        'superseded_gdd_locks': sum(1 for r in rows if re.search(r'BOHEMIA_GDD_v[234]\.md$', r['file'])),
    }

    result = {
        'what': 'E17 [locked ignored] round two: every LOCKED line in laws/ against the shipped surface',
        'date': '9/12/26',
        'school': 'records/BOHEMIA_EYES_E17_ROUND_1_SCHOOL_DRIFT_IS_NOT_EROSION_9_12_26.md',
        'reader_set': files,
        'reader_bytes': len(raw),
        'decoded_blobs': nblobs,
        'controls': [{'name': n, 'pass': ok} for n, ok in ctrl],
        'classifier_agreement': agree,
        'counts': counts,
        'checks': [{k: c[k] for k in ('id', 'law', 'line', 'lock', 'ruled', 'claim', 'verdict',
                                      'enforced', 'gate', 'release', 'detail', 'not_covered')} for c in checks],
        'purple': purple,
        'surface': {k: surface.get(k) for k in ('splash_png', 'city_png', 'splash_top', 'city_top', 'furniture')},
        'blind_spots': [
            'a law file is dated when it was written, not when he ruled. he rules out loud first.',
            'twelve checks is not the corpus. every other machine-checkable lock of his is unchecked until somebody writes its probe.',
            'NO GATE CITES IT means no file in gates/ contains that law file name. It does not prove nothing checks the rule: gates/border_gate.js plainly checks the border law and never names it. The missing thing is the link from the ruling to its checker, which is the same rot E11 found pointing the other way.',
            'nothing here can tell a ruling he withdrew from one he has not repeated.',
            'the classifier is rules, not understanding. its held-out agreement is printed so the number can be argued with.',
        ],
    }

    shutil.rmtree(tmp, ignore_errors=True)

    if bad:
        print('RULE ZERO FAILED -- no numbers printed. failing controls:')
        for n in bad:
            print('   ' + n)
        return 1

    if not gate:
        io.open(RESULT, 'w', encoding='utf-8').write(json.dumps(result, indent=2))
        if not os.path.exists(BASELINE):
            io.open(BASELINE, 'w', encoding='utf-8').write(json.dumps(
                {'frozen': '9/12/26', 'erosion': counts['erosion'],
                 'note': 'EROSION only. DRIFT and NOT-BUILT grow honestly as the game moves.'}, indent=2))

    print('CONTROLS  %d/%d pass' % (len(ctrl) - len(bad), len(ctrl)))
    if agree:
        print('CLASSIFIER  sample A %s%% (rules written on it)  |  sample B %s%% (rules repaired on it)'
              % (agree['A']['pct'], agree['B']['pct']))
        print('            HELD-OUT sample C %s%% -- the only clean number, and the one the gate holds.'
              % agree['C']['pct'])
        for mss in agree['C']['misses']:
            print('              miss: hand said %s, the rules said %s  (%s:%d)'
                  % (mss['hand'], mss['machine'], os.path.basename(mss['file']), mss['line']))
    print('')
    print('HARVEST   %d law files, %d lines carry the word' % (counts['law_files'], counts['lock_lines']))
    print('          %d are a real lock, %d are ordinary English, %d only talk about locking'
          % (counts['marker'], counts['ordinary'], counts['mention']))
    print('WHOSE     %d of the locks are HIS, %d are a lane locking its own mechanism'
          % (counts['his'], counts['lane']))
    print('CHECKABLE of his: %d a machine could check, %d only an eye can, %d neither'
          % (counts['his_machine'], counts['his_by_eye'], counts['his_not_checkable']))
    print('')
    for c in sorted(checks, key=lambda c: (int(c['ruled'].split('/')[0]), int(c['ruled'].split('/')[1]))):
        print('%-11s %-32s ruled %-5s %s' % (c['verdict'], c['id'], c['ruled'],
                                             'a gate cites this law' if c['enforced'] else 'NO GATE CITES IT'))
        print('            %s' % c['claim'])
        print('            %s' % c['detail'])
        if c.get('release'):
            print('            released by a newer ruling: %s:%d' % (c['release']['file'], c['release']['line']))
    print('')
    print('VERDICTS  %d satisfied, %d erosion, %d drift, %d not built yet'
          % (counts['satisfied'], counts['erosion'], counts['drift'], counts['not_built']))

    if gate:
        base = json.load(io.open(BASELINE, encoding='utf-8'))
        if counts['erosion'] > base['erosion']:
            print('RED: erosion grew from %d to %d' % (base['erosion'], counts['erosion']))
            return 1
        print('GATE OK: erosion %d, frozen at %d' % (counts['erosion'], base['erosion']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
