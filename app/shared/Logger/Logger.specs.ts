module openmaths.specs {
    'use strict';

    describe('Logger', () => {
        //beforeEach(module('openmaths'));

        it('should have the log instance', () => {
            let log = openmaths.Logger.log;

            expect(log).toBeDefined();
        });

        it('should have the info instance', () => {
            let info = openmaths.Logger.info;

            expect(info).toBeDefined();
        });

        it('should have the error instance', () => {
            let error = openmaths.Logger.error;

            expect(error).toBeDefined();
        });

        it('should have the debug instance', () => {
            let debug = openmaths.Logger.debug;

            expect(debug).toBeDefined();
        });
    });
}