# BOHEMIA ADDENDUM — SHADOWS ARE A SEPARATE LAYER (Paolo 7/26/26, LOCKED)
# "New animation rule, new art rule, new clothing/asset/rig/body rule."

Paolo's words: "when you make shadows or whatever you're doing, it has to be
separate from the actual clothing. I see you make shadows ON the clothing and
it's really bad when it's animation time."

LOCKED (applies to clothing, body, rig assets, props — every animated or
layered asset):
1. SHADOW/SHADING NEVER LIVES IN THE ASSET'S OWN PIXELS. A garment, body
   part, or prop sprite carries its clean pixels only. Shading, cast
   shadows, and ambient occlusion are applied at RENDER TIME as their own
   separate layer/pass, driven by the one canon light direction.
2. WHY (the animation reason, on record): shading baked into a garment is
   frozen in one pose — the moment the limb moves, the painted shadow moves
   WITH the fabric instead of behaving like light, and the animation reads
   muddy and broken.
3. PRECEDENT ALIGNMENT: the art lane's starter tileset already ships cast
   shadows as separate DATA (correct); the LEAF-PIXEL law already enforces
   channel discipline on clips. This ruling extends the same separation to
   ALL clothing/body/asset shading.
4. EXISTING ASSETS: approved garments with baked shading are NOT re-cooked
   wholesale (graveyard/approval law stands); the separation applies to all
   NEW cooks now, and to any approved asset the moment it is re-touched for
   any reason.
5. ENFORCEMENT PATH: the CHARACTER lane adds a shading-separation assertion
   to its gates alongside the rig check (a cook whose garment layer contains
   shading gradients consistent with baked light fails).
