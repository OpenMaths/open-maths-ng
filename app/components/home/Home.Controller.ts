module openmaths {
    'use strict';

    export class HomeController {
        name: string;
        changeName: (name: string) => void;

        constructor(private NotificationFactory: openmaths.NotificationFactory) {
            NotificationFactory.generate('Hello World!', NotificationType.Info);

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