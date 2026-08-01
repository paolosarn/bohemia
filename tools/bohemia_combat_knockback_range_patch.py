#!/usr/bin/env python3
"""V111 ONLY UP CLOSE. THE RESEARCH SAID SO AND IT SAID WHY.

Paolo asked the question and asked for the research: should a shotgun kill at
long range still throw the body, or only up close?

THE ANSWER IS ONLY UP CLOSE -- and the reason is not the reason I expected,
which is why it is worth writing down.

--------------------------------------------------------------------------
FINDING 1: NOTHING THROWS A BODY. NOT A SHOTGUN, NOT ANYTHING.
--------------------------------------------------------------------------
The knockback we all picture is a film invention and the disproof is one line
of Newton's third law: if a gun could deliver enough momentum to launch a
victim backwards, the recoil would launch the SHOOTER backwards just as hard.
A ~40g payload at ~400 m/s against an ~80kg body produces a velocity change
that is, in the sources' word, imperceptible. Movement at the moment of a hit
is physiological -- a body failing -- never momentum.

So "does a shotgun throw a body at range" was the wrong question. It does not
throw a body at ANY range.

--------------------------------------------------------------------------
FINDING 2: BUT SOMETHING REAL DOES CHANGE WITH RANGE, AND IT IS DRAMATIC
--------------------------------------------------------------------------
Forensic pathology is unambiguous about what close actually changes:

  * AT CONTACT AND NEAR-CONTACT the pellets "penetrate the target as a single
    mass", producing "a single, round defect" -- one large wound, not a
    pattern -- and "the body absorbs the entire discharge of the cartridge,
    not just the projectile", because the propellant gas goes in too. The
    sources call these wounds devastating and note the gas may do more damage
    than the shot.
  * AT DISTANCE the pattern opens and the same cartridge arrives as separate
    small wounds. Pattern-controlled 00 buck spreads ~6.2 inches from the
    centreline by 40 yards, fewer pellets connect, and a single 00 pellet
    carries less energy than a .380.

THAT is the difference, and it is a RANGE FACT, not a FORCE fact. Up close a
man takes one catastrophic hit and goes down hard and away from the muzzle.
Far away he takes a scatter of holes and folds where he stands.

--------------------------------------------------------------------------
FINDING 3: EVERY GAME EVER MADE ALREADY AGREES
--------------------------------------------------------------------------
Shotgun damage AND knockback falling off hard with distance is so universal it
has a trope name (Short-Range Shotgun). Shooters commonly scale it linearly
past a falloff start -- one documented example is about 9% per metre -- and
the stated design reason is exactly ours: it locks the weapon to its intended
range instead of letting it be the answer to every question.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
v109 threw a body for `blast`, for `shotgun` AT ANY RANGE, or for anything at
point blank. Two of those three were wrong.

  * AN EXPLOSION STILL THROWS AT ANY RANGE. Overpressure is a wave acting on
    the whole surface of a body at once -- a genuinely different mechanism
    from a projectile, and the one case where the film version is true.
  * A SHOTGUN THROWS ONLY INSIDE PT_BLANK. That is the one-mass band.
  * NOTHING ELSE THROWS, EVER, INCLUDING AT POINT BLANK. A pistol at contact
    is still a pistol. v109 let every weapon throw up close and that was the
    Hollywood reflex sneaking back in through a range check.

AND THE NUMBER WAS ALREADY IN THE FILE. PT_BLANK is 4 tiles, and this engine's
own comment puts a tile at ~1.5m, so point blank is ~6m / ~6.5 yards. The
patterning literature tests at 5, 7, 10, 15 yards and the tight single-mass
band lives at the short end of that. The constant Paolo ruled on for a
completely different reason lands on the real one-mass distance. It is used as
found -- no new number is invented for this.

WHAT IT DOES TO THE GAME: the shotgun stops being the universal answer and
becomes a REASON TO CLOSE. Take the long shot and he folds; walk into his
face and he leaves his feet. That is the same trade his point-blank ruling
already makes everywhere else in this fight.

SOURCES (recorded in full in records/, with links):
  Newton's third law / the knockback myth  -- freethoughtblogs, HandWiki
    Recoil, Wikipedia Recoil, thegunzone
  contact-wound pathology                  -- Wikipedia "Contact shot",
    Pathology Outlines, behindthecrimescene
  buckshot patterning and energy at range  -- Lucky Gunner Lounge,
    tactical-life 00 buck test, brassfetcher
  the design convention                    -- TV Tropes Short-Range Shotgun,
    Zeke Virant's damage-falloff comparison, GTFO wiki Damage Falloff

REUSE CHECK: cooks NO graphic pixels. It changes one predicate. No bank is
opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry and reshapes
  nothing. It selects between two already-baked falls.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V111 ONLY UP CLOSE'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v111 already in; nothing to do')
        return

    old = """function deathFall(e,src,dist){
  /* KNOCKBACK: a shotgun, anything at bad-breath distance, or an explosion.
     A body hit by any of those does not fold up where it stood. */
  const d=(dist!=null)?dist:(e&&e.edist!=null?e.edist:99);
  if(src==='blast'||src==='shotgun'||d<=PT_BLANK)return FALL_KNOCK;"""
    new = """/* ===== V111 ONLY UP CLOSE ==========================================
   Paolo asked whether a shotgun should still throw a body at long range, and
   asked for the research. The answer is NO, and the reason is not the obvious
   one, which is why it is written here instead of just tuned.

   NOTHING THROWS A BODY. Not a shotgun, not anything. The disproof is one
   line of Newton's third law: if a gun could deliver enough momentum to
   launch a victim backwards, the recoil would launch the SHOOTER backwards
   just as hard. A ~40g payload against an ~80kg body changes its velocity by
   an amount the sources call imperceptible. Movement at the instant of a hit
   is a body FAILING, never momentum.

   BUT SOMETHING REAL DOES CHANGE WITH RANGE. Forensic pathology on contact
   and near-contact shotgun wounds: the pellets "penetrate the target as a
   single mass", making one large round defect rather than a pattern, and
   "the body absorbs the entire discharge of the cartridge, not just the
   projectile" -- the propellant gas goes in too, and can do more damage than
   the shot. At distance the pattern opens (pattern-controlled 00 buck is
   ~6.2in off the centreline by 40 yards, and one 00 pellet carries less
   energy than a .380) and the same cartridge arrives as scattered holes.
   ONE CATASTROPHIC HIT drives a man down and away. A SCATTER OF HOLES folds
   him where he stands. That is a RANGE fact, not a FORCE fact.

   AND THE NUMBER WAS ALREADY IN THE FILE. PT_BLANK is 4 tiles and this
   engine puts a tile at ~1.5m, so point blank is ~6m -- and the patterning
   literature's tight single-mass band sits right at that short end. The
   constant Paolo ruled on for an entirely different reason lands on the real
   one-mass distance, so it is used as found and no number is invented here. */
function deathFall(e,src,dist){
  const d=(dist!=null)?dist:(e&&e.edist!=null?e.edist:99);
  /* THE ONE CASE WHERE THE FILM VERSION IS TRUE: overpressure is a WAVE
     acting on the whole surface of a body at once, not a projectile. An
     explosion really does move people, at any range it still reaches. */
  if(src==='blast')return FALL_KNOCK;
  /* THE SHOTGUN, AND ONLY INSIDE THE ONE-MASS BAND. Beyond it the pattern has
     opened and he folds like anyone else -- so the shotgun stops being the
     universal answer and becomes a REASON TO CLOSE, which is the same trade
     his point-blank ruling already makes everywhere else in this fight. */
  if(src==='shotgun'&&d<=PT_BLANK)return FALL_KNOCK;
  /* AND NOTHING ELSE THROWS, EVER, INCLUDING AT POINT BLANK. v109 let EVERY
     weapon throw up close; that was the Hollywood reflex getting back in
     through a range check. A pistol at contact is still a pistol. */"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v111: only a blast, or a shotgun inside the one-mass band (%d chars)' % len(s))


if __name__ == '__main__':
    main()
