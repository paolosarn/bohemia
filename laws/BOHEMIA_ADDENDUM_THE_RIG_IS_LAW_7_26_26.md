# BOHEMIA ADDENDUM — THE RIG IS LAW (Paolo 7/26/26, LOCKED — hardens RIG LAW)

Paolo's words: "the animations never looked at the rig... no wonder you're
having issues creating the woman, you were creating like a new body... the
rig that we have set up explains all the layering for all animations, and to
see the animations struggle because they forgot the rig was law was
inexcusable."

LOCKED (extends the standing RIG LAW — BAKED.pose is the render base, painted
regions sacrosanct — with the half that was being ignored):
1. THE RIG IS THE STARTING POINT OF ALL BODY AND ANIMATION WORK. It already
   defines the layering for every animation. NOTHING creates a new body, new
   anatomy, new skeleton, or new layering scheme. Every character variation
   (including the one-rig sliders), every pose, every clip DERIVES from the
   one rig and its layer system.
2. THE RIG CHECK: any session doing body/animation/character work must FIRST
   load and read the actual rig (BAKED.pose + its layer/region structure)
   and document in its work record WHICH rig layers it built on — same
   pattern as REUSE CHECK. Work that cannot cite its rig layers is invalid.
3. The woman-rig v1-v4 arc is the canonical post-mortem: four versions of
   inventing new anatomy instead of adjusting the one rig. Kill-reason for
   the taxonomy: IGNORED-THE-RIG.
4. ENFORCEMENT PATH: the CHARACTER lane's next anim work adds a rig-check
   assertion to the anim gates (clips resolve through BAKED.pose layers;
   no parallel body definitions exist outside the rig).

---

## THE GATE, FOUR DAYS LATE (7/30/26)

This law shipped 7/26 with an ENFORCEMENT PATH written into item 4 and no gate
attached. The repo's own FACTORY LAW says a law without a machine gate is not
enforced, and the 7/16 sweep proved it by finding six of nine gated laws already
broken. So this one sat unenforced for four days while the CHARACTER lane charter
listed "the rig-check gate assertion" as its next first item every session.

MEASURED 7/30, before the gate: **22 tools touch the rig. ZERO documented what
they built on.** Item 2 had been law the whole time and nothing in the machine
cared. That is exactly the condition the woman-rig v1-v4 arc happened in.

`gates/rig_check_gate.py` (137 assertions) now locks all three clauses:

**1. THE RIG CHECK (item 2)** — every rig-touching tool carries a block naming
the rig APIs, joints and part IDs it built on. Shaped like REUSE CHECK on
purpose: a claim the machine can check, never a name-drop. The gate RE-DERIVES
the claim from the tool's own source.

**2. NO PARALLEL BODY (items 1 and 4)** — a *body definition* is an object
carrying the rig's joint signature whose joint values are COORDINATE PAIRS. Only
two exist: `BAKED` (the rig) and `BAKED_EDITS` (Paolo's edits ON it, same
joints). Everything else that mentions joints — `LIFT`, `ALONG`, `wOf`,
`EDIT_CHAIN` — holds scalars or parent lists, so it keys OFF the rig instead of
redefining it. A third coordinate body is a second anatomy: the exact failure.

**3. CLIPS RESOLVE THROUGH THE RIG (item 4)** — `RIG = BAKED.pose` is the render
base, the dials go through `BOH_BODYVAR.apply(BAKED, ...)` rather than replacing
it, and the art's rest grid is `BAKED.skeleton`.

### THE HOLE IN THE FIRST VERSION OF THIS GATE, recorded because it nearly shipped

The first version checked each claimed joint with "does this joint appear in the
tool's source?" **The claim lives in the source.** So a tool could name `footB`,
a joint it never touches, and the gate would find the word — in the claim itself
— and pass. Tested adversarially before shipping: it passed a tool that claimed a
joint it never used, with one MORE check green than before.

Fixed by re-deriving against the source with the RIG CHECK block removed. This is
the same reason REUSE-FIRST demands a real `open()` call rather than a docstring
mention, and it generalises: **a self-attested claim verified against a document
that contains the claim is not verified at all.**

Proven to catch, not just to pass — all four tested by breaking the tree on
purpose and confirming the gate goes red:
- a claimed joint the tool never uses → FAIL
- a claimed rig API the tool never calls → FAIL
- a deleted RIG CHECK block → FAIL
- a second anatomy (`WOMAN_RIG`) added beside `BAKED` → FAIL, by name

Tools: `tools/bohemia_rig_check_stamp.py` (idempotent).
