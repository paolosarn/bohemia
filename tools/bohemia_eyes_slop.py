#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS, lane 17, E19 [slop count] ROUND TWO: THE CHECK (static half).

THE LAW: laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md (Paolo 9/11, LOCKED)
  "I need the UI to run as far away as possible from the standard look of vibe-coding with
   Claude right now. People can look at it and be like, yep, that was coded."

ROUND ONE WAS SCHOOL -- records/BOHEMIA_EYES_E19_ROUND_1_SCHOOL_THE_TELL_IS_FLUENCY_NOT_FEATURES_9_12_26.md
It changed this instrument four times before a line was written:

  (1) DO NOT FAIL ON AN OCCURRENCE. The board row asked for "fails on any, target zero".
      The skin's phone -- the one element built deliberately against this law, whose own
      comment says "the bezel is padding, not a border, because a 1px line reads as a box
      and 5px of case reads as an object" -- carries a rounded corner, a gradient, a 1px
      seam, a glow and a mono font. Fail-on-any reds the most law-abiding element on the
      screen, five times. Our own hair law already says it: A CHECKER THAT CANNOT TELL A
      MENTION FROM A USE IS THE BROKEN ONE.
  (2) MEASURE THE SCALE, NOT THE PRESENCE. What the trade actually enforces is a permitted
      set per property (stylelint-scales, rhythmguard, no-arbitrary-border-radius). The
      question is never "is there a radius", it is "is this radius one of yours".
  (3) ATTRIBUTE EVERY OCCURRENCE. A value drawn from a named token is the law working; a
      literal typed at the point of use is the reflex the law bans.
  (4) DO NOT COUNT DARK MODE. The lists call it the biggest tell; this is a night-capable
      post-apocalyptic valley and the law says dark is a choice per act.

AND ROUND TWO FOUND A THIRD BUCKET ROUND ONE DID NOT KNOW ABOUT.
  Round one expected two answers per occurrence: ON THE SKIN or TYPED IN PLACE. The
  measurement found a third and it is the interesting one. The city file USES 21
  `--skin-*` variables and DECLARES NONE OF THEM -- zero declarations anywhere in slices/
  or engine/ -- so every one resolves to its own hardcoded fallback. That is a literal
  wearing a token's name: intent without mechanism, which is the exact shape of A LAW
  WITHOUT A MACHINE GATE IS NOT ENFORCED. A token with no declaration is not a token.
  So the buckets are TOKENISED, PHANTOM and TYPED IN PLACE, and PHANTOM is a real
  finding rather than a rounding error.

  There IS a real token set, declared with values: --face-casing, --face-screen,
  --face-body (all 'BohemiaMono', ui-monospace, monospace) and --track-casing .4px,
  --track-screen 1px, --track-body 0. Letter-spacing is almost entirely on it already.

