module openmaths.specs {
    'use strict';

    describe('HomeController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.HomeController;

        let Api: openmaths.Api;
        let NotificationFactory: openmaths.NotificationFactory;

        beforeEach(inject((_Api_: openmaths.Api,
                           _NotificationFactory_: openmaths.NotificationFactory) => {
            Api = _Api_;
            NotificationFactory = _NotificationFactory_;

            controller = new openmaths.HomeController(NotificationFactory, Api);
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