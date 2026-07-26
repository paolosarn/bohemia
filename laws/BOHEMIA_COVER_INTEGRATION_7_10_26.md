# BOHEMIA — COVER PROPS INTEGRATION (7/10/26)

## What exists
13 Paolo-confirmed cover props (family='cover' in
BOHEMIA_MULTICELL_SET_7_10_26.txt), from '5. Barricades and defenses'.
All multicell, true-res baked, purity-flagged.

## How code consumes
1. Load multicell set; filter family=='cover' and pure==true.
2. Each cover prop placed on the grid claims its fp cells with:
   blocksMove=true, blocksLOS=partial, coverState='HARD'.
3. Combat bridge: a unit adjacent to a cover cell on the side away from the
   attacker gains inCover=true — feeds the existing cover/pop mechanic
   (dial minigame on pop-out attempts).
4. Open design note (unchanged, Paolo 7/? ): 1v1 pop-button spam acceptable;
   2v1+ must make spam risky. Cover PROPS don't change that logic — they
   only give it world geometry.
5. Render: cover props draw in the standing/prop layer, occlude per DEPTH LAW.

## Pending Paolo
- Which cover props dress the DEMO tunnel (placement = map/his call).
- Soft vs hard cover tiers if he ever wants them (single tier for now).