WHAT THIS LANE MAY NOT DO: decide taste. Every row here is a count, a bucket and a place.
Whether a rounded corner is right is DIRECTION's.
"""

import collections
import glob
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_SLOP_9_12_26.json')
BASELINE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_SLOP_BASELINE_9_12_26.json')
SURFACE = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_E19_SURFACE_9_12_26.json')

# the two files that draw his screen, plus the demo a stranger opens
SURFACES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html',
            'slices/BOHEMIA_DEMO.html']

# THE FONT TELL, SPLIT THREE WAYS, AND THE FIRST VERSION GOT IT WRONG.
# One list of "named default fonts" reported 16 hits across the three surfaces and EVERY
# ONE OF THEM WAS system-ui. Not one Inter, Poppins, Space Grotesk or Geist anywhere. A
# row reading "16 named default fonts" would have been a false accusation aimed at the UI
# lane, which is the single worst thing this lane can do. So:
#   TREND FONTS   the ones the law and the tell lists actually name. This is the tell.
#   PLATFORM      system-ui and the OS stacks. Not a trend, not a decision either.
#   BARE MONO     monospace with no named face in front of it: "monospace for everything",
#                 which the law does name, and which matters here because the repo HAS a
#                 decided face (BohemiaMono, embedded as woff2) that these do not ask for.
TREND_FONTS = ['Inter', 'Poppins', 'Space Grotesk', 'Geist', 'DM Sans', 'Manrope',
               'Nunito', 'Montserrat', 'Open Sans', 'Lato', 'Roboto']
PLATFORM_FONTS = ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI']
DECIDED_FACE = 'BohemiaMono'

PROPS = {
    'border-radius': r'border(?:-[a-z]+)?-radius\s*:\s*([^;}"\']+)',
    'letter-spacing': r'letter-spacing\s*:\s*([^;}"\']+)',
    'box-shadow': r'box-shadow\s*:\s*([^;}"\']+)',
    'font-family': r'font-family\s*:\s*([^;}"\']+)',
    'border-width': r'border(?:-(?:top|right|bottom|left))?\s*:\s*([^;}"\']+)',
}
GRADIENT = r'(?:background|background-image)\s*:\s*([^;}"\']*gradient\([^;}"\']*)'
UPPERCASE = r'text-transform\s*:\s*uppercase'
EMOJI = re.compile('[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]')


def custom_map(text):
    """every custom property this surface declares, and what it is declared as. Needed
    because a font declaration asks for the decided face THROUGH a token: the city file
    declares --face-body as 'BohemiaMono', ui-monospace, monospace and then writes
    font: 11px var(--face-body). A checker that only greps the declaration for the face
    name reports that NOTHING asks for it, which is a false zero and the opposite of
    the truth."""
    out = {}
    for m in re.finditer(r'(--[a-z][a-z0-9-]*)\s*:\s*([^;}]+)', text):
        out.setdefault(m.group(1), norm(m.group(2)))
    return out


def expand(value, cmap, depth=3):
    """resolve var() one token at a time, so a value can be tested for what it really says."""
    v = value
    for _ in range(depth):
        def sub(m):
            name = m.group(1)
            return cmap.get(name, m.group(2) or '')
        nv = re.sub(r'var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^()]*))?\)', sub, v)
        if nv == v:
            break
        v = nv
    return v


def declared_customs(text):
    """Which custom properties this surface actually DECLARES. A var() pointing at
    anything not in here is a phantom: it always resolves to its fallback."""
    return set(re.findall(r'(--[a-z][a-z0-9-]*)\s*:\s*[^;}]', text))


def bucket(value, declared):
    """TOKENISED / PHANTOM / TYPED IN PLACE. The whole instrument turns on this."""
    refs = re.findall(r'var\(\s*(--[a-z0-9-]+)', value)
    if not refs:
        return 'TYPED'
    if all(r in declared for r in refs):
        return 'TOKENISED'
    if any(r in declared for r in refs):
        return 'MIXED'
    return 'PHANTOM'


def norm(v):
    return re.sub(r'\s+', ' ', v).strip().rstrip(';').lower()


def literal_of(value):
    """The literal a value would resolve to: the fallback inside var(), or the value."""
    m = re.search(r'var\(\s*--[a-z0-9-]+\s*,\s*([^)]+)\)', value)
    return norm(m.group(1)) if m else norm(value)


def scan(path):
    text = io.open(os.path.join(ROOT, path), encoding='utf-8', errors='replace').read()
    declared = declared_customs(text)
    out = {'file': path, 'bytes': len(text), 'declared_customs': sorted(declared),
           'props': {}, 'phantom_names': {}, 'tells': {}}

    for prop, rx in PROPS.items():
        rows = []
        for m in re.finditer(rx, text, re.I):
            v = m.group(1)
            whole = v
            if prop == 'border-width':
                # THE FIRST VERSION REPORTED 64 DISTINCT BORDER VALUES AND IT WAS WRONG.
                # It kept the whole shorthand -- "1px solid #241c12" -- so it was counting
                # colour variations as scale sprawl. The scale question is about the WIDTH.
                w = re.match(r'\s*(\d+(?:\.\d+)?(?:px|em|rem))\b', v)
                if not w:
                    if 'var(' not in v:
                        continue
                else:
                    v = w.group(1)
            # ATTRIBUTION READS THE WHOLE DECLARATION, THE SCALE READS THE WIDTH.
            # Trimming to the width before bucketing threw away the var() that a
            # "1px solid var(--line)" carries, and moved 31 tokenised borders into the
            # typed-in-place column -- inventing work for the UI lane that is already done.
            rows.append({'value': norm(whole), 'bucket': bucket(whole, declared),
                         'literal': literal_of(v)})
        b = collections.Counter(r['bucket'] for r in rows)
        distinct_literals = sorted(set(r['literal'] for r in rows if r['bucket'] in ('TYPED', 'PHANTOM')))
        tokens = sorted(set(t for r in rows for t in re.findall(r'var\(\s*(--[a-z0-9-]+)', r['value'])))
        out['props'][prop] = {
            'declarations': len(rows),
            'tokenised': b.get('TOKENISED', 0), 'phantom': b.get('PHANTOM', 0),
            'mixed': b.get('MIXED', 0), 'typed_in_place': b.get('TYPED', 0),
            'distinct_untokenised_values': len(distinct_literals),
            'values': distinct_literals[:40],
            'tokens_used': tokens,
        }
        for t in tokens:
            if t not in declared:
                out['phantom_names'][t] = out['phantom_names'].get(t, 0) + 1

    # gradients
    grows = [{'value': norm(m.group(1)), 'bucket': bucket(m.group(1), declared)}
             for m in re.finditer(GRADIENT, text, re.I)]
    gb = collections.Counter(r['bucket'] for r in grows)
    out['props']['gradient'] = {
        'declarations': len(grows), 'tokenised': gb.get('TOKENISED', 0),
        'phantom': gb.get('PHANTOM', 0), 'mixed': gb.get('MIXED', 0),
        'typed_in_place': gb.get('TYPED', 0),
        'distinct_untokenised_values': len(set(r['value'] for r in grows if r['bucket'] != 'TOKENISED')),
        'values': [], 'tokens_used': [],
    }

    # the named-default-font tell, and the one-pixel-border tell, counted plainly
    fonts_used = [norm(m.group(1)) for m in re.finditer(PROPS['font-family'], text, re.I)]
    fonts_used += [norm(m.group(1)) for m in re.finditer(r'\bfont\s*:\s*([^;}"\']+)', text, re.I)]
    # MARKUP ONLY: style blocks AND script blocks stripped. The first cut stripped only
    # <style> and counted 637 "dingbats", nearly all of them arrows inside code and
    # comments. The law's tell is an emoji INSIDE A CONTROL, so the static half must look
    # at markup and the real-surface half looks at the controls themselves.
    body = re.sub(r'<script[^>]*>.*?</script>', '',
                  re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.S), flags=re.S)
    cmap = custom_map(text)
    fonts_resolved = [expand(f, cmap) for f in fonts_used]
    out['tells'] = {
        'trend_font_hits': sum(1 for f in fonts_used
                               if any(n.lower() in f for n in TREND_FONTS)),
        'platform_font_hits': sum(1 for f in fonts_used
                                  if any(n.lower() in f for n in PLATFORM_FONTS)),
        'asks_for_the_decided_face': sum(1 for f in fonts_resolved if DECIDED_FACE.lower() in f),
        'font_declarations': len(fonts_used),
        'bare_monospace_no_named_face': sum(
            1 for f in fonts_resolved
            if 'monospace' in f and not re.search(r"'[^']+'|\"[^\"]+\"", f)),
        'one_pixel_borders': len(re.findall(r'border(?:-(?:top|right|bottom|left))?\s*:\s*1px', text, re.I)),
        'uppercase_declarations': len(re.findall(UPPERCASE, text, re.I)),
        'uppercase_with_letter_spacing': len(re.findall(
            r'letter-spacing\s*:[^;}]{0,40};[^{}]{0,120}text-transform\s*:\s*uppercase'
            r'|text-transform\s*:\s*uppercase;[^{}]{0,120}letter-spacing\s*:', text, re.I)),
        # SPLIT, because the law's tell is "emoji as icons inside buttons" and a ✕ close
        # glyph or a ↻ reroll arrow is a SYMBOL, not an emoji. Counting them together
        # produced one number that answered neither question.
        'pictographic_emoji': len(re.findall('[\U0001F300-\U0001FAFF]', body)),
        'dingbats_and_arrows': len(re.findall('[\u2190-\u27bf]', body)),
        'font_face_blocks': len(re.findall(r'@font-face', text, re.I)),
        'embedded_font_data': len(re.findall(r'data:font/woff2?;base64', text, re.I)),
    }
    return out


# ---------------------------------------------------------------------------
# RULE ZERO
# ---------------------------------------------------------------------------
PLANT = """
:root{ --real-one: 4px; }
.a{ border-radius: 7px }
.b{ border-radius: var(--real-one) }
.c{ border-radius: var(--nope-xyz, 4px) }
.d{ border-radius: 2px } .e{ border-radius: 3px } .f{ border-radius: 5px }
"""
PLANT30 = ':root{--x:1px}\n' + '\n'.join('.r%d{border-radius:%dpx}' % (i, i) for i in range(1, 31))


def controls(city):
    c = []
    declared = declared_customs(PLANT)
    vals = re.findall(PROPS['border-radius'], PLANT, re.I)
    got = [bucket(v, declared) for v in vals]
    c.append(('C2 a literal border-radius is attributed TYPED IN PLACE', got[0] == 'TYPED', got[0]))
    c.append(('C3 a var() whose variable IS declared is attributed TOKENISED', got[1] == 'TOKENISED', got[1]))
    c.append(('C4 a var() whose variable is NEVER declared is attributed PHANTOM', got[2] == 'PHANTOM', got[2]))

    d3 = len(set(literal_of(v) for v in vals if bucket(v, declared) in ('TYPED', 'PHANTOM')))
    v30 = re.findall(PROPS['border-radius'], PLANT30, re.I)
    d30 = len(set(literal_of(v) for v in v30))
    c.append(('C5 the scale counter separates a small scale from a sprawl',
              d3 == 5 and d30 == 30, '%d distinct in the planted sheet, %d in the thirty-radius sheet'
              % (d3, d30)))

    # C1, THE ONE THAT MATTERS. Round one wrote it as "the phone must come back ON THE
    # SKIN and must not be a defect". The measurement refined it: the skin variables are
    # never declared, so the phone's values are PHANTOM, not TOKENISED. The control that
    # survives the refinement is the one that still tests the thing that mattered --
    # the phone must NOT be counted as a bare literal typed at the point of use, because
    # it plainly is not. Saying which half of the expectation was wrong is the point.
    text = io.open(os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'),
                   encoding='utf-8', errors='replace').read()
    i = text.find('#cityfeed{')
    blk = text[i:text.find('}', i) + 1] if i >= 0 else ''
    ph = [bucket(m.group(1), declared_customs(text))
          for m in re.finditer(PROPS['border-radius'], blk, re.I)]
    c.append(('C1 the skin phone is attributed to a token NAME, never to a bare literal',
              bool(ph) and all(b in ('PHANTOM', 'TOKENISED', 'MIXED') for b in ph),
              'the phone radius reads ' + (', '.join(ph) if ph else 'NOTHING FOUND')))
    return c


def main():
    gate = '--gate' in sys.argv
    surfaces = [scan(p) for p in SURFACES if os.path.exists(os.path.join(ROOT, p))]
    city = next((s for s in surfaces if 'CITY_WORLD' in s['file']), surfaces[0])
    ctrl = controls(city)
    bad = [n for n, ok, _ in ctrl if not ok]

    totals = collections.Counter()
    distinct = collections.defaultdict(set)
    for s in surfaces:
        for prop, d in s['props'].items():
            totals['typed_' + prop] += d['typed_in_place']
            totals['phantom_' + prop] += d['phantom']
            totals['tokenised_' + prop] += d['tokenised']
            for v in d['values']:
                distinct[prop].add(v)
        for k, v in s['tells'].items():
            totals[k] += v

    typed_total = sum(v for k, v in totals.items() if k.startswith('typed_'))
    phantom_total = sum(v for k, v in totals.items() if k.startswith('phantom_'))
    tokenised_total = sum(v for k, v in totals.items() if k.startswith('tokenised_'))
    scale = {p: len(v) for p, v in sorted(distinct.items())}

    surface = json.load(io.open(SURFACE, encoding='utf-8')) if os.path.exists(SURFACE) else {}

    result = {
        'what': 'E19 [slop count] round two: the tells, attributed, and the scale',
        'date': '9/12/26',
        'law': 'laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md',
        'school': 'records/BOHEMIA_EYES_E19_ROUND_1_SCHOOL_THE_TELL_IS_FLUENCY_NOT_FEATURES_9_12_26.md',
        'surfaces': surfaces,
        'headline': {
            'typed_in_place': typed_total,
            'phantom_tokens': phantom_total,
            'tokenised': tokenised_total,
            'distinct_untokenised_values_per_property': scale,
        },
        'real_surface': surface,
        'controls': [{'name': n, 'pass': ok, 'detail': d} for n, ok, d in ctrl],
        'blind_spots': [
            'this is a text scan of the shipped files. A value written by JS at runtime is '
            'invisible to it, which is why the real-surface half exists.',
            'it counts what is DECLARED, not what is on screen: a rule that never matches an '
            'element still counts.',
            'nothing here says whether any of it looks good. That is DIRECTION.',
            'dark mode is deliberately not counted, per the law and round one.',
        ],
    }

    if bad:
        print('RULE ZERO FAILED -- no numbers printed. failing controls:')
        for n in bad:
            print('   ' + n)
        return 1

    if not gate:
        json.dump(result, io.open(RESULT, 'w', encoding='utf-8'), indent=2)
        if not os.path.exists(BASELINE):
            json.dump({'frozen': '9/12/26', 'typed_in_place': typed_total,
                       'phantom_tokens': phantom_total,
                       'scale': scale,
                       'note': 'TYPED IN PLACE, PHANTOM TOKENS and the distinct-value scale. '
                               'All shrink-only. The RAW tell count is never frozen, because '
                               'moving a value onto a token is a real fix that leaves it unchanged.'},
                      io.open(BASELINE, 'w', encoding='utf-8'), indent=2)

    print('CONTROLS  %d/%d pass' % (len(ctrl) - len(bad), len(ctrl)))
    print('')
    print('THE THREE BUCKETS, across %d shipped surfaces' % len(surfaces))
    print('   TOKENISED      %4d   the value comes from a custom property that is really declared'
          % tokenised_total)
    print('   PHANTOM        %4d   var(--skin-...) whose variable is DECLARED NOWHERE, so it always'
          % phantom_total)
    print('                         resolves to its own hardcoded fallback: a literal in a token costume')
    print('   TYPED IN PLACE %4d   a bare literal written at the point of use  <- THE ACTIONABLE LIST'
          % typed_total)
    print('')
    print('THE SCALE -- how many DIFFERENT values the surfaces use, per property')
    for p, n in scale.items():
        print('   %-16s %3d distinct' % (p, n))
    print('')
    print('THE TELLS, COUNTED AND NEVER FAILED ON')
    for k in ('trend_font_hits', 'platform_font_hits', 'asks_for_the_decided_face',
              'font_declarations', 'bare_monospace_no_named_face', 'one_pixel_borders',
              'uppercase_declarations', 'uppercase_with_letter_spacing',
              'pictographic_emoji', 'dingbats_and_arrows',
              'font_face_blocks', 'embedded_font_data'):
        print('   %-32s %4d' % (k, totals[k]))
    print('')
    for s in surfaces:
        ph = s['phantom_names']
        if ph:
            print('PHANTOM TOKENS IN %s: %d names, %d uses'
                  % (os.path.basename(s['file']), len(ph), sum(ph.values())))
            print('   ' + ', '.join(sorted(ph)[:12]))
    if surface.get('ok'):
        print('')
        print('ON THE REAL SCREEN')
        print('   the decided face is loaded in the browser:      %s' % surface.get('font_loaded'))
        print('   chrome elements asking for it:                   %s of %s'
              % (surface.get('asks_for_face'), surface.get('chrome_elements')))
        print('   chrome elements with it FIRST in the stack:      %s of %s'
              % (surface.get('face_first_in_stack'), surface.get('chrome_elements')))
        print('   elements with capitals TYPED INTO THE TEXT:      %s of %s   (CSS uppercase: %s)'
              % (surface.get('caps_typed_into_the_text'), surface.get('chrome_elements'),
                 surface.get('css_uppercase_elements')))
        print('   controls that break when a reader widens letter spacing to 0.12em: %s of %s'
              % (surface.get('spacing_broken'), surface.get('spacing_tested')))

    if gate:
        if not os.path.exists(BASELINE):
            print('RED: no baseline. run the sweep first.')
            return 1
        base = json.load(io.open(BASELINE, encoding='utf-8'))
        red = []
        if typed_total > base['typed_in_place']:
            red.append('typed-in-place values grew from %d to %d' % (base['typed_in_place'], typed_total))
        if phantom_total > base['phantom_tokens']:
            red.append('phantom tokens grew from %d to %d' % (base['phantom_tokens'], phantom_total))
        for p, n in scale.items():
            b = base['scale'].get(p)
            if b is not None and n > b:
                red.append('the %s scale grew from %d distinct values to %d' % (p, b, n))
        for m in red:
            print('RED: ' + m)
        if red:
            return 1
        print('GATE OK: typed-in-place %d (frozen %d), phantom %d (frozen %d), every scale flat or '
              'smaller. The raw tell count is REPORTED, never frozen.'
              % (typed_total, base['typed_in_place'], phantom_total, base['phantom_tokens']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
