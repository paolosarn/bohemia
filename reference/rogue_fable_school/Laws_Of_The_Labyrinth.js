/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('Laws Of The Labyrinth', {
	niceName: 'Laws Of The Labyrinth',
	author: 'Random595',
	description: 'The dungeon follows its own set of rules, hidden in plain sight. Those who learn its patterns will find opportunity where others see only chaos.',
	lessonList: [

		{
		name: 'Randomized Impact',
		text: 'Most damage in the game ranges from 50-100% of the listed value. For example, a 20-damage weapon deals 10-20 damage. 10hp enemies are always one-shot, while most 20hp enemies need two hits.',
		hintText: 'Are you ok???',

		playerClass: 'Barbarian',
		onStartGame: function () {
			debug.addEquipment('WarHammer');
			gs.pc.baseAttributes = {strength: 16, dexterity: 10, intelligence: 10}
			
			for (let i = 1; i <= 5; i++) {
			SchoolLessons.setEnemyHp(i, 20);
			}
			
			for (let i = 6; i <= 10; i++) {
			SchoolLessons.setEnemyHp(i, 10);
			}			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 100;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Rhythm Of Speed',
		text: 'A well timed step can keep your momentum going.',
		hintText: 'Speed Points regenerate every 5th in game turn, not 5 turns after used. If you use a SP on turn 4, it immediately regenerates.',

		playerClass: 'Duelist',
		onStartGame: function () {
			
				debug.agroAllNPCs();
				
				SchoolLessons.removeEnemyAbility(1, 1);
				SchoolLessons.removeEnemyAbility(2, 1);
				SchoolLessons.removeEnemyAbility(2, 2);
				SchoolLessons.removeEnemyAbility(3, 1);
				SchoolLessons.removeEnemyAbility(3, 2);
				SchoolLessons.removeEnemyAbility(4, 1);
				
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
		name: 'The Gladiators Code',
		text: 'Welcome to the finest gladiator school on this side of the dungeon. Here, you will learn the basics of combat, starting with the order to attack.',
		hintText: 'Enemies will always attack left to right, top to bottom, closest first. This results in a hit order of: W, N, S, E, NW, SW, NE, SE.\n\nObserve the order the gladiators attack in, see how it is the same? The blood around the practice dummy also shows the pattern.',

		playerClass: 'Barbarian',
		onStartGame: function () {
			
			gs.pc.baseAttributes = {strength: 10, dexterity: 9, intelligence: 10}

			let group1 = [];
			for (let i = 1; i <= 18; i++) {
				if (i !== 8 && i !== 11) { // Skip 8 and 11
					group1.push(i);
				}
			}

			for (let enemy of group1) {
				SchoolLessons.setEnemyHp(enemy, 1);
				gs.getCharWithID(gs.nextCharacterID - 35 + enemy).faction = FACTION.PLAYER
				gs.getCharWithID(gs.nextCharacterID - 35 + enemy).isAgroed = true
			}
			
			let group2 = [8, 11, 20, 21, 23, 26, 29, 30, 31, 32];

			for (let enemy of group2) {
				SchoolLessons.setEnemyHp(enemy, 99999);
				SchoolLessons.removeEnemyAbility(enemy, 1);
			}
			
			let group3 = [19, 22, 24, 25, 27, 28, 33, 34];

			for (let enemy of group3) {
				SchoolLessons.setEnemyHp(enemy, 99999);
				gs.getCharWithID(gs.nextCharacterID - 35 + enemy).faction = FACTION.PLAYER
				gs.getCharWithID(gs.nextCharacterID - 35 + enemy).isAgroed = true
			}

			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxMp = 0;

		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Renewed Potential',
		text: 'The right moment can bring everything back.',
		hintText: 'Leveling up restores all Cooldowns. Investing a talent point restores the Cooldown. An amnesia potion can be used to forget a talent and refresh the cooldown twice.',
		allowExp: true,
		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('PowerShot');
			gs.pc.baseAttributes = {strength: 10, dexterity: 11, intelligence: 18}
			gs.pc.level = 2
			gs.pc.exp = 499
			debug.addItem('PotionOfAmnesia');
			
			SchoolLessons.setEnemyHp(1, 10);
			SchoolLessons.setEnemyHp(2, 10);
			SchoolLessons.setEnemyHp(3, 10);
			SchoolLessons.setEnemyHp(4, 10);
			SchoolLessons.setEnemyHp(5, 10);
			
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
		name: 'Static Standoff',
		text: 'An alert presence attracts greater focus.',
		hintText: 'Ambush walls trigger within a two tile radius, or a larger radius if there is an agro enemy. They only activate when you move, so by standing still you can prevent the second ambush wall from activating.',

		playerClass: 'StormMage',
		onStartGame: function () {
			debug.learnTalent('LightningBolt');
			gs.pc.baseAttributes = {strength: 10, dexterity: 10, intelligence: 19}
			
			SchoolLessons.setEnemyHp(1, 10);
			SchoolLessons.setEnemyHp(2, 10);
			SchoolLessons.setEnemyHp(3, 10);
			SchoolLessons.setEnemyHp(4, 10);
			
		},
		updateStats: function () {
			gs.pc.maxHp = 14;
			gs.pc.maxSp = 2;
			gs.pc.maxMp = 8;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Source Of Power',
		text: 'Experience isn\'t found in endless battles, but in what fuels them.',
		hintText: 'Spawned enemies give no xp. When a spawner dies by running out of spawns or hp, it gives equal experience. Use the level up from both spawners dying to kill remaining enemies.',
		allowExp: true,
		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			gs.pc.baseAttributes = {strength: 10, dexterity: 12, intelligence: 10}
			gs.pc.exp = 180
			gs.pc.currentHp = 1

			SchoolLessons.setEnemyHp(1, 200);
			SchoolLessons.setEnemyHp(2, 30);
			SchoolLessons.setEnemyHp(3, 1);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 50;
			gs.pc.maxSp = 2;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Pushed Back',
		text: 'Most ranged enemies have a 25% chance to retreat if the player is within three tiles.',
		hintText: 'Please, get some help!',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 1);
			SchoolLessons.setEnemyHp(2, 1);
			SchoolLessons.setEnemyHp(3, 999);
			SchoolLessons.setEnemyHp(4, 1);
			SchoolLessons.setEnemyHp(5, 1);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 999;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Floating Foundations',
		text: 'Weightless steps have their limits.\nDONT CLICK THE PIT TILES, USE NUMPAD TO MOVE. GRAPHICS SLIGHTY BROKEN.',
		hintText: 'When you start flying, a countdown equal to your levitation stat begins, displayed at the top left. When it runs out you will stop flying. A levitation pot gives 10 levitation for 200 turns, don\t confuse this with your flight time.',

		playerClass: 'StormMage',
		onStartGame: function () {
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			//return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Grounds For Trouble',
		text: 'Step wisely, lest the dead endure.',
		hintText: 'Cursed floor heals undead enemies. Do not let enemies fight on terrain advantageous for themselves.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('Mace');
			gs.pc.baseAttributes = {strength: 11, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 50);
			SchoolLessons.removeEnemyAbility(1, 1);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 60;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
		{
		name: 'Impeded Rush',
		text: 'The swiftest step falters when the ground gives way.',
		hintText: 'Liquids prevent sprinting, fast movement and movement abilities. Use your SP on land and hide behind the water to slow the approaching enemies.',

		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('RangeMastery');
			
			SchoolLessons.setEnemyHp(1, 26);
			SchoolLessons.setEnemyHp(2, 26);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 4;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
]});
