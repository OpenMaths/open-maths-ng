module openmaths {
    'use strict';

    export class Logger {
        public static log(data: any) {
            console.log(data);
        }

        public static info(data: any) {
            console.info(data);
        }

        public static error(data: any) {
            console.error(data);
        }

        public static debug(message: string) {
            console.debug(message);
        }
    }

    angular
        .module('openmaths')
        .service('Logger', Logger);
}