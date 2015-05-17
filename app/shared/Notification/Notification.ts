module openmaths {
    'use strict';

    export interface INotificationData {
        message: string;
        type: string;
        trace: boolean;
    }

    export class NotificationFactory {
        // @TODO
        // should this be private?
        public subscriptions = [];

        subscribe(callback: any) {
            this.subscriptions.push(callback);
        }

        generate(message: string, type: string, stackTrace?: any) {
            var notificationData: INotificationData = {
                message: message,
                type: type,
                trace: stackTrace ? stackTrace : false
            };

            _.forEach(this.subscriptions, function (callback) {
                callback(notificationData);
            });
        }
    }

    angular
        .module('openmaths')
        .service('NotificationFactory', NotificationFactory);

    export interface INotificationDirectiveScope extends ng.IScope {
        notification: INotificationData;
        act: boolean;
    }

    export class NotificationDirective {
        public restrict = 'E';
        public templateUrl = 'app/shared/Notification/Template.html';
        public scope = {};
        public replace = true;
        public link;

        constructor($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) {
            // @TODO
            // get rid of the log later, this is merely for testing
            console.log('construct NotificationD');

            this.link = (scope: INotificationDirectiveScope) => {
                NotificationFactory.subscribe(function (notificationData) {
                    scope.notification = notificationData;
                    scope.act = true;

                    $timeout(function () {
                        scope.act = false;
                    }, 2500);
                });
            };
        }

        public static init() {
            return ($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) => {
                return new NotificationDirective($timeout, NotificationFactory);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('notification', NotificationDirective.init());
}