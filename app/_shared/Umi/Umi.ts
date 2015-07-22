module openmaths {
    'use strict';

    export interface IUmiDetails {
        id: string;
        title: string;
        type: string;
        uriFriendlyTitle: string;
    }

    export interface IUmi {
        creator: string;
        htmlContent: string;
        id: string;
        latexContent: string;
        latexContentId: string;
        prerequisiteDefinitions: Array<IUmiDetails>;
        seeAlso: Array<IUmiDetails>;
        tags: Array<string>;
        title: string;
        titleSynonyms: Array<string>;
        ts: number;
        umiType: string;
        uriFriendlyTitle: string;
    }

    export class Umi implements IUmi {
        creator = '';
        htmlContent = 'Default UMI Content';
        id = '';
        latexContent = '';
        latexContentId = '';
        prerequisiteDefinitions = [];
        seeAlso = [];
        tags = [];
        title = 'Default UMI Title';
        titleSynonyms = [];
        ts = 0;
        umiType = 'Default UMI Type';
        uriFriendlyTitle = '';
        where = [];

        empty: boolean;

        constructor(initObject?: IUmi, where?: number[]) {
            if (initObject) _.forEach(initObject, (value: any, key: string) => this[key] = value);

            this.where = where ? where : [];
            this.empty = this.isEmpty();
        }

        isEmpty() {
            return _.isEmpty(this.id) || _.isEmpty(this.uriFriendlyTitle);
        }

        // @TODO
        // remove after the API has reflected latest Interface updates
        static umiTempFormatter(initObject: any): IUmi {
            let umi = initObject.umi;
            let title = initObject.umi.title;

            _.forEach(umi, (value: any, key: string) => initObject[key] = value);
            _.forEach(title, (value: any, key: string) => initObject[key] = value);

            delete initObject.umi;

            return initObject;
        }
    }
}