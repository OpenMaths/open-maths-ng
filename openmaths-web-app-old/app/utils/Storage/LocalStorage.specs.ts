module openmaths.specs {
    'use strict';

    let testData = {
        number: 1,
        boolean: true,
        string: 'Hello World',
        object: {value: 'Hello World'},
        array: ['Hello', 'World']
    };

    describe('LocalStorage', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        it('should have the set method', () => {
            expect(openmaths.LocalStorage.set).toBeDefined();
        });

        it('should set values into window.localStorage', () => {
            _.forEach(testData, (value, key) => {
                let setLocalStorage = openmaths.LocalStorage.set(key, value);

                expect(setLocalStorage).toBe(true);
                expect(window.localStorage.getItem(key)).toEqual(JSON.stringify(value));
            });
        });

        it('should have the get method', () => {
            expect(openmaths.LocalStorage.get).toBeDefined();
        });

        it('should get values from window.localStorage', () => {
            _.forEach(testData, (value, key) => {
                openmaths.LocalStorage.set(key, value);

                let getLocalStorage = openmaths.LocalStorage.get(key);

                expect(getLocalStorage).toEqual(value);
            });
        });

        it('should have the remove method', () => {
            expect(openmaths.LocalStorage.remove).toBeDefined();
        });

        it('should remove values from window.localStorage', () => {
            _.forEach(testData, (value, key) => {
                openmaths.LocalStorage.set(key, value);

                let removeLocalStorage = openmaths.LocalStorage.remove(key);

                expect(removeLocalStorage).toBe(true);
                expect(openmaths.LocalStorage.get(key)).toBe(false);
            });
        });
    });
}