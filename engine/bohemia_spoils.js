/* BOHEMIA SPOILS -- what a won fight leaves you, and who grew (RUN TWO [the end of the fight, the loot, the stash], 10/24/26).
   PAOLO 10/24 (VAMILY rule 156): 'I've been killing enemies all this time, winning battles, but there isn't an end of battle
   quick summary of who got experience, who leveled up, and what loot I'm able to take, with a loot button; and if my
   inventory is full it loots as much as it can and stops, similar to Battle Brothers.'
   Pure functions, no screen (the screen is slices/BOHEMIA_SPOILS_SCREEN.html):
     found(spoils, L, rnd)            the fight's report (BOHEMIA_FIGHT_OVER .spoils) through Battle Brothers' drop conditions
                                      (records/target/bb/loot.json): {items:[{kind,id,cond,max,from}], counts:{batteries,rounds,scrap}}
     grew(rows, climb, xpFor, levelOf) each man's XP and level before and after, the way the crew screen will climb him
     take(stash, ground, i, cap)      one piece from the ground into the stash, if there is room
     takeAll(stash, ground, cap)      as many as fit, in order, then stop: {took, left}
   node: require('./bohemia_spoils.js')   Gate: gates/the_spoils_gate.js */
(function (root) {
  'use strict';
  function pct(now, max) { return max > 0 ? 100 * now / max : 0; }
  /* one part of one body: is it found, and at what wear (school.drop_conditions, school.armour_wear_on_loot) */
  function partFound(part, now, max, D, rnd) {
    var r = D.drop[part]; if (!r) return { found: false, wrecked: false };
    if (!(now > r.min_durability_over) || pct(now, max) < r.min_pct) return { found: false, wrecked: true };
    if (rnd() * 100 >= r.roll_pct) return { found: false, wrecked: false };
    var cond = now, w = D.drop.wear;
    if (w && w.parts.indexOf(part) >= 0 && pct(now, max) > w.above_pct && rnd() * 100 < w.chance_pct) {
      var lo = Math.round(max * w.down_to_pct / 100); cond = lo + Math.floor(rnd() * (Math.max(lo, now) - lo + 1));
    }
    return { found: true, wrecked: false, cond: cond };
  }
  function found(spoils, D, rnd) {
    rnd = rnd || Math.random;
    var out = { items: [], counts: { batteries: 0, rounds: 0, scrap: 0 }, from: 0, faction: spoils && spoils.faction || null };
    if (!spoils || !Array.isArray(spoils.bodies) || !D) return out;
    var no = D.drop.nothing_from || [], C = D.counts;
    spoils.bodies.forEach(function (b) {
      if (!b || (D.drop.only_the_dead && !b.dead)) return;
      if (no.some(function (k) { return b[k]; })) return;   /* school.beasts_carry_nothing, school.ghosts_carry_nothing */
      out.from++;
      var w = b.weapon;
      if (w) {
        var thrown = (D.drop.thrown_classes || []).indexOf(w.cls) >= 0;
        var spent = thrown && D.drop.weapon.thrown_needs_ammo && !(w.ammo > 0);   /* a thrown weapon spent is not there: nothing, not scrap */
        if (!spent) { var f = partFound('weapon', w.durability, w.durability, D, rnd);
          if (f.found) out.items.push({ kind: 'weapon', id: w.id, cond: w.durability, max: w.durability, from: b.name });
          else if (f.wrecked) out.counts.scrap += C.scrap.per_wrecked_piece; }
        if (w.gun && w.ammo > 0) out.counts.rounds += w.ammo | 0;   /* counts.rounds: the rounds left in his gun */
      }
      if (b.shield) { var s = partFound('shield', b.shield.durability, b.shield.durability, D, rnd);
        if (s.found) out.items.push({ kind: 'shield', id: b.shield.id, cond: b.shield.durability, max: b.shield.durability, from: b.name });
        else if (s.wrecked) out.counts.scrap += C.scrap.per_wrecked_piece; }
      ['body', 'head'].forEach(function (part) {
        var a = b[part]; if (!a) return;
        var g = partFound(part, a.now, a.max, D, rnd);
        if (g.found) out.items.push({ kind: part, id: a.id, cond: g.cond, max: a.max, from: b.name });
        else if (g.wrecked) out.counts.scrap += C.scrap.per_wrecked_piece;
      });
      if (b.machine) out.counts.batteries += C.batteries.machine_cell;
      else if (rnd() * 100 < C.batteries.pocket_chance_pct) out.counts.batteries += C.batteries.pocket;
    });
    return out;
  }
  /* each man's climb, read the way the crew screen climbs him (engine/bohemia_roster.js grant: his kept XP plus the fight's,
     the wiki's level table); a man the crew screen has never kept starts at his fight level's XP */
  function grew(rows, climb, xpFor, levelOf) {
    climb = climb || {};
    return (rows || []).map(function (r) {
      var c = climb[r.name], lv0 = c && c.level ? c.level : Math.max(1, r.level | 0), xp0 = c && c.xp != null ? c.xp : xpFor(lv0);
      var gained = Math.max(0, r.xpGained | 0), xp1 = xp0 + (r.dead ? 0 : gained), lv1 = r.dead ? lv0 : Math.max(lv0, levelOf(xp1));
      return { name: r.name, main: !!r.main, gained: r.dead ? 0 : gained, xpFrom: xp0, xpTo: xp1, from: lv0, to: lv1, up: lv1 > lv0,
        base: xpFor(lv1), next: xpFor(lv1 + 1), dead: !!r.dead && !r.main, down: !!r.down, days: r.laidUpDays | 0, injury: r.injury || null };
    });
  }
  function take(stash, ground, i, cap) {
    if (!ground[i]) return { ok: false, why: 'gone' };
    if (stash.length >= cap) return { ok: false, why: 'full' };
    stash.push(ground.splice(i, 1)[0]); return { ok: true };
  }
  function takeAll(stash, ground, cap) {
    var took = 0;
    while (ground.length && stash.length < cap) { stash.push(ground.shift()); took++; }
    return { took: took, left: ground.length };
  }
  var API = { found: found, grew: grew, take: take, takeAll: takeAll, partFound: partFound };
  root.BohemiaSpoils = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
