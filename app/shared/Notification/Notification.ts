module openmaths {
    'use strict';

    let hideNotificationAfter: number = 2500;
    let allowedTypes: Array<string> = ['info', 'warning', 'error', 'success'];

    export interface INotificationData {
        message: string;
        type: string;
        trace: boolean;
    }

    export class NotificationFactory {
        subscriptions = [];

        subscribe(callback: any) {
            this.subscriptions.push(callback);
        }

        generate(message: string, type: string, stackTrace?: any) {
            let notificationData: INotificationData = {
                message: message,
                type: _.contains(allowedTypes, type) ? type : _.first(allowedTypes),
                trace: stackTrace ? stackTrace : false
            };

            _.forEach(this.subscriptions, (callback) => {
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
        restrict = 'E';
        templateUrl = 'app/shared/Notification/notification.html';
        scope = {};
        replace = true;
        link;

        constructor(private $timeout: ng.ITimeoutService,
                    private NotificationFactory: openmaths.NotificationFactory) {
            this.link = (scope: INotificationDirectiveScope) => {
                NotificationFactory.subscribe((notificationData) => {
                    scope.notification = notificationData;
                    scope.act = true;

                    $timeout(() => {
                        scope.act = false;
                    }, hideNotificationAfter);
                });
            };
        }

        static init() {
            return ($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) => {
                return new NotificationDirective($timeout, NotificationFactory);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('notification', NotificationDirective.init());
}