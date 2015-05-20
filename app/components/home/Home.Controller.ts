module openmaths {
    'use strict';

    export class HomeController {
        name: string;
        changeName: (name: string) => void;

        ApiS: openmaths.Api;

        constructor(private NotificationFactory: openmaths.NotificationFactory, private Api: openmaths.Api) {
            NotificationFactory.generate('Hello World!', 'info');

            this.name = 'Test';

            this.changeName = (name) => {
                this.name = name;
            };

            this.ApiS = Api;

            let promise = this.ApiS.get('https://api.github.com/users/slavomirvojacek/repos', true);

            //Rx.Observable.fromPromise(promise)
            //    .subscribe((d) => {
            //        openmaths.Api.response(d);
            //    });
        }
    }

    angular
        .module('openmaths')
        .controller('HomeController', HomeController);
}