/*global gs, SchoolLessons, debug*/
'use strict';


SchoolLessons.loadCustomCourse('Tutorial', {
	niceName: 'Tutorial',
	author: 'Justin Wang',
	description: 'Basic tutorial covering controls and core mechanics.',
	lessonList: [
		// MOVE_AND_ATTACK:
		// ********************************************************************************************
		{
			name: 'MoveAndAttack',
			text: [
				'*Left click an open tile to move.\n\n',
				'*Left click an enemy to melee attack.\n\n',
				'*Right click on an enemy to range attack.\n\n',

			].join(''),
			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.addEquipment('ShortBow');

				SchoolLessons.setEnemyHp(1, 10);
				SchoolLessons.setEnemyHp(2, 10);

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 10;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// AUTO_ATTACK:
		// ********************************************************************************************
		{
			name: 'AutoAttack',
			text: [
				'*Tab key to auto melee attack.\n\n',
				'*Q key to auto range attack.\n\n',

			].join(''),
			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.addEquipment('ShortBow');

				for (let i = 1; i < 11; i += 1) {
					SchoolLessons.setEnemyHp(i, 1);
				}

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 10;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// SPRINT_AND_MELEE:
		// ********************************************************************************************
		{
			name: 'SprintAndMelee',
			text: [
				'*Hold Shift and Left click an open tile to sprint without ending your turn.\n\n',
				'*Use this to quickly close distance with enemies.\n\n',

			].join(''),
			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');

				SchoolLessons.setEnemyHp(1, 1);

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 3;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// SPRINT_AND_RANGE:
		// ********************************************************************************************
		{
			name: 'SprintAndRange',
			text: [
				'*Hold Shift and Left click an open tile to sprint without ending your turn.\n\n',
				'*Use this to quickly create distance with enemies\n\n',

			].join(''),
			playerClass: 'Ranger',

			onStartGame: function () {
				debug.addEquipment('ShortBow');

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 4;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// ABILITY_USE:
		// ********************************************************************************************
		{
			name: 'AbilityUse',
			text: [
				'*To select an ability left click on the icon in the bottom right or use the 1-7 keys.\n\n',
				'*Left click again on a target to use the ability.',

			].join(''),
			playerClass: 'Ranger',

			onStartGame: function () {
				debug.addEquipment('ShortBow');
				debug.learnTalent('PowerShot');

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// UNSTABLE_TERRAIN:
		// ********************************************************************************************
		{
			name: 'UnstableTerrain',
			text: [
				'*Some terrain is unstable and will cause characters to take 50% more damage from physical attacks.\n\n',
				'*Try to avoid standing on unstable terrain while leading your enemies onto it.',

			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');

				SchoolLessons.setEnemyHp(1, 45);

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 8;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// WAITING:
		// ********************************************************************************************
		{
			name: 'Waiting',
			text: [
				'*Press the space key or click your character to wait a turn.\n\n',
				'*It is often best to wait for enemies to move into range rather than moving towards them.',

			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');

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
			}
		},

		// CONSUMABLES:
		// ********************************************************************************************
		{
			name: 'Consumables',
			text: [
				'*Left click a consumable in the bottom right of your screen to use it.\n\n',
				'*Its better to use consumables early rather than die with a full inventory.',

			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.addItem('PotionOfHealing');

				gs.pc.currentHp = 1;

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 20;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// MUSHROOMS:
		// ********************************************************************************************
		{
			name: 'Mushrooms',
			text: [
				'*Purple Energy Shrooms will restore your speed and mana points and reset all ability cool downs.\n\n',
				'*Green Healing Shrooms will restore your health points and cure you of physical ailments.',

			].join(''),

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.learnTalent('PowerStrike');

				gs.pc.currentHp = 1;
				gs.pc.currentSp = 0;
				gs.pc.abilities.list[0].coolDown = 6;

				debug.agroAllNPCs();
			},

			updateStats: function () {
				gs.pc.maxHp = 10;
				gs.pc.maxSp = 5;
				gs.pc.maxMp = 0;	
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},

		// AUTO_EXPLORE:
		// ********************************************************************************************
		{
			name: 'AutoExplore',
			text: [
				'*Press the E key to quickly auto explore a level.\n\n',
				'*Click your mini map to quickly move to any explored tile.',

			].join(''),
			mapExplored: false,

			playerClass: 'Warrior',

			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.learnTalent('PowerStrike');
			},

			updateStats: function () {
				gs.pc.maxHp = 20;
			},

			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		},
	]
});