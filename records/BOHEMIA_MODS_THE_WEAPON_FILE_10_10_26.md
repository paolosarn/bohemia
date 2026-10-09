# MODS [one weapon file] -- WHAT A MODDER CAN AND CANNOT EDIT ABOUT A WEAPON TODAY, AND THE ADDITIVE SHAPE (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: THE-SHAPE-OF-THE-WEAPONS-DATA-FILE (reach, shape on the tiles, cost, mastery).
Rules: 22, 47b (the gun classes are HIS to pick; this page picks none), 63d (the numbers are data files). MODE:
research. Nothing in the game changed. Instrument: `node tools/bohemia_mods_weapon_skills_audit.js` (instant).
Sources for the Battle Brothers side: reference/library/grok/GROK_03_WEAPON_TYPES_2026_09_30.md and
GROK_03_WEAPON_OPTIONS_2026_09_30.md (source: Grok, unverified; both carry EYES's PASSED FILTER stamp of 10/1);
I checked every number I quote against records/target/bb/weapons.json, which holds the wiki's own pages.

## 0. THE ANSWER IN ONE LINE

**The weapons file already holds a weapon's reach, damage, cost and skills. It does NOT hold a skill's shape on
the tiles, and the fight plays only the first skill of a weapon.** So a modder can make the knife hit harder
today (two numbers), but cannot add a sweep, a line or a "five tiles behind" to anything, and editing a
weapon's second skill changes nothing in the fight.

## 1. WHAT IS EDITABLE TODAY (weapons.json, 126 rows, one per weapon)

`damage_min`, `damage_max`, `armor_damage_pct`, `armor_ignore_pct`, `durability`, `value` (crowns, ten to the
battery), `fatigue`, `range`, `range_min`, `range_max`, `hands`, `class`, and a list of `skills`, each with `ap`,
`fatigue`, `hit_bonus` and an `effect` sentence. The fight reads `range` through its own range helpers and the
damage from the row (records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md has the worked example).

## 2. WHAT IS NOT, MEASURED

| fact | number |
|---|---|
| weapons | 126 |
| weapons with two or more strike skills | **104** |
| strike-skill slots in the file | 253 |
| distinct skills that are ever a weapon's FIRST strike skill | 38 |
| skills that are never first, so never played (Puncture, Riposte, Spearwall, Round Swing, Split, Gash, Aimed Shot and 20 more) | **27** |
| weapons whose first skill describes its shape only in a sentence | 16 (the polearms, the long axes, the pitchfork) |
| weapons that reload (they carry a skill named Reload) | 5 (three crossbows, the spiked impaler, the handgonne) |

**How the fight reads skills.** The fight's own text names weapon skills in two places: `strikeSkill(w)` takes
the first skill whose name does not start with Reload, and `reloadSkill(w)` takes the one that does. No other
line reads a weapon's skills (the third hit of `.skills` is an enemy's perk list). So of a weapon's list, the
fight plays the strike skill at index 0 and the reload. This is read from the fight's text, not from playing it.

**Shape is a sentence.** The handgonne's skill says "can hit 5 tiles behind the target"; the two-hander's
Round Swing hits "around you"; Split is "2 in a line". Those are `effect` strings. A modder who wants a new
sweep can write a new sentence and nothing will happen.

**Mastery lives in a different file.** The handgonne mastery "cuts reload to 6 AP" and Mace Mastery's
`stun_chance_pct` are in perks.json's `numbers`, joined to a weapon class by its name and a sentence.

## 3. THE ADDITIVE SHAPE (a proposal; every default equals today's behaviour, so nothing in the game moves)

Three optional fields. A row with none of them plays exactly as it does now.

1. **`skills[].shape`**, a small object: `{ "kind": "single" | "line" | "arc" | "behind", "tiles": N }`. Absent
   means single. The handgonne's Fire gets `{ "kind": "behind", "tiles": 5 }`; Split gets
   `{ "kind": "line", "tiles": 2 }`; a polearm's reach hit already works through `range`. The sentence stays;
   the object is what the fight reads.
2. **`offers`**, a list of skill names the fight puts on the weapon's card. Absent means the first strike skill
   plus the reload, as today. A modder who wants Puncture on the knife writes `"offers": ["Stab", "Puncture"]`.
3. **`mastery`**, the id of the perk in perks.json that improves this weapon (`"mace_mastery"`). Absent
   means none. This makes the join a field, not a sentence.

The worked example. The knife's row ALREADY lists two skills, Stab and Puncture, but the fight offers only Stab, so Puncture is in the file and never played. One field puts it in play:

    { "id": "knife", "damage_min": 15, "damage_max": 25 }                                     today: Stab only
    { "id": "knife", "damage_min": 15, "damage_max": 25, "offers": ["Stab", "Puncture"] }    both

**What this page does NOT decide.** Which weapon classes the game's guns, pipes and sledges map to is his pick
(rule 47b): ours.json holds his examples as `weapon_jobs` (pistol is a dagger, car door is a shield) and a
modder changes them there. The fields above carry whatever he picks. Nothing about a gun's class, a price or a
cost is chosen here.

## 4. WHAT THIS DOES NOT FIX, AND THE ONE THING THAT NEEDS A CODE CHANGE

- Fields 1 and 2 need the fight to read them; today it does not. That is COMBAT's work, on the day he says
  build, and the three defaults above keep it a one-line-at-a-time change (read `offers` if present, else
  today's rule). Field 3 needs only the schema.
- It still checks type, not range (records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md section 4).
- 38 skills are ever first; the other 27 have no effect text a modder can trust because nothing plays them.
  A modder reading the file sees 67 skills and 38 of them matter.

## 5. ROUTED

- **COMBAT**: sections 3 and 4. Reading `offers` and `shape` is yours; the defaults mean no rows have to change.
- **PLUMBER**: the audit (`tools/bohemia_mods_weapon_skills_audit.js`) is the number to re-run: skills never
  first, 27 today, should fall as skills are offered.
- **MODS next**: [grok sources] waits on EYES only for pages not yet stamped; the stamped ones are cited above.
  The lane writes its next row from the jump list (below).
