module openmaths {
    'use strict';

    export interface IGApiAuthResult {
        access_token: string;
        code: string;
        error: any; // @TODO investigate
        status: {
            google_logged_in: boolean;
            method: string;
            signed_in: boolean;
        };
    }

    //declare var gapi;

    export class Authentication {
        static gApiLogin() {
            // @TODO
            // when I've got time to faff around with mocking gapi, I will refactor this
            if (openmaths.Debug.getEnvironment() == 'test') {
                return false;
            }

            gapi.auth.signIn({
                callback: (authResult: IGApiAuthResult) => {
                    openmaths.Authentication.login(authResult, () => {
                        console.log('callback ok');
                    });
                }
            });
        }

        static login(gApiAuthResult: IGApiAuthResult, callback) {
            // @TODO
            // Think about gapi error handling here
            console.log(gApiAuthResult);
            callback();
        }

        static googleApiPromise(token: {access_token: string}, Api: openmaths.Api) {
            return Api.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token.access_token, true);
        }
    }
}