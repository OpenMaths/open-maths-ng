module openmaths {
    'use strict';

    export class HomeController {
        name: string;
        changeName: (name: string) => void;

        constructor(private NotificationFactory: openmaths.NotificationFactory) {
            NotificationFactory.generate('Hello World!', 'info');

            this.name = 'Test';

            this.changeName = (name) => {
                this.name = name;
            };
        }
    }

    angular
        .module('openmaths')
        .controller('HomeController', HomeController);
}