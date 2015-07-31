module openmaths {
    'use strict';

    let hideNotificationAfter: number = 4500;
    //let allowedTypes: Array<string> = ['info', 'warning', 'error', 'success'];

    export enum NotificationType {
        Info, Warning, Error, Success
    }

    export interface INotificationData {
        message: string;
        type: string;
    }

    export class NotificationFactory {
        subscriptions: Array<Function> = [];

        subscribe(callback: Function) {
            this.subscriptions.push(callback);
        }

        generate(message: string, notificationType: NotificationType, stackTrace?: any) {
            let type: string;

            switch (notificationType) {
                case NotificationType.Success:
                    type = 'success';
                    break;
                case NotificationType.Warning:
                    type = 'warning';
                    break;
                case NotificationType.Error:
                    type = 'error';
                    break;
                //case NotificationType.Info:
                //    type = 'info';
                //    break;
                default:
                    type = 'info';
                    break;
            }

            let notificationData: INotificationData = {
                message: message,
                type: type
            };

            if (stackTrace) openmaths.Logger.info(stackTrace);

            _.forEach(this.subscriptions, callback => {
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

    export class NotificationDirective implements ng.IDirective {
        link;
        restrict = 'E';
        replace = true;
        scope = {};
        templateUrl = 'app/_shared/Notification/notification.html';

        constructor(private $timeout: ng.ITimeoutService,
                    private NotificationFactory: openmaths.NotificationFactory) {
            this.link = (scope: INotificationDirectiveScope) => {
                NotificationFactory.subscribe((notificationData: INotificationData) => {
                    scope.notification = notificationData;
                    scope.act = true;

                    $timeout(() => {
                        scope.act = false;
                    }, hideNotificationAfter);
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return ($timeout: ng.ITimeoutService, NotificationFactory: openmaths.NotificationFactory) =>
                new NotificationDirective($timeout, NotificationFactory);
        }
    }

    angular
        .module('openmaths')
        .directive('notification', NotificationDirective.init());
}