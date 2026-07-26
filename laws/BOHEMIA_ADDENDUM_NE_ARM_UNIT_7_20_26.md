# BOHEMIA ADDENDUM — NE/NW ARM-UNIT DEPTH (7/20/26, LOCKED)

Paolo, reviewing combat clip batch #13 on the live rig: "it seems when it
comes to the northeast direction, the hand and arm layering behind in front
of the torso is fucked up for so many animations."

## THE BUG (root cause, not symptom)
Two layering laws already governed hands: the GUN-UNIT LAYER LAW (7/2) and
the DYNAMIC REST-RELATIVE hand layer (7/2). Both only ever re-placed the
HANDS (parts 7/8) and both read only X displacement. The away diagonals
(NE, NW) break both assumptions at once:
- their depth axis lives mostly in -Y, so an arm thrown along the facing
  barely moves in X and the signal never fires;
- Paolo's authored baseline correctly holds the camera-side arm NEAREST at
  rest, so when a clip threw that arm along the facing, the HAND was sent
  behind (gun law) while its OWN FOREARM stayed at layer 0 and crossed the
  face. Hand behind, arm in front: the exact fracture he saw.

## THE LAW
On NE and NW ONLY, in the render pipeline (handOrder):
1. The arm and its hand are ONE UNIT. They are never layered to opposite
   sides of the torso.
2. The signal is the hand's displacement from its rig rest position
   projected ON THE FACING VECTOR — both axes, dot product, not X alone.
3. Past the deadband (+2.5) along the facing: the whole unit renders
   BEHIND head, face, and torso. Past the deadband toward the camera
   (-2.5): the whole unit renders NEAREST.
4. Inside the deadband the authored baseline holds EXACTLY. The baked
   layerOverride is SACROSANCT and untouched (RIG LAW); this is pipeline
   law only, like every layering rule before it.
5. On these two facings this rule SUBSUMES the gun-unit and rest-relative
   hand rules (it returns before them). All other facings keep their
   approved behavior byte-for-byte.

## WHY IT IS RIGHT
An away-diagonal body throwing an arm along its facing puts that arm on
the far side of itself. The viewer sees the arm emerge from BEHIND the
silhouette — never a sleeve crossing the face of a head that faces away.
Mid-strike concealment (shiv-jab, spear-drive at full extension) is the
same physical truth the N facing has always had.

## VERIFICATION (real surface, 7/20)
A/B renders old-vs-new on NE and NW for cover-rise, pistol, two-hand,
gun-walk, shiv-jab, spear-drive, bat-arc, get-shoved: every gun/strike
clip stopped crossing the face; rest poses (idle, walk, take-cover)
byte-identical (deadband). Machine gate: combat_anim_gate.js ARM-UNIT
section (7 checks) locks the branch, the dot-product signal, the deadband,
the unit-move, the behind-set, the precedence, and the RIG LAW.
