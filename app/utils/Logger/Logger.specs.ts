module openmaths.specs {
    'use strict';

    let logString = 'Hello World';

    describe('Logger', () => {
        it('should have the log instance and only log into console when in development environment', () => {
            let log = openmaths.Logger.log;

            expect(log).toBeDefined();
            expect(log(logString)).toBe(false);
        });

        it('should have the info instance and only log into console when in development environment', () => {
            let info = openmaths.Logger.info;

            expect(info).toBeDefined();
            expect(info(logString)).toBe(false);
        });

        it('should have the error instance and only log into console when in development environment', () => {
            let error = openmaths.Logger.error;

            expect(error).toBeDefined();
            expect(error(logString)).toBe(false);
        });

        it('should have the debug instance and only log into console when in development environment', () => {
            let debug = openmaths.Logger.debug;

            expect(debug).toBeDefined();
            expect(debug(logString)).toBe(false);
        });
    });
}