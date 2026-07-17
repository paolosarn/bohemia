# BOHEMIA ADDENDUM — QUEST AUTHORING RESEARCH + THE .BQ FORMAT
Filed 7/16/26. Trigger: Paolo, "you need to do research on what you need to make it easy for us to edit
these quests."

---

## 1 THE QUESTION
Bohemia has 53 written quests (132,215 words) and a target of many more. They currently live as prose
markdown. Prose is unshippable: an engine cannot read it, a test cannot gate it, and a change to stage 4
cannot be verified not to break stage 9. The question is what format Paolo's quests live in so that they
are (a) editable by Paolo on an iPhone by voice, (b) executable by the engine, (c) testable by machine,
(d) survivable across three dynasties and 100 years.

---

## 2 WHAT THE FIELD ACTUALLY USES

### articy:draft (Disco Elysium)
Visual node flowchart plus a content database (characters, items, locations, quests). Lead writer Helen
Hindpere credited the tool for the game's wordiness; the free-space visual flow made building conversations
fast and editing them later easy.
**DISQUALIFIED FOR BOHEMIA, three ways:**
1. Windows-only standalone desktop. Paolo works on an iPhone.
2. Subscription (free tier capped at 700 objects per project). Bohemia's 53 quests alone would blow it.
3. **It broke.** ZA/UM reported it got janky and eventually froze completely at their word count; articy's
   own team said they had never seen the problem before. Disco Elysium is ~1M words. Bohemia's three-dynasty
   100-year arc with 13 factions is in that weight class. **A tool that dies at the target scale is not a
   tool.**
**KEEP THE IDEA, NOT THE TOOL:** the visual flow is why they wrote so much. Bohemia needs the visual, in a
browser, on a phone.

### Ink (inkle) / Yarn Spinner (Night in the Woods, DREDGE, A Short Hike)
Plain-text markup. Choices, variables, conditions, and commands written as text, executed by a runtime
interpreter. Yarn is deliberately script-formatted (film/theatre shaped) for writer approachability.
**WHY THIS IS THE RIGHT FAMILY:**
- Plain text = clean diffs. You can see exactly what changed between two versions of a quest.
- Plain text = greppable. The NEVER-LOSE-FILES LAW runs on grep. A binary quest database cannot be
  recovered from a transcript. A text quest can.
- Plain text = Claude can generate it at volume. FACTORY LAW.
- Text lines carry invisible metadata via TAGS, and the game parses tags to fire engine behavior.
**WHY NOT ADOPT EITHER DIRECTLY:** both are built for dialogue-first games with a single protagonist and a
flat world. Neither has roles, factions, generational persistence, or a record system. Bohemia would spend
more effort bending them than writing its own. Bohemia is a single HTML file with its own engine; it takes
the IDEA (text markup + tags + runtime interpreter) and not the dependency.

### Twine
Visual, browser-based, open source, exports HTML. Closest platform match. But state tracking is manual
scripting, and the output is a story, not a quest that has to talk to a city simulation.
**KEEP:** browser-based visual editing is proven and it is the only one of these that runs where Paolo is.

### Bethesda Creation Kit (Skyrim, Fallout 3/4/NV) — **THE IMPORTANT ONE**
This is the model, because it is the only one on this list built for an open world with a simulation
underneath, and Bohemia is that.

The model, in four parts:
1. **STAGES.** A quest is a list of numbered stages. Setting a stage is monotonic by default: once set, a
   stage does not re-fire. Stages carry a log entry (what the journal says now, only the latest is shown)
   and a code fragment that runs on entry. Stages can be flagged complete-quest or fail-quest.
2. **ALIASES = ROLES.** *This is the finding.* An alias is a ROLE the quest defines: "the thief," "the
   quest giver," "the amulet." It points at an actual world reference only at runtime, when the quest
   starts. The dialogue, the objectives, and the map markers all target the ALIAS, never a specific NPC.
3. **OBJECTIVES.** Display text plus a target, and the target is an alias. Shown and completed by the stage
   fragments.
