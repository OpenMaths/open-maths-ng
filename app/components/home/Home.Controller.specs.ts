module openmaths.specs {
    'use strict';

    describe('HomeController', () => {
        beforeEach(angular.mock.module('openmaths'));

        let controller: openmaths.HomeController;
        let NotificationFactory: openmaths.NotificationFactory;

        beforeEach(inject((_NotificationFactory_: openmaths.NotificationFactory) => {
            NotificationFactory = _NotificationFactory_;

            controller = new openmaths.HomeController(NotificationFactory);
        }));

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should contain name model with default value "Test" in its scope', () => {
            let name = controller.name;

            expect(name).toEqual('Test');
        });

        it('should contain changeName() model in its scope', () => {
            let changeName = controller.changeName;

            expect(changeName).toBeDefined();
        });
    });
}