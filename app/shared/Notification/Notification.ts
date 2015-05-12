/// <reference path='../../_ref.ts' />

module openmaths {
    'use strict';

    export interface INotificationData {
        message: string;
        type: string;
        trace: boolean;
    }

    export class NotificationFactory {
        subscriptions = [];

        constructor() {
            console.debug('NotificationFactory constructed');
        }

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

    export interface NotificationDirectiveScope extends ng.IScope {
        notification: any; // Revisit
        act: boolean;
    }

    export function NotificationDirective($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory): ng.IDirective {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/Notification/template.html',
            scope: {},
            replace: true,
            link: (scope: NotificationDirectiveScope) => {
                NotificationFactory.subscribe(function (notificationData) {
                    scope.notification = notificationData;
                    scope.act = true;

                    $timeout(function () {
                        scope.act = false;
                    }, 2500);
                });
            }
        };
    }

    angular
        .module('openmaths')
        .directive('notification', NotificationDirective);
}