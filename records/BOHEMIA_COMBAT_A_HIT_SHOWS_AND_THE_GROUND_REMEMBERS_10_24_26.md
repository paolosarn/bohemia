# COMBAT [a hit shows, the ground remembers] SHIPPED 10/24 (rule 145)

His words (10/24): "when an enemy gets hurt, or even your own player, I want them to turn slightly faint red opacity, and then I
wanna see blood come out, maybe blood splatters too... what happens in Battle Brothers during combat, the live effects that get
left on the ground... if an enemy gets down he might fall on the ground, a pile of blood underneath him... we need a little bit
more of that."

## HOW BATTLE BROTHERS DID IT
As the library and the rule's recall carry it (Grok's ask 33 checks the exact list): blood sprays from a hit and stays on the
tiles, a pool under every man who falls, the fallen staying where they fell for the whole battle, dropped weapons and shields on
the ground, a severed head on a killing blow.

## OURS (slices/BOHEMIA_FIGHT.html, the drawing script; numbers in records/target/bb/ours.json `gore`, tuned:false)
- A HIT SHOWS: the man hit, his or theirs, flashes red by opacity at the landing (flash_alpha 0.5, fading over 0.75 of a beat):
  his own picture tinted on an offscreen copy (source-atop), never a box.
- THE BLOOD COMES OUT: drops thrown from the wound at chest height, away from the man who struck, on a short arc down to the
  floor: one per 3 hp the blow took, 3 to 14; whole-pixel cells in the grime's dark reds.
- THE GROUND REMEMBERS: each drop lands as a stain where it fell and stays for the whole fight (the last 900 kept); drawn under
  the fallen and the standing; a new fight starts clean.
- A POOL UNDER THE FALLEN: a man down or dead lies in a pool that spreads over 4 beats (eased), an irregular stain with lobes and
  a wet catch of light, never a plain oval (the old flat oval only under the dead is gone).
- MACHINES AND GHOSTS NEVER BLEED RED (145(c), rule 136): a machine leaks black oil (drops, stains, an oil pool) and throws
  sparks, with no red flash; a ghost breaks into static (grey, white and its purple) and leaves nothing on the floor.
- NOT YET: dropped weapons and shields on the ground and a severed head on a killing blow (the rig has no loose-weapon or head
  cell to lay; for ANIMATION / COOK, then here).

## GATES
THE GROUND REMEMBERS 8/0 (new, registered): the flash (0.32 at the landing, 0 within the beat; his man too), 10 drops for a 30 hp
blow and 3 for a 3 hp one, away from the striker; 17 stains of 17 drops still there ten beats on; the pool 10.9 -> 25.1 px under a
98 px man; oil and sparks with no red, static with nothing left; a clean floor on a new fight. Full suite unmeasured (rule 13).

[bb]: Battle Brothers' battlefield keeps every hit; so does ours, from the first blow to the recap.
ANALOG HORROR: blood as dark cells on a worn tape, never a cartoon splash; the oil black, the ghost's blood only static.
