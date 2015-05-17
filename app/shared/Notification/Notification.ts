/// <reference path='../../_ref.ts' />

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

    export class NotificationD {
        public restrict = 'E';
        public templateUrl = 'app/shared/Notification/Template.html';
        public scope = {};
        public replace = true;
        public link;

        constructor($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) {
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

        public static directive() {
            return ($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) => {
                return new NotificationD($timeout, NotificationFactory);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('notification', NotificationD.directive());
}