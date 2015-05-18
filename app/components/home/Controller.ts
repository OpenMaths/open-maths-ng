module openmaths {
    'use strict';

    export interface HomeControllerScope extends ng.IScope {
        name: string;
        changeName(name: string): void;
    }

    export class HomeController {
        constructor(private $scope: HomeControllerScope,
                    private Api: openmaths.Api,
                    private NotificationFactory: openmaths.NotificationFactory) {
            NotificationFactory.generate('Hello World!', 'info');

            $scope.name = 'Test';

            $scope.changeName = (name) => {
                $scope.name = name;
            };

            Rx.Observable.fromPromise(Api.get('search/a'))
                .map((d) => {
                    let omResponse = openmaths.Api.response(d);

                    console.debug('omResponse on thread 1');
                    console.info(omResponse);

                    return Rx.Observable.fromPromise(Api.get('https://api.github.com/users/slavomirvojacek/repos', true))
                        .map((d) => {
                            let ghResponse = openmaths.Api.response(d, true);

                            console.debug('ghResponse on thread 2');
                            console.info(ghResponse);

                            return ghResponse.data;
                        })
                        .where((data) => {
                            return data.length > 0;
                        });
                })
                .switch()
                .retry(3)
                .subscribe((d) => {
                    console.debug('Response on thread 3');
                    console.log(d);
                });
        }
    }

    angular
        .module('openmaths')
        .controller('HomeController', HomeController);
}