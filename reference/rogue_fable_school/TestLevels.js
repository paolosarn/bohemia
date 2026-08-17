/*global gs, SchoolLessons, debug, levelPopulator, util*/
'use strict';

let TEMPLATE_LEVEL = {
	name: 'BossLevel',
	niceName: 'Boss Level',
	mapExplored: false,
	text: [
		'*Testing a boss level.\n\n',
	].join(''),

	playerList: [
		'Warrior',
		'Barbarian',
		'Ranger',
		'FireMage',
		'StormMage',
	],

	dangerLevel: 13,
	onStartGame: function () {
		debug.agroNearbyNPCs();
		gs.exploreMap();
	},
	updateStats: function () {

	},
	isComplete: function () {
		return false;
	}
};

SchoolLessons.loadCustomCourse('TestLevels', {
	niceName: 'Test Levels',
	author: 'Justin Wang',
	description: 'I will be using this course to allow convenient testing of new content or mechanics.',
	
	lessonList: [
		// THE_SOUL_WARDEN:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'TheSoulWarden', 
			niceName: 'The Soul Warden',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
		// CLOCKWORK_CONTROLLER:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'ClockworkController', 
			niceName: 'Clockwork Controller',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
		// CLOCKWORK_ORGAN:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'ClockworkOrgan', 
			niceName: 'Clockwork Organ',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
		// R-DOM-595:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'RDom595', 
			niceName: 'R-Dominator 595',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
		// R-DOM-596:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'RDom596', 
			niceName: 'R-Dominator 596',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
		// R-DOM-597:
		Object.assign(Object.create(TEMPLATE_LEVEL), {
			name: 'RDom597', 
			niceName: 'R-Dominator 597',
			mapExplored: true,
			onStartGame: function () {
				debug.agroNearbyNPCs();
			}
		}),
		
	],
});