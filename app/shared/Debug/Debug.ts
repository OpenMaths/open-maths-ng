module openmaths {
    'use strict';

    export class Debug {
        public static getHost(): string {
            return window.location.host;
        }

        public static getHostName(): string {
            return window.location.hostname;
        }

        public static getEnvironment(givenHost?: string): string {
            let host = givenHost ? givenHost : openmaths.Debug.getHost();

            switch (host) {
                // @TODO
                // Abstract into cofig
                case 'openmaths.io':
                    return 'production';
                // @TODO
                // Abstract into cofig
                case 'localhost:3100':
                    return 'test';
                default:
                    return 'development';
            }
        }
    }
}