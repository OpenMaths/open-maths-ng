module openmaths {
    'use strict';

    export class Authentication {
        static login() {
        }

        static googleApiPromise(token: {access_token: string}, Api: openmaths.Api) {
            return Api.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token.access_token, true);
        }
    }
}