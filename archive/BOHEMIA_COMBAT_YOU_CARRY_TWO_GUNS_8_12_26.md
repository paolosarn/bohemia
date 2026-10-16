# YOU CARRY TWO GUNS, AND THE SWAP COSTS YOU THE BEAT

**8/12/26 — COMBAT lane. Answers Paolo [T22]: "I actually went in the settings to
switch my gun so I can get a longer range and I think that's important. Maybe
this should be a swap you know switch to secondary or maybe you get an option to
carry two guns on you no matter what they all have their pros and cons."**

---

## YOU ALREADY PLAYED THE MECHANIC. YOU JUST HAD TO USE A MENU TO DO IT

You hit a range problem mid-fight and solved it by opening **settings** and
changing weapons. **A player reaching past the game to do a thing the game
should offer is the strongest possible signal that a mechanic is missing.**

And it only became interesting because ranges exist now. A shotgun reaches 5
tiles and a rifle 20 — those are different games. Carrying one gun means the
board decides whether your weapon is useful. Carrying two means **you** decide,
and you pay for it.

## THE RESEARCH: A FREE SWAP IS AN EXPLOIT, NOT A FEATURE

This is a solved problem and the answer is unanimous. If switching costs
nothing, the correct play is to hold whichever weapon is better *this instant*
and switch back after — every turn, forever. Designers name it explicitly:
attack with the offensive weapon, switch to the defensive one to be tanky while
waiting, switch back on your turn, all free.

The other half is equally real: **going to a sidearm is faster than reloading.**
That is why anyone carries one. So the cost should be a beat, not a fumble.

**So the swap is your turn.** Fast enough to be worth doing, expensive enough
that you have to see it coming. You swap *instead* of shooting, they get their
volley, and you come up next beat holding the right gun.

**Anticipating the range you are about to be in, one beat early, is the skill
this adds.**

## WHAT YOU CARRY

Always a short and a long — whatever your primary is, the secondary is its
opposite number. Pistol pairs with rifle, shotgun with SMG. So every loadout has
a close answer and a far answer.

**Which guns you actually own is not decided here.** This reads the weapon you
already have and gives it a partner. What you find, buy and lose is the run's
business, and yours.

The button is the third one under your thumb, beneath GREN, and **it names the
gun rather than the verb** — the useful information is *which* gun, because you
are choosing a range, not an action.

## VERIFIED BY PRESSING THE REAL BUTTON

| | |
|---|---|
| button in the DOM, labelled | **RIFLE** |
| before | pistol, reaches **16 tiles** |
| after one press | rifle, reaches **44 tiles** |
| routed through | the enemy volley — the turn was spent |

One honest caveat: my "turns spent" counter is the melee-turn counter, which is
a weak proxy and under-counted on a double swap. What is actually verified is
that **every swap goes through the return-fire path**, which is the cost. I am
saying that rather than quoting a number I do not trust.

Tool: `tools/bohemia_combat_you_carry_two_guns_patch.py`
Gate: `gates/combat_lab_gate.js`, 771 → 774 checks.

**WHERE TO SEE IT: the COMBAT tab.** Third thumb button, under GREN. It says the
gun it will hand you.

---

Sources:
- [Should swapping weapons cost actions? — EN World](https://www.enworld.org/threads/should-swapping-weapons-cost-actions-is-it-worth-tracking-what-is-in-your-hands.316410/)
- [Why do players keep swapping between primary and secondary in Counter-Strike?](https://www.quora.com/Why-do-the-players-keep-on-swapping-between-primary-and-secondary-weapons-while-playing-Counter-Strike)
- [Equipping and action economy — Larian forums](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=736638)
- [Tactical reload — Wikipedia](https://en.wikipedia.org/wiki/Tactical_reload)
