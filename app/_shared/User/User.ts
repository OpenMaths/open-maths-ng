module openmaths {
    'use strict';

    export class Auth {
        accessToken: string;
        gPlusId: string;

        constructor(accessToken: string, gPlusId: string) {
            this.accessToken = accessToken;
            this.gPlusId = gPlusId;
        }
    }

    export class User {
        accessToken: string;
        email: string;
        firstName: string;
        gPlusId: string;
        name: string;
        picture: string;
        surname: string;
        verified: boolean;

        constructor(gApiAuthResponse: IGApiAuthResponse, userInfo: IGApiUserInfoResponse) {
            this.accessToken = gApiAuthResponse.access_token;
            this.email = userInfo.email;
            this.firstName = userInfo.given_name;
            this.gPlusId = userInfo.id;
            this.name = userInfo.name;
            this.picture = userInfo.picture;
            // @TODO test
            this.surname = userInfo.family_name;
            this.verified = userInfo.verified_email;

            openmaths.SessionStorage.set('omUser', this);
        }

        signOut() {
            this.accessToken = undefined;
            this.email = undefined;
            this.firstName = undefined;
            this.gPlusId = undefined;
            this.name = undefined;
            this.picture = undefined;
            this.surname = undefined;
            this.verified = undefined;

            openmaths.SessionStorage.remove('omUser');
        }

        static getData(): openmaths.User {
            return openmaths.SessionStorage.get('omUser');
        }

        static getAuthData(): openmaths.Auth {
            let userData = openmaths.SessionStorage.get('omUser');

            return new Auth(userData.accessToken, userData.gPlusId);
        }
    }
}