module openmaths.specs {
    'use strict';

    let testData = {
        number: 1,
        boolean: true,
        string: 'Hello World',
        object: {value: 'Hello World'},
        array: ['Hello', 'World']
    };

    describe('SessionStorage', () => {
        afterEach(() => {
            window.sessionStorage.clear();
        });

        it('should have the set method', () => {
            expect(openmaths.SessionStorage.set).toBeDefined();
        });

        it('should set values into window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                let setSessionStorage = openmaths.SessionStorage.set(key, value);

                expect(setSessionStorage).toBe(true);
                expect(window.sessionStorage.getItem(key)).toEqual(JSON.stringify(value));
            });
        });

        it('should have the get method', () => {
            expect(openmaths.SessionStorage.get).toBeDefined();
        });

        it('should get values from window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                openmaths.SessionStorage.set(key, value);

                let getSessionStorage = openmaths.SessionStorage.get(key);

                expect(getSessionStorage).toEqual(value);
            });
        });

        it('should have the remove method', () => {
            expect(openmaths.SessionStorage.remove).toBeDefined();
        });

        it('should remove values from window.sessionStorage', () => {
            _.forEach(testData, (value, key) => {
                openmaths.SessionStorage.set(key, value);

                let removeSessionStorage = openmaths.SessionStorage.remove(key);

                expect(removeSessionStorage).toBe(true);
                expect(openmaths.SessionStorage.get(key)).toBe(false);
            });
        });
    });
}