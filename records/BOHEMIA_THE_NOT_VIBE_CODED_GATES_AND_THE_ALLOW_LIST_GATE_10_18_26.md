# THE NOT VIBE CODED GATES AND THE ALLOW LIST GATE (PLUMBER, 10/18/26, round 60)

Rows: [the allow list gate] (rule 111d) and [the not vibe coded gates] (rule 114b), in the board's order,
plus round two's rendered-sprite set (records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_TWO_THE_RIG_10_18_26.md
Section D). This chat ran on Opus 5.5 (rule 116); the chat before it left nothing uncommitted for these rows.

## 1. THE ALLOW LIST GATE (gates/allow_list_gate.js, in the suite as ALLOW LIST)

Reads .claude/settings.json and never writes it. Legs: A1 parses; A2 every shell command, the file tools,
web search and fetch, the sub-agent tool; A3 every session and routine tool the coordinator uses (16: open,
read, list, archive, unarchive, tag, title, interrupt a session; create, update, delete, fire, read, list a
routine; send_later; list environments) under EVERY server spelling a container has shown; A4 the GitHub
reads the deploy check needs; A5 the disk-wipe and force-push denies (-f and --force); A6 no deny shadows a
needed allow. Self-tests S1 to S5 on planted files, both ways.

THE FINDING: it was red on its first run, 26 tools. The list names the session server as
mcp__Claude_Code_Remote__ and mcp__claude-code-remote__; the cloud container this lane ran in names it
mcp__bf7c680d-5fdc-5ef4-b4a0-abadb619bf0a__ (a version-5 UUID, which is derived from a name, so the same
in every container). A permission rule matches the full tool name, so not one of the coordinator's session
calls was covered under the name this container uses, and the claude-code-remote spelling covered only 6
of the 16. FIXED in the same commit: three server-wide entries (mcp__Claude_Code_Remote,
mcp__claude-code-remote, mcp__bf7c680d-5fdc-5ef4-b4a0-abadb619bf0a), which cover every tool of the server
under each spelling. The rule says a prompt on a listed tool is a defect fixed the same sweep; this is the
fix landing before the prompt. If a container ever shows a new spelling, it is one line in SPELLINGS.

## 2. THE NOT VIBE CODED GATES (tools/bohemia_not_vibe_coded.py, gates/not_vibe_coded_gate.py, in the suite as NOT VIBE CODED)

The ten checks of round one's Section D, in its order, each a pure image or text test:
D1 one pixel size (a block size is real only if 95% of colour changes land on its grid lines; per 16 px
tile; 90% of textured tiles agreeing), D2 palette and colour count, D3 one light (dark-20% centroid to
light-20% centroid within 30 degrees of the declared light, and long enough to be a light), D4 hue shift
(ramps of 3+ touching colours within 40 degrees of hue, 8+ degrees dark to light, a sprite over 24 colours
median-cut to 24 first), D5 rest and focus (edge density per block, Gini 0.4+, the quietest quarter under 40%
of the busiest), D6 silhouette (8x8 IoU under 0.85 across a class, the 3x3 not a box), D7 three values (12%
each, none over 75%), D8 clean lines (orphans 8-connected under 2 per 1,000, no doubled outline block,
jaggies under 3 per 100 outline pixels, banding under 15%, pillow r under 0.7), D9 repetition (one block
under 30% of a sheet, no run over 6, a sprite over 24 px not 97% its own mirror), D10 UI defaults
(gradients, blur, glow, radius over 2 px, panel hues 250 to 290, system fonts).
Round two added: R2 a binary alpha with no rare boundary-only colour (filter residue), R8 eight facings on
one foot row and one height within 1 px, one light in every facing, the area within 25%, the front not its
own mirror. Round two's D1 reads the .blend and the render script: DIRECTION's rig file, not an image.

THE NUMBERS: gates/not_vibe_coded_thresholds.json, every key with the research line it came from. DIRECTION's
style guide data file (rule 114a) replaces them key by key when it lands.

### What was measured before the gate held anything

THE RESEARCH PAGE'S CAPS FAIL HIS OWN PACKS. Twenty-five pieces from each of seven pack families through the
checks at Section C's numbers: D2 failed 175 of 175 (a pack prop holds about 3,000 colours against a cap of
6), D5 172 of 175, D8 175 of 175, D7 129 of 175. MODS found the same wall the same round from the data side
(a prop holds at least 2,330 colours). The packs are the floor (rule 82): a gate on Section C's numbers
would block the look he approved. So THE BLOCKING RULER IS THE PACK BAND: per family, the 90th percentile of
every pack piece on each number, higher is worse (records/target/BOHEMIA_NOT_VIBE_CODED_BANDS.json, built
by `python3 tools/bohemia_not_vibe_coded.py --bands` over every pack piece, four processes). A candidate
worse than nine in ten of the pieces he bought fails the check. Both verdicts print side by side, research
and packs, so DIRECTION sees the gap when it sets the numbers.

THE BAND, MEASURED (1,938 pack pieces in seven families, 7 min 42 s on four processes): a pack piece holds up
to 3,594 (marking) to 6,661 (road) colours at the 90th percentile; the quietest quarter of its blocks carries
68 to 86 percent of the busiest's detail; 252 to 397 orphan pixels per 1,000. AND THE BAND IS TOOTHLESS ON
TWO CHECKS: on D3 the packs' 90th percentile is an angle of 180 degrees (the worst possible: his packs are lit
from everywhere) and on D4 it is every ramp straight. A band there passes anything. So the gate holds each
of the first five to the ruler that can say no: D2 and D5 to the packs (where the research numbers fail every
piece he bought), D1 to the research line (every pack piece passes it), D3 to the item's OWN declared light
(the research's own rule: one scene, one light) and D4 to the research's 8 degrees.

### The legs

N1 every check bites both ways: a planted made sprite (one light, a hue-shifted ramp in flat clusters, a
1 px outline, one busy focal patch, gates/not_vibe_coded_plants.py) passes D1 to D8 and each check fails its
planted twin (mixels, a smooth gradient, lit from below, straight darkening, noise everywhere, a box, one
value, salted orphans, a mirrored box; two identical silhouettes; one tile repeated; gradient, Arial, a
12 px radius and a glow; a soft edge; a facing that sinks 6 px). N2 the band is current against the pack
pieces on disk. N3 THE CULL: an art item registered in VOTE after this gate (its id not among the 614 in
gates/not_vibe_coded_baseline.json) that shows an image names "sprites" (png paths) and "look" ({"px",
"palette", "light"}), and every sprite passes D1 to D5 against its family's band, or it never reaches the
tab. N4 no new UI default in the shipped demo and alpha (232 frozen: 39 gradients, 17 glows, 77 radii over
2 px in each; only down).

### Three things the instrument got wrong on the way, caught by its own plants

1. D1's first cut called a block size real when 95% of the s-blocks were one colour; clean art with big
   flat clusters then read as 2x and would have flagged mixels on good work. Now it asks where the colour
   CHANGES fall: anywhere for 1x, only on even lines for a 2x upscale.
2. D8's orphans were 4-connected, as the research line says; a one-pixel outline on a diagonal touches
   itself only at corners, so the planted made sprite scored 28 orphans per 1,000 from its outline alone.
   Now 8-connected: a diagonal line is a line.
3. R2's boundary-only colour counted the outline colour itself. Now a boundary-only colour is residue only
   when it is rare (3 pixels or fewer); a ring colour is a decision.

## 3. THE MASTER RIG THROUGH THE TEN (printed every run, not held)

HELD (the first five as N3 would hold a new item): the man, the dire wolf and round two's truck PASS all five;
the robot fails D2 (5,871 colours against the packs' 5,590) and D4 (straight darkening); the old truck fails D2
(13,047); the fox and round two's fox fail D4, round two's fox and man fail D3 from the S facing.

S facing, research numbers: every subject fails D2 (robot 5,871 colours, truck 13,047, man 1,404, fox 970,
dire wolf 482), and ROUND TWO'S TRUCK HOLDS 58, the first rig render near a cap: the quantise step in
DIRECTION's round two is visible in the numbers. D1 passes on all (one native size at 1x). D3 passes on the
robot, the truck, the man, the fox and the wolf from the S facing. The rendered-sprite set fails on all
eight subjects: the foot row moves 14 to 34 px between facings (the still is the passing pose of a walk,
which is a pose choice, not a camera fault), heights differ by 20 to 55 px, the light agrees in 4 to 8 of
the eight facings, and the robot carries 2,221 half-transparent pixels on its edge (the truck 5,874), where
round two says zero. Those are DIRECTION's numbers to close; the gate holds them only on new VOTE items.

## Not done, said plainly

- D9's data-file half (two variants per base tile, decals per prop, a hand chunk per board) needs a tile
  data file that names variants; none exists. The sheet half is built.
- D10 reads the two shipped HTML files only; a UI drawn on a canvas with fillStyle hues is not read.
- D3 "all sprites in one scene agree" across a screenshot needs the scene's sprites cut out; per sprite only.
- The demo's screenshots are not run (that needs the browser; the sprite checks do not).
- The ten do not judge taste: the scratch that tells a story, and whether anything was a decision, stay
  the reviewer's two questions (Section D's own closing line).
