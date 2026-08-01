#!/usr/bin/env python3
"""BOHEMIA -- ONE ID, ONE WHOLE PERSON (7/31/26). Idempotent alpha patch.

THE CORRECTION THIS EXISTS TO MAKE.

BOH_PERSONLOOK shipped with a claim in its header: "Nothing in the repo varied a
person's appearance -- no seed, no per-agent body, no per-agent outfit." That was
WRONG, and the crowd board is what exposed it. There has been an NPCFactory in
engine/bohemia_engine.js since 7/2/26. It is seeded, it is deterministic, it is
wired into the RUN and the SLICE and the CHARACTER tab's RANDOM CITIZEN button,
and it varies TWO things per citizen: SKIN TONE (Paolo's 9 locked ramps) and
HAIR COLOUR (7 values). Measured on 8 ids: 6 distinct skin tones, 5 distinct hair
colours. It cannot vary clothes, because it reads only PD.layers -- his painted
wardrobe, which holds exactly one option per slot.

So the true gap was never "nothing varies a person". It was:
   NPCFactory      varies skin + hair, cannot vary body or clothes
   BOH_PERSONLOOK  varies body + clothes, does not touch skin or hair
Two halves of one person, keyed by two different ids, neither knowing the other.

AND IT SHOWED. The crowd board's twelve citizens read as twelve strangers from
the neck down and twelve of the same guy from the neck up -- and I wrote that
down as a CONTENT gap needing new art. It was not. It was me bypassing skin and
hair variation that already existed and already worked. The art may still be
worth cooking, but it was not what made the heads identical.

WHAT THIS DOES: the crowd asks NPC_FACTORY for the SAME id it asks PERSONLOOK
for, and installs skinTone and hairColour alongside the body and the outfit. One
id, one whole person. No new mechanism is written for skin or hair -- ENGINE SYNC
LAW, one canonical body per module: the factory that already owns those fields
keeps owning them.

BOTH are restored with his own look in the same finally block. skinTone and
hairColour are already in frameLookHash, so each citizen gets a real cache entry
rather than a stale shared frame.

REUSE CHECK: cooks ZERO graphic pixels. It opens no banks and draws nothing. It
reuses NPCFactory (engine/bohemia_engine.js, inlined) for skin and hair, Paolo's
SKIN_TONES ramps for the tone lookup, and the 221 approved garments through
BOH_PERSONLOOK. Every value it installs was already canon.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'ONE ID, ONE WHOLE PERSON' in src:
    print('ONE-PERSON PATCH: already applied, nothing to do')
    sys.exit(0)

# ---- 1. borrow skin + hair alongside the dials --------------------------------
OLD_SAVE = """      /* SAVE HIS LOOK. Everything below is borrowed and given back. */
      var keepVar  = G.bodyVar, keepWorn = window.G_WORN, keepEq = G.equipped;"""
NEW_SAVE = """      /* SAVE HIS LOOK. Everything below is borrowed and given back. */
      var keepVar  = G.bodyVar, keepWorn = window.G_WORN, keepEq = G.equipped;
      var keepSkin = skinTone, keepHair = hairColor;"""
if OLD_SAVE not in src:
    sys.exit('ONE-PERSON PATCH: save block not found -- crowd renderer moved')
src = src.replace(OLD_SAVE, NEW_SAVE, 1)

OLD_SET = """          G.bodyVar = look.body; window.G_WORN = look.worn; G.equipped = eq;"""
NEW_SET = """          G.bodyVar = look.body; window.G_WORN = look.worn; G.equipped = eq;
          /* ONE ID, ONE WHOLE PERSON. NPCFactory has owned skin tone and hair
             colour since 7/2 and is what the RUN already uses; PERSONLOOK owns
             body and clothes. Same id to both, so the halves belong to the same
             person instead of to two strangers. No second mechanism is written
             for skin or hair -- ENGINE SYNC LAW. Both are in frameLookHash, so
             each citizen gets a real cache entry. */
          try { var np = NPC_FACTORY.npcFrom(id);
            var tn = SKIN_TONES.find(function(x){ return x[0] === np.skinToneName; });
            if (tn) skinTone = tn;
            hairColor = np.hairColor;
          } catch (e) {}"""
if OLD_SET not in src:
    sys.exit('ONE-PERSON PATCH: install block not found')
src = src.replace(OLD_SET, NEW_SET, 1)

OLD_REST = """        G.bodyVar = keepVar; window.G_WORN = keepWorn; G.equipped = keepEq;"""
NEW_REST = """        G.bodyVar = keepVar; window.G_WORN = keepWorn; G.equipped = keepEq;
        skinTone = keepSkin; hairColor = keepHair;"""
if OLD_REST not in src:
    sys.exit('ONE-PERSON PATCH: restore block not found')
src = src.replace(OLD_REST, NEW_REST, 1)

ALPHA.write_text(src)
print('ONE-PERSON PATCH: applied (skin + hair now ride the same id as body + clothes)')