4. **CONDITIONS.** Every dialogue line carries conditions, and conditions can be evaluated against a quest
   alias rather than against the speaker, so one written line can serve any actor who fills the role.

**THE FAILURE MODE THEY DOCUMENT, WHICH IS THE BEST PART:** if an alias fails to fill, **the entire quest
fails silently.** Stages do not set, actors do not speak, fragments do not run, objectives do not display.
Bethesda ships a debug flag specifically to print alias-fill errors. They learned this the hard way and
built a warning for it. **Bohemia gets that gate on day one, not after twenty-five years of a bugged flag
(Q116).**

### WHY ALIASES ARE THE WHOLE BALLGAME FOR BOHEMIA
Bohemia is a roguelite. Dynasts die. Generations turn over. The Amalgamation eats people. Factions rise and
collapse across 100 years. **A quest written against a named NPC is a quest that dies with him.** A quest
written against a ROLE ("the quartermaster of whoever currently holds the water plant") survives the
dynasty, refills against a new person, and plays again with different weight.

This is also, for free, the roguelite engine: **the same authored quest is a different quest each run
because the roles fill differently.** Q48 (Nemesis) and Q46 (CK3) both point at this. Bohemia's version:
authored quests, procedural casting.

**AND IT IS THE FIX FOR Q125's DEEPEST PORT.** Tali's trial is four politicians using a person as a wedge.
Written against names, that quest happens once. Written against roles (the war party, the property party,
the peace party, the family friend who should have recused), **it happens every generation with different
people in the chairs, and the player watches the same machine grind a different person.**

---

## 3 WHAT "EASY TO EDIT" ACTUALLY MEANS, RESOLVED

Ranked by what actually blocks Paolo:
1. **He does not open files.** Therefore: the editor is a single HTML file, presented, tap-to-download, runs
   in Safari on the phone. Same stack as the rig, the labeler, the verdict tools. Nothing new to learn.
2. **He types by voice, and voice-to-text garbles.** Therefore: **the format must never punish a typo.**
   No significant whitespace. No matched brackets that break the file. No YAML. A malformed line becomes a
   flagged warning, never a parse crash that eats the quest.
3. **He edits in bursts and decides fast.** Therefore: the editor loads the whole quest, shows the graph,
   and any edit writes back to the same plain text. Round-trip must be lossless. Text in, text out, byte
   comparable.
4. **The work must never be at risk.** Therefore: plain text, greppable, diffable, transcript-recoverable.
   Exports as .txt, never .json (iOS blanks .json on chat share).
5. **He wants volume.** Therefore: Claude generates .bq at scale, the gate validates, Paolo judges in an
   interactive. FACTORY LAW, unchanged.
6. **Nothing is ever silently lost.** Therefore: the validator is a REGRESSION GATE, run on every quest,
   every build, and a broken reference fails loud. Not a warning in a log nobody reads.

**DECISION: Bohemia writes its own format.** Yarn's plain-text shape, Bethesda's stages-and-aliases model,
Twine's browser-based visual editing, articy's database-behind-the-flow. None of the dependencies.
Format name: **.bq** (Bohemia Quest). Plain text. UTF-8. Line-oriented. Shipped as .txt.

---

## 4 THE .BQ FORMAT — SPEC v1

Line-oriented. Every construct is one line starting with a sigil. Order inside a block does not matter.
Unknown lines are preserved verbatim and flagged, never dropped. **A garbled line is a warning, not a
crash.**

