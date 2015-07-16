module openmaths {
    'use strict';

    interface IUmiDetailsTemp {
        id: string;
        title: string;
        type: string;
        uriFriendlyTitle: string;
    }

    export interface IUmi {
        creator: string;
        htmlContent: string;
        latexContent: string;
        umi: {
            id: string;
            latexContentId: string;
            prerequisiteDefinitions: Array<IUmiDetailsTemp>;
            seeAlso: Array<IUmiDetailsTemp>;
            tags: Array<string>;
            title: IUmiDetailsTemp;
            titleSynonyms: Array<string>;
            ts: number;
            umiType: string;
        }
    }

    export class Umi {
        private Api: openmaths.Api;

        umi: IUmi;

        constructor(private _Api_: openmaths.Api) {
            this.Api = _Api_;
            //this.umi = {
            //    creator: '',
            //    htmlContent: '',
            //    latexContent: '',
            //    umi: {
            //        id: '',
            //        latexContentId: '',
            //        prerequisiteDefinitions: [],
            //        seeAlso: [],
            //        tags: [],
            //        title: {
            //            id: '',
            //            title: '',
            //            umiType: '',
            //            uriFriendlyTitle: ''
            //        },
            //        titleSynonyms: [],
            //        ts: 0,
            //        umiType: ''
            //    }
            //};

            this.Api.get('title/set-membership-infix-notation').then(d => {
                let response = openmaths.Api.response(d);
                this.umi = response.data;

                console.log(this.umi);
            });
        }
    }
}