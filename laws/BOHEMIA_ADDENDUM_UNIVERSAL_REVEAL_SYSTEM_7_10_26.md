# BOHEMIA — UNIVERSAL DAMAGE-REVEAL SYSTEM (7/10/26, Paolo's directive)

## The reframe (Paolo, quoted intent)
The agent NeuroLink reveal must NOT be a one-off hack. It is the first instance
of an ENGINE-LEVEL MODULAR SYSTEM: anytime ANYONE gets shot, they progressively
reveal more of what's underneath. Cybernetics under skin. Armor under a coat.
Wounds. Possibly losing an arm. The reveal IS the damage model's visual language.

## Engine architecture (modular, game-wide)
Every entity gets a REVEAL STACK per body region (rides the existing 12-part
rig regions — no region geometry touched, paint layers only):

  entity.reveal = {
    layers: [                      // outermost first
      {id:'coat',    hp:30},       // garment layer — tears/opens
      {id:'armor',   hp:40},       // hidden vest — revealed when coat opens
      {id:'skin',    hp:0},        // base paint
      {id:'under',   fx:'neurolink'} // what's UNDERNEATH — cyber, bone, wound
    ],
    perRegion: true                // hits map to the region struck (HEAD/ARM-L/...)
  }

- A hit routes to the struck region (Dead Eye zones already aim at regions).
- Damage peels the region's outermost layer first; when a layer breaks, the
  next layer becomes VISIBLE there. Paint-layer swap, post-paint cosmetic.
- The agent NeuroLink glow = under-layer fx of the HEAD region. Same system
  later does: armor chunks cracking off raiders, wounds showing on anyone,
  terminal dismemberment (ragdoll-exempt path, uncached, per the terminal law).
- Beat-synced fx pulse on the 120bpm grid like all animation.

## Why it's right for Bohemia
Damage tells the truth about what people are. That is LITERALLY the game's
theme — proximity to truth is what's dangerous. The engine making violence
reveal what's hidden is the theme as a mechanic.

## PENDING PAOLO
- Layer vocab v1: which layers exist at launch (coat/armor/skin/under enough?)
- Dismemberment: in or out (or dynasty-gen-3 tech unlock?)
- Whether civilians reveal too (wounds) or only agents/armored
