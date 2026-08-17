/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('MasteringSleepBomb', {
	niceName: 'Mastering Sleep Bomb',
	author: 'Random595',
	description: 'Discover the full potential of Sleep Bomb, the best talent in the game.',
	lessonList: [

		{
		name: 'Smoke And Shadows',
		text: 'Why put one to sleep when you can vanish from them all?',
		hintText: 'Sleep Bomb can be used to block Line of Sight, preventing enemy attacks.',
		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('ShortBow');
			debug.learnTalent('SleepBomb');

			SchoolLessons.setEnemyHp(1, 1);
			SchoolLessons.setEnemyHp(2, 1);
			SchoolLessons.setEnemyHp(3, 1);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'A Perfect Opportunity',
		text: 'One weakness is good, but two are better. Make your strike count!',
		hintText: 'Sleeping and unstable give critical hits with physical damage, and crits from different sources can stack. By stacking two crits, you can kill these enemies in one hit.',
		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('WoodenSword');
			debug.learnTalent('SleepBomb', 'Long');

			SchoolLessons.setEnemyHp(1, 9);
			SchoolLessons.setEnemyHp(2, 9);
			SchoolLessons.setEnemyHp(3, 9);
			debug.agroAllNPCs();

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
		name: 'Perma Sleep',
		text: 'Take your time, they won\'t be going anywhere.',
		hintText: 'Wait for your cooldowns to reset before attacking. Use knockback to prevent enemy actions while you deal damage. Immediately sleep the enemy again and repeat.',
		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('WoodenSword');
			debug.learnTalent('SleepBomb', 'Long');
			debug.learnTalent('PowerStrike');
			gs.pc.baseAttributes = {strength: 10, dexterity: 11, intelligence: 16}
			
			SchoolLessons.setEnemyHp(1, 45);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Smoke Shield',
		text: 'Smoke and clouds don\'t mix.',
		hintText: 'Sleep Bomb blocks cloud attacks. Place your sleep bomb before the enemy attacks, to protect yourself from the cloud.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('ShortBow');
			debug.learnTalent('SleepBomb');

			SchoolLessons.setEnemyHp(1, 10);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Obscured Intent',
		text: 'The path to victory is hidden in the smoke.',
		hintText: 'Breaking line of sight removes most mental effects. The description of an effect will state if it is cancelled by breaking vision.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('WoodenSword');
			debug.learnTalent('SleepBomb');

			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			// Goblet is the win condition
			return false;
		},
	},

	{
		name: 'Calm The Grip',
		text: 'Calm in the chaos may shift the balance.',
		hintText: 'Sleeping enemies will release constricting effects.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('SleepBomb', 'Long');
			gs.pc.baseAttributes = {strength: 10, dexterity: 9, intelligence: 10}
			gs.pc.abilities.list[0].coolDown = 1;

			SchoolLessons.setEnemyHp(1, 25);
			SchoolLessons.setEnemyHp(2, 12);
			SchoolLessons.setEnemyHp(3, 12);
			SchoolLessons.removeEnemyAbility(1, 0);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Taming The Fury',
		text: 'Fury has a way of fading in stillness.',
		hintText: 'Sleep cancels berserk effects. Wait for the enemy to berserk before using sleep bomb.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('SleepBomb');
			gs.pc.baseAttributes = {strength: 10, dexterity: 9, intelligence: 10}

			SchoolLessons.setEnemyHp(1, 10);
			SchoolLessons.setEnemyHp(2, 22);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 18;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Passage Of No Escape',
		text: 'Sometimes, a peaceful barrier is all you need.',
		hintText: 'Use sleep bomb to block the corridor with a sleeping enemy, and shoot the rest with perfect aim.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('SleepBomb', 'Long');
			gs.pc.baseAttributes = {strength: 10, dexterity: 9, intelligence: 16}

			SchoolLessons.setEnemyHp(1, 8);
			SchoolLessons.setEnemyHp(2, 8);
			SchoolLessons.setEnemyHp(3, 8);
			SchoolLessons.setEnemyHp(4, 8);
			SchoolLessons.setEnemyHp(5, 8);
			debug.agroAllNPCs();	
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

]});