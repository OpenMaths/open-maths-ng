module openmaths.specs {
	'use strict';

	describe('DiveController', () => {
		beforeEach(module('openmaths'));

		let controller: openmaths.DiveController;
		let $state;

		beforeEach(inject((_$state_: ng.ui.IStateProvider) => {
			$state = _$state_;

			controller = new openmaths.DiveController;
		}));

		it('should create a new controller', () => {
			expect(controller).toBeDefined();
		});

		it('should contain items array in its scope', () => {
			let items: Array<string> = controller.items;

			expect(items).toEqual(['Item 1', 'Item 2']);
		});
	});
}