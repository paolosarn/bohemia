/*global gs, SchoolLessons, debug*/
'use strict';


SchoolLessons.loadCustomCourse('AdvancedTactics', {
	niceName: 'Advanced Tactics',
	author: 'Justin Wang',
	description: 'A variety of lessons covering advanced tactics and obscure game mechanics.',
	lessonList: [
		// SPRINT_KITING:
		// ********************************************************************************************
		{
			name: 'SprintKiting',
			text: [
				'*Your base regeneration rate of speed points is 1SP every 5 Turns.\n\n',
				'*Even a single speed point is enough to kite enemies almost indefinitely.\n\n'
			].join(''),

			playerClass: 'Ranger',

			onStartGame: function () {
				debug.addEquipment('ShortBow');
				debug.agroAllNPCs();
				SchoolLessons.setEnemyHp(1, 20);
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

		// KITING_COOL_DOWNS:
		// ********************************************************************************************
		{
			name: 'KitingCoolDowns',
			text: [
				'*You will often need to kite enemies around a level to let your abilities recharge.\n\n',
				'*Remember to use your speed points!'
			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.learnTalent('PowerStrike');

				SchoolLessons.setEnemyHp(1, 12);
				SchoolLessons.setEnemyHp(2, 12);

				debug.agroAllNPCs();
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		// LINE_OF_SIGHT:
		// ********************************************************************************************
		{
			name: 'LineOfSight',
			text: [
				'*Breaking line of sight forces enemies to come to you!\n\n',
				'*Remember to use your speed points!\n\n',
				'*Remember to wait!'
			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');

				SchoolLessons.setEnemyHp(1, 1);

				debug.agroAllNPCs();
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 2;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		// CHOKE_POINTS:
		// ********************************************************************************************
		{
			name: 'ChokePoints',
			text: [
				'*Use corridors and choke points to force enemies to engage you one by one.\n\n',
				'*You can also use this to line up AOE abilities.'
			].join(''),

			playerClass: 'StormMage',

			onStartGame: function () {
				debug.learnTalent('LightningBolt');

				SchoolLessons.setEnemyHp(1, 6);
				SchoolLessons.setEnemyHp(2, 6);
				SchoolLessons.setEnemyHp(3, 6);
				SchoolLessons.setEnemyHp(4, 6);

				debug.agroAllNPCs();
			},
			updateStats: function () {
				gs.pc.maxHp = 10;
				gs.pc.maxSp = 1;
				gs.pc.maxMp = 4;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		// DIAGONAL_KITING:
		// ********************************************************************************************
		{
			name: 'DiagonalKiting',
			text: [
				'*Slow enemies can only move orthogonally.\n\n',
				'*You can use diagonal movement to create distance.'
			].join(''),

			playerClass: 'Ranger',

			onStartGame: function () {
				debug.addEquipment('ShortBow');

				SchoolLessons.setEnemyHp(1, 18);
				SchoolLessons.removeEnemyAbility(1, 1);
				SchoolLessons.removeEnemyAbility(1, 2);

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

		// TRAP_KITING:
		// ********************************************************************************************
		{
			name: 'TrapKiting',
			text: [
				'*You can use your movement to kite enemies through traps.\n\n',
				'*Remember to use your speed points!'
			].join(''),

			playerClass: 'Ranger',

			onStartGame: function () {
				SchoolLessons.setEnemyHp(1, 24);

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

		// PIT_KNOCK_BACK:
		// ********************************************************************************************
		{
			name: 'PitKnockBack',
			text: [
				'*Knocking an enemy into a pit will instantly kill it.\n\n',
				'*Use this to deal with high HP tanks.'
			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.learnTalent('PowerStrike');

				SchoolLessons.removeEnemyAbility(1, 1);
				SchoolLessons.removeEnemyAbility(1, 2);
				SchoolLessons.setEnemyHp(1, 100);

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

		// AGRO_RANGE:
		// ********************************************************************************************
		{
			name: 'AgroRange',
			text: [
				'*An unaware enemy with ? above his head will never spot you.\n\n',
				'*An unaware enemy with ??? above his head has a chance to spot you.\n\n',
				'*An enemy can never spot you while you are sprinting.'
			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {

			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 3;
				gs.pc.maxMp = 0;
			},
			isComplete: function () {
				// Goblet is the win condition
				return false;
			},
		},

		// SPLIT_PULLING:
		// ********************************************************************************************
		{
			name: 'SplitPulling',
			text: [
				'*Enemies will not respond to the shouts of their friends if you are more than 10 tiles away.\n\n',
				'*You can use this to break up groups of monsters by agroing a single enemy at max range.\n\n'
			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
			},

			updateStats: function () {
				gs.pc.maxHp = 20;
				gs.pc.maxSp = 3;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},

			hasFailed: function () {
				return gs.agroedHostileList().length > 1;
			},
		},

		// TARGET_PRIORITY:
		// ********************************************************************************************
		{
			name: 'TargetPriority',
			text: [
				'*You will often need to prioritise targets in the enemy back line.\n\n',
				'*Use speed points to get a clear line of sight and abilities to burst them down.\n\n',
			].join(''),

			playerClass: 'Ranger',

			onStartGame: function () {
				debug.addEquipment('ShortBow');
				debug.learnTalent('PowerShot');
				debug.agroAllNPCs();
				SchoolLessons.removeEnemyAbility(1, 0);

				// No Cool-Down on heal:
				gs.characterList[1].abilities.list[1].type.coolDown = 0;
				
				SchoolLessons.setEnemyHp(1, 14);
				SchoolLessons.setEnemyHp(2, 16);
				
			},
			updateStats: function () {
				gs.pc.maxHp = 20;
				gs.pc.maxSp = 3;
				gs.pc.maxMp = 0;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},
	]
});