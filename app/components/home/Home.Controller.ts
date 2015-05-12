/// <reference path='../../_ref.ts' />

module openmaths {
    'use strict';

    export interface HomeControllerScope extends ng.IScope {
        name: string;
        changeName(name: string): void;
    }

    export class HomeController {
        constructor($scope: HomeControllerScope, Api: openmaths.Api, NotificationFactory: openmaths.NotificationFactory) {
            NotificationFactory.generate('Hello World!', 'info');

            $scope.name = 'Test';

            $scope.changeName = (name) => {
                $scope.name = name;
            };

            Rx.Observable.fromPromise(Api.get('search/a'))
                .map(function (d) {
                    var omResponse = openmaths.Api.response(d);

                    console.debug('omResponse on thread 1');
                    console.info(omResponse);

                    return Rx.Observable.fromPromise(Api.get('https://api.github.com/users/slavomirvojacek/repos', true))
                        .map(function (d) {
                            var ghResponse = openmaths.Api.response(d, true);

                            console.debug('ghResponse on thread 2');
                            console.info(ghResponse);

                            return ghResponse.data;
                        })
                        .where(function (data) {
                            return data.length > 0;
                        });
                })
                .switch()
                .retry(3)
                .subscribe(function (d) {
                    console.debug('Response on thread 3');
                    console.log(d);
                });
        }
    }

    angular
        .module('openmaths')
        .controller('HomeController', HomeController);
}