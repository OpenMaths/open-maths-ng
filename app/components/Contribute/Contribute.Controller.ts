module openmaths {
    'use strict';

    export class ContributeController {
        MutationForm: openmaths.MutationForm;
        Umi: openmaths.Umi;

        constructor() {
            this.MutationForm = new openmaths.MutationForm;
        }
    }

    angular
        .module('openmaths')
        .controller('ContributeController', ContributeController);
}