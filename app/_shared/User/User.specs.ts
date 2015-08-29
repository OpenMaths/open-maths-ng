module openmaths.specs {
    'use strict';

    let gApiAuthResponse: IGApiAuthResponse = {
        access_token: 'testToken',
        code: '',
        error: '',
        status: {
            google_logged_in: true,
            method: '',
            signed_in: true,
        }
    };

    let userInfo: IGApiUserInfoResponse = {
        email: 'test@email.com',
        family_name: 'Test Surname',
        gender: 'both',
        given_name: 'Test First Name',
        id: 'testId',
        link: '',
        locale: 'en',
        name: 'Test Name',
        picture: 'picAddress',
        verified_email: true
    };

    describe('User model', ()=> {
        afterEach(() => {
            openmaths.SessionStorage.remove('omUser');
        });

        it('should be able to sign user in', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            expect(User.accessToken).toEqual('testToken');
            expect(User.email).toEqual('test@email.com');
            expect(User.firstName).toEqual('Test First Name');
            expect(User.gPlusId).toEqual('testId');
            expect(User.name).toEqual('Test Name');
            expect(User.picture).toEqual('picAddress');
            expect(User.surname).toEqual('Test Surname');
            expect(User.verified).toEqual(true);
        });

        it('should save data into session storage upon sign in', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            let fromSessionStorage = openmaths.SessionStorage.get('omUser');

            expect(User.accessToken).toEqual(fromSessionStorage.accessToken);
            expect(User.email).toEqual(fromSessionStorage.email);
            expect(User.firstName).toEqual(fromSessionStorage.firstName);
            expect(User.gPlusId).toEqual(fromSessionStorage.gPlusId);
            expect(User.name).toEqual(fromSessionStorage.name);
            expect(User.picture).toEqual(fromSessionStorage.picture);
            expect(User.surname).toEqual(fromSessionStorage.surname);
            expect(User.verified).toEqual(fromSessionStorage.verified);
        });

        it('should be able to sign user out', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            expect(User.accessToken).toEqual('testToken');
            expect(User.gPlusId).toEqual('testId');

            User.signOut();

            expect(User.accessToken).toBeUndefined();
            expect(User.gPlusId).toBeUndefined();
        });

        it('should save data into session storage upon sign in', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            expect(User.accessToken).toEqual('testToken');
            expect(User.gPlusId).toEqual('testId');

            User.signOut();

            let fromSessionStorage = openmaths.SessionStorage.get('omUser');

            expect(fromSessionStorage.accessToken).toBeUndefined();
            expect(fromSessionStorage.gPlusId).toBeUndefined();
        });

        it('should be able to get information about a user if a user is signed in', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            expect(User.accessToken).toEqual('testToken');
            expect(User.gPlusId).toEqual('testId');

            let userData = openmaths.User.getData();

            expect(userData.accessToken).toEqual('testToken');
            expect(userData.email).toEqual('test@email.com');
            expect(userData.firstName).toEqual('Test First Name');
            expect(userData.gPlusId).toEqual('testId');
            expect(userData.name).toEqual('Test Name');
            expect(userData.picture).toEqual('picAddress');
            expect(userData.surname).toEqual('Test Surname');
            expect(userData.verified).toEqual(true);
        });

        it('should not be able to get information about a user if a user is not signed in', () => {
            let User = new openmaths.User(gApiAuthResponse, userInfo);

            expect(User.accessToken).toEqual('testToken');
            expect(User.gPlusId).toEqual('testId');

            User.signOut();

            let userData = openmaths.User.getData();

            expect(userData.accessToken).toBeUndefined();
            expect(userData.email).toBeUndefined();
            expect(userData.firstName).toBeUndefined();
            expect(userData.gPlusId).toBeUndefined();
            expect(userData.name).toBeUndefined();
            expect(userData.picture).toBeUndefined();
            expect(userData.surname).toBeUndefined();
            expect(userData.verified).toBeUndefined();
        });

        it('should be able to return a User Auth object given a user is signed in', () => {
            new openmaths.User(gApiAuthResponse, userInfo);

            expect(openmaths.User.getAuthData().accessToken).toEqual('testToken');
            expect(openmaths.User.getAuthData().gPlusId).toEqual('testId');
        });
    });
}