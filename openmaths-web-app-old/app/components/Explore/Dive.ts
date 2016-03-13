module openmaths {
    'use strict';

    interface IDive {
        state: string;
    }

    export class Dive implements IDive {
        state: string;

        constructor() {
            this.state = 'explore';
        }
    }
}