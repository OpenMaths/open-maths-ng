module openmaths {
    'use strict';

    export class Logger {
        public static log(data: any) {
            if (openmaths.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.log(data);
        }

        public static info(data: any) {
            if (openmaths.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.info(data);
        }

        public static error(data: any) {
            if (openmaths.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.error(data);
        }

        public static debug(message: string) {
            if (openmaths.Debug.getEnvironment() !== 'development') {
                return false;
            }

            console.debug(message);
        }
    }
}