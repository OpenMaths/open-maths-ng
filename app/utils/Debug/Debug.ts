module openmaths {
    'use strict';

    export class Debug {
        static getHost(): string {
            return window.location.host;
        }

        static getHostName(): string {
            return window.location.hostname;
        }

        static getEnvironment(givenHost?: string): string {
            let host = givenHost ? givenHost : openmaths.Debug.getHost();

            switch (host) {
                case Config.getProductionHost():
                    return 'production';
                    break;
                case Config.getTestHost():
                    return 'test';
                    break;
                default:
                    return 'development';
                    break;
            }
        }
    }
}