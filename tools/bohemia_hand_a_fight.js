/* BOHEMIA HAND A FIGHT (FIXES 5, 11/27/26; VAMILY rule 495(b): one thing, one place).
   A checker that needs his men HURT on the map hands a fight's wounds to the company's condition through the condition's own door,
   BohemiaCondition.afterFight (engine/bohemia_condition.js), the same call the shell makes after every fight, instead of writing the
   condition's storage by hand. Since CAMP FOUR's __CAMP_WAITS_FOR_HIM__ (rule 472(a), Paolo 11/22: 'I want time to go by until
   everyone's healed, but then when everyone is healed I want time to stop') a camp runs the clock only while a man mends, so a
   checker that makes camp to pass the hours must hurt the crew first, the way a fight does.

   Use (in a frame that loads the condition, the map's or the shell's):
     const { handAFight } = require('tools/bohemia_hand_a_fight.js');
     const c = await frame.evaluate(handAFight, { hp: 6, hpMax: 60, armour: 0.1 });
   Every living man of the company is handed hpMax and hp, and a tenth (armour) of a head piece of 20 and a body piece of 80.
   At the camp's rates (records/target/bb/condition.json: 10 hit points an hour, armour 15 x 2) 54 hit points lost are about five
   and a half hours of mending. Returns the company after it ({ men, hurt, done, lowest }).

   KNOWN COPIES (the debt this file starts paying, PLUMBER 9's count, rule 495(c)): fourteen gates write 'bohemia.condition.v1' by
   hand (the camp's, the face's, the fight's); each moves here when its owner next touches it. */
'use strict';
function handAFight(o) {
  o = o || {};
  const hpMax = +o.hpMax || 60, hp = o.hp == null ? 6 : +o.hp, arm = o.armour == null ? 0.1 : +o.armour;
  const C = window.BohemiaCondition, c = C.company();
  C.afterFight(c.names.map(k => ({ name: k, main: k === 'YOU', hpMax, hp, armHMax: 20, armH: Math.round(20 * arm), armBMax: 80, armB: Math.round(80 * arm) })),
    { day: (typeof DAY !== 'undefined' && DAY ? DAY.day : 0) | 0 });
  const a = C.company();
  return { men: a.men, hurt: a.hurt, done: a.done, lowest: a.lowest };
}
module.exports = { handAFight };