```
@QUEST     bq_id  title
@ACT       1|2|3            which dynasty act it can fire in
@FACTION   role_or_faction  owning faction, or NONE
@ONCE      true|false       once per dynasty, or repeatable

# ---- ROLES (Bethesda aliases). Cast at quest start. NEVER a hardcoded name.
@ROLE      giver     REQ  faction=WATER rank>=2 alive
@ROLE      target    REQ  faction=NETWORK
@ROLE      witness   OPT  spared_by_player=true      <- OPTIONAL role. Absent = quest still runs.
@ROLE      relic     REQ  item_tag=record

# ---- STAGES. Numbered, monotonic by default.
@STAGE 10
  @LOG   what the journal says now
  @DO    show_objective 10
  @DO    set_flag met_giver

@STAGE 20 COMPLETE          <- flags: COMPLETE | FAIL | REPEAT

# ---- OBJECTIVES. Target a ROLE, never a name.
@OBJ 10  "Find the record"  target=relic

# ---- CONVERSATIONS. Node trees. This is the part v1 of the questbook was missing.
@TALK node_id  speaker=giver  entry=stage>=10
  @SAY   the line, written out, in Bohemia's voice
  @OPT   "what the player says"  [gate: none]         -> node_id2   @DO set_flag x
  @OPT   "another thing"         [gate: knows:agenda] -> node_id3
  @OPT   "the trap"              [gate: none] TRAP    -> node_id4   @DO faction WATER -10
  @OPT   (say nothing)           [gate: none] SILENCE -> node_id5
  @LOCK  node_id6                <- this node, once seen, kills that one forever
  @NOVERB "the obvious thing to say"   <- documents a verb DELIBERATELY not offered
@END
```

### THE GATE VOCABULARY (deliberately small, deliberately not a stat)
```
[gate: none]                always available
[gate: knows:TOPIC]         player learned something. KNOWLEDGE, not a stat.
[gate: flag:NAME]           an earlier flag, this run or a previous generation
[gate: has:item_tag]        inventory
[gate: role:witness]        an OPTIONAL role got cast, i.e. someone you spared showed up
[gate: faction:X>=N]        standing with a faction
[gate: gen>=2]              which dynasty is playing
```
**THERE IS NO `[gate: charm>=N]`. THERE IS NO KARMA GATE. EVER.**
This is the CONSCIENCE SYSTEM law enforced at the level of the file format. Q121 and Q125 are two
convictions on the same charge: the moment a moral choice is gated on a stat or scored on a bar, it stops
being a dilemma and becomes a build decision. **The format physically cannot express it.** The parser
rejects `charm`, `paragon`, `renegade`, `karma`, `speech`, `morality` as gate keys and fails the build.
The only things that open a door are **what you know, what you did, and who you were decent to.**

### TAGS
Any line can carry trailing tags: `#dread #amalgamation #gen2`. Tags are invisible metadata the engine and
the search read. Yarn's trick, kept.

---

## 5 THE VALIDATOR (the regression gate)
Runs on every .bq, every build. Fails LOUD. Ports into `bohemia_tests.js`.

1. **ALIAS-FILL GATE.** Every REQ role must be castable given the world state the quest declares it fires
   in. An uncastable REQ role is a build failure, not a silent no-op. **This is the Bethesda lesson taken
   for free instead of learned in production.**
2. **NO ORPHAN NODES.** Every @TALK node is reachable from an entry. Unreachable = theme-in-optional, the
   flaw with ~18 confirmations. Fail it.
3. **NO DEAD LINKS.** Every `-> node_id` resolves. Every `@LOCK` target exists.
4. **NO HARDCODED NAMES.** A proper noun in a @SAY that is not a declared role is a warning. Names are how
   quests die when dynasties turn over.
5. **BRANCH COUNT.** Every quest reports its ending count. Q117's law: count branches before scoping volume.
6. **NO BANNED GATES.** charm/paragon/renegade/karma/speech/morality = build failure.
7. **EVERY QUEST HAS AT LEAST ONE @NOVERB.** Soft warning. A quest where every obvious thing is sayable has
   not decided what it is about. Q118/Q122/Q123/Q125: the game removes the verb.
8. **NAMED-BODY LAW (Q125).** A stage tagged `#namedbody` must contain zero loot @DO. Fail if it does.
9. **PERSISTENT FLAGS CROSSING A GENERATION BOUNDARY GET A TEST.** Any flag read at `gen>=2` that is written
   in gen 1 must have a named test. Q116 shipped a flag bugged for twenty-five years. FLAW LAW 3.
10. **ROUND-TRIP.** Parse -> serialize -> byte-compare. Lossless or fail. Paolo's words never get eaten by
    the tool.

---

## 6 THE EDITOR
Single HTML file. iPhone Safari. Tap-to-download, presented every ship turn. SUN MODE default (daylight
readable, high contrast, 16px minimum to stop iOS zoom). Comment box at the bottom, per the interactive law.
- Loads .bq (paste or file), shows the quest as a node graph plus a stage list.
- Tap a node, edit the lines, tap an option, see what it gates and what it writes.
- Live validator panel: every gate above, red/green, live.
- Branch counter, always visible.
- Export .txt, round-trip lossless.
- Never destroys unknown lines. Preserves and flags them.

---

## 7 WHAT THIS DOES NOT DECIDE
**[PENDING, Paolo's call]** on all of these. Claude does not pick:
- Whether the 53 existing production quests get converted to .bq, and whether Claude does the conversion
  or Paolo re-cuts them by hand. Conversion is lossy in one direction: prose says things a node tree
  cannot. **Recommendation, not a decision: convert a single quest first and look at it before touching
  the other 52.** The prose originals are never deleted regardless.
- Whether .bq stages are visible to the player as a journal at all, or whether Bohemia has no quest log
  (Q23/Q37: directions, not markers).
- The sigil characters, the format name, and whether "role" or something else is the word.

---

## 8 SOURCES
- articy showcase, Disco Elysium (Helen Hindpere, Cash DeCuir on the flow editor and editing ease)
  `https://www.articy.com/en/showcase/disco-elysium/`
- PC Gamer / Noclip: Disco Elysium's word count froze articy completely; articy had never seen it before
  `https://www.pcgamer.com/games/rpg/disco-elysium-had-so-much-text-it-broke-the-branching-narrative-software-we-were-writing-too-much/`
- Narrative tool landscape 2026: visual node editors vs text scripting, and the Git-diff tradeoff; Bloodlines 2 on Ink
  `https://storyflow-editor.com/blog/best-narrative-design-tools-for-game-developers-2025/`
- Katharine Neil, Twine 2 vs Ink vs Yarn: tags as invisible metadata, variable observers, text-as-instruction parsed by the game
  `https://medium.com/@haikus_by_KN/authoring-interactive-narrative-in-twine-2-vs-ink-a-quick-and-dirty-comparison-using-examples-e695eb4dfc3e`
- Yarn Spinner shape and shipped titles (Night in the Woods, DREDGE, A Short Hike, Lost in Random)
  `https://www.dlab.ninja/2025/09/tools-for-developing-video-games.html`
- Creation Kit: Quest Objectives tutorial. Aliases as ROLES the quest defines; objectives target aliases
  `https://ck.uesp.net/wiki/Bethesda_Tutorial_Quest_Objectives`
- Creation Kit: Quest reference. Stage monotonicity, allow-repeated-stages, complete/fail flags, stage
  fragments, and the alias-fill failure mode plus the warn-on-alias-fill-failure debug flag
  `https://falloutck.uesp.net/wiki/Quest`
- Beyond Skyrim, Arcane University: conditions run against a Quest Alias rather than the speaker
  `https://wiki.beyondskyrim.org/wiki/Arcane_University:Implementation_Scribe_Assignment`

**FUTURE DEEPER PULLS**
1. Bethesda's **Story Manager** and Radiant quest system. Roles + procedural casting is exactly Bohemia's
   roguelite need. Deserves its own file.
2. Justin Keenan, GDC 2021, on Disco Elysium's branching being primarily aesthetic rather than instrumental.
   Directly relevant to whether Bohemia's options need to DO things or be allowed to just be things.
3. Ink's tag system in depth, for the Bohemia tag vocabulary.
4. Scene/camera authoring. .bq v1 has no scene direction. Cross-ref BOHEMIA_ADDENDUM_DIALOGUE_SCENE_PRODUCTION_SPEC_7_10_26.md.
