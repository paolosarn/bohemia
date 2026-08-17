/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('WitsAndWarfare', {
	niceName: 'Wits and Warfare',
	author: 'Random595',
	description: 'Play smarter, not harder. Use your wits to sharpen your warfare, and master battlefield tactics.',
	lessonList: [

		{
		name: 'The Edge Of Safety',
		text: 'The key to survival might be just out of their reach.',
		hintText: 'If you outrange the enemy, you can hit them without taking return fire. Use SP to maintain distance and shoot the enemy from out of their range.',	
		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('ShortBow');
			debug.learnTalent('RangeMastery');
			SchoolLessons.setEnemyHp(1, 18);
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 5;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{ 
		name: 'The Turning Point',
		text: 'Sometimes, a shift in position can shift the odds.',
		hintText: 'Turrets can only fire in one direction at a time. Approach by zigzagging between sides (colors), forcing the turret to turn. When close, use SP to change sides and get a free hit.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('Mace');
			
			SchoolLessons.setEnemyHp(1, 20);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
			debug.agroAllNPCs();
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Savor The Struggle',
		text: 'A meal is worth more when the fight is fierce.',
		hintText: 'Eating food restores 50% of HP, MP and SP. Use this in the middle of a fight to gain an advantage.',

		playerClass: 'StormMage',
		onStartGame: function () {
			debug.addItem('Meat');
			debug.learnTalent('LightningBolt');
			debug.addEquipment('RingOfPower');
			debug.addEquipment('Robe', {mod: 1});
			debug.addEquipment('ClothGloves', {mod: 1});
			debug.addEquipment('Hat', {mod: 1});
			debug.addEquipment('Shoes', {mod: 1});
			gs.pc.currentFood = 0
			gs.pc.baseAttributes = {strength: 8, dexterity: 10, intelligence: 10}	
			gs.pc.statusEffects.add("Draining", {duration: 1000})
			
			SchoolLessons.setEnemyHp(1, 10);
			SchoolLessons.setEnemyHp(2, 10);
			SchoolLessons.setEnemyHp(3, 10);
			
		},
		updateStats: function () {
			gs.pc.maxHp = 18;
			gs.pc.maxSp = 2;
			gs.pc.maxMp = 8;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},	
	
	{
		name: 'Sever The Source',
		text: 'An endless fight can end if you change your target.',
		hintText: 'Avoid fighting through buffs. Destroy the source of the buff, the totem, to make the fight easier.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('Mace');
			gs.pc.baseAttributes = {strength: 9, dexterity: 10, intelligence: 10}

			SchoolLessons.removeEnemyAbility(1, 0);	
			SchoolLessons.removeEnemyAbility(1, 1);
			SchoolLessons.setEnemyHp(1, 50);
			
			SchoolLessons.setEnemyHp(2, 50);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 100;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Restless Remains',
		text: 'The ground beneath your feet holds the key to their return.',
		hintText: 'Destroy skelly bodies with terrain to prevent resurrection.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('WarHammer');
			debug.addEquipment('RingOfSlaying');
			
			SchoolLessons.removeEnemyAbility(1, 0);
			SchoolLessons.removeEnemyAbility(1, 1);
			SchoolLessons.setEnemyHp(1, 10);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 80;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
			if(gs.liveCharacterList().length > 2) {
			SchoolLessons.removeEnemyAbility(2, 1);
			}
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Restless Remains Two',
		text: 'A firm stance can keep the dead at rest.',
		hintText: 'Standing on a skeleton will prevent resurrection.',

		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('ShortBow');

			SchoolLessons.removeEnemyAbility(1, 0);
			SchoolLessons.removeEnemyAbility(1, 1);
			SchoolLessons.setEnemyHp(1, 10);
			
			debug.agroAllNPCs();

		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 2;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'Shroom Sabotage',
		text: 'Not all gifts are meant to be shared.',
		hintText: 'You can destroy shrooms by shooting them.',

		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			
			SchoolLessons.setEnemyHp(1, 15);
			SchoolLessons.removeEnemyAbility(1, 1);
			SchoolLessons.removeEnemyAbility(1, 2);
			debug.agroAllNPCs();

		},
		updateStats: function () {
			gs.pc.maxHp = 30;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

]});