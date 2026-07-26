# BOHEMIA ADDENDUM — THE LAB PORTS ONLY ON HIS WORD, AND ONLY MECHANISM (Paolo 7/26/26)

AMENDS laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md point 4 ("The lab never
ports anything itself") and laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md.

Paolo, after playing LAB-03: "Awesome! All these things worked. Very good! Did you
learn anything. Anything we can throw in the bohemia code right now?"

That is a PORT ORDER. The lab law's "never ports" clause exists so a lab session
cannot decide on its own that its toy belongs in the game. It was never meant to
stop him asking for one.

## THE LAW

1. **A LAB PORT NEEDS HIS WORD.** Silence is not permission and a good finding is
   not permission. The lab writes the pattern note and stops. When he says port
   it (in any words), the port happens that turn.

2. **A LAB PORT SHIPS MECHANISM ONLY, IN ITS OWN NEW FILE.** No content, no
   thresholds, no cost tables, no defaults for any real Bohemia system. Every
   number a mechanism needs is passed in by its caller, and the day a caller
   wants a default, that default is a RULING and not a line of code the lab gets
   to write. This is MECHANISM-MINE / CONTENTS-PAOLO'S applied to ports, and its
   own gate enforces it by refusing to let the module name a single piece of
   Bohemia or Stardew content in executable code.

3. **A LAB PORT DOES NOT WIRE ITSELF IN.** It lands as a standalone headless
   module with a gate. Wiring it into a surface (the run, the alpha, the city
   tab, combat) is the OWNING LANE's build item, because that lane is editing
   those files right now and PARALLEL SESSIONS says stay out. A port that edits
   another lane's file is the violation, not the port.

4. **A PORTED MECHANISM CARRIES ITS PROVENANCE.** The module records which lab
   study each mechanism came from and cites the record files. A mechanism whose
   origin is not written down gets re-litigated in three weeks by somebody who
   was not there.

5. **NEW MECHANISM, NEW GATE, SAME TURN.** Standing law, restated here because a
   ported mechanism with no gate rots back into whatever it replaced.

## THE FIRST PORT (7/26/26)

engine/bohemia_resolve.js, gated by gates/resolve_gate.js (59 checks):
- **RESOLVE** — one moment, a declared phase order, and no system able to see
  another's report. From LAB-03: three mechanics sharing nothing but the day
  rollover. Lands on TIME IS SPENT BY ACTIONS.
- **RATION** — a limit by COUNT per day and per week with a bypass that overrides
  both. From LAB-02: Stardew's gifts are 1/day and 2/week and a birthday ignores
  both and pays 8x. The gate proves there is no price term anywhere in it.
- **CEILING** — points cannot pass the current state's cap and only a STATE
  CHANGE moves the cap. From LAB-02: an undated villager hard-caps at 8 hearts
  (Utility.cs:2901) and you have to accept the bouquet, not grind.
- **REACH** — one declared interaction range, one facing rule, one predicate.
  From LAB-03: forgiveness is a number and it is small.

Nothing is wired into a surface. The lanes that want them adopt them.
