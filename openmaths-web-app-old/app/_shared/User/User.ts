module openmaths {
    'use strict';

    export class Auth {
        accessToken:string;
        gPlusId:string;

        constructor(accessToken:string, gPlusId:string) {
            this.accessToken = accessToken ? accessToken : null;
            this.gPlusId = gPlusId ? gPlusId : null;
        }
    }

    export class User {
        accessToken:string;
        email:string;
        firstName:string;
        gPlusId:string;
        name:string;
        picture:string;
        surname:string;
        verified:boolean;

        constructor(accessToken:string, userInfo?:IGApiUserInfoResponse) {
            this.accessToken = accessToken;
            this.email = userInfo ? userInfo.email : undefined;
            this.firstName = userInfo ? userInfo.given_name : undefined;
            this.gPlusId = userInfo ? userInfo.id : undefined;
            this.name = userInfo ? userInfo.name : undefined;
            this.picture = userInfo ? userInfo.picture : undefined;
            this.surname = userInfo ? userInfo.family_name : undefined;
            this.verified = userInfo ? userInfo.verified_email : undefined;

            let self = this;

            // @TODO 'omUser' string should be in a static config
            openmaths.SessionStorage.set('omUser', self);
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

        isSignedIn():boolean {
            return !_.isUndefined(this.accessToken) && !_.isUndefined(this.gPlusId);
        }

        // @TODO Needs to know if this is a false?
        static getData():openmaths.User {
            let sessionData = openmaths.SessionStorage.get('omUser');

            let User = new openmaths.User(sessionData.accessToken);

            User.email = sessionData.email;
            User.firstName = sessionData.firstName;
            User.gPlusId = sessionData.gPlusId;
            User.name = sessionData.name;
            User.picture = sessionData.picture;
            User.surname = sessionData.surname;
            User.verified = sessionData.verified;

            openmaths.SessionStorage.set('omUser', User);

            return User;
        }

        static getAuthData():openmaths.Auth {
            let userData = openmaths.User.getData();

            return new Auth(userData.accessToken, userData.gPlusId);
        }

        static isSignedIn():boolean {
            let auth = User.getAuthData();

            return !_.isNull(auth.accessToken) && !_.isNull(auth.gPlusId);
        }
    }
}