module openmaths {
    'use strict';

    export interface IUmiDetails {
        id: string;
        title: string;
        umiType: string;
        uriFriendlyTitle: string;
    }

    export interface IUmi {
        creator: string;
        htmlContent: string;
        id: string;
        latexContent: string;
        latexContentId: string;
        meta: IUmiDetails;
        prerequisiteDefinitions: Array<IUmiDetails>;
        seeAlso: Array<IUmiDetails>;
        tags: Array<string>;
        titleSynonyms: Array<string>;
        ts: number;
        umiType: string;
    }

    export class UmiBoundary {
        horizontal:number[];
        vertical:number[];

        constructor(widthBegin?:number, widthEnd?:number, heightBegin?:number, heightEnd?:number) {
            this.horizontal = [widthBegin ? widthBegin : 0, widthEnd ? widthEnd : 0];
            this.vertical = [heightBegin ? heightBegin : 0, heightEnd ? heightEnd : 0];
        }
    }

    export class Umi {
        creator:string;
        formal:boolean;
        htmlContent:string;
        id:string;
        latexContent:string;
        latexContentId:string;
        meta:boolean;
        prerequisiteDefinitions:Array<IUmiDetails>;
        seeAlso:Array<IUmiDetails>;
        tags:Array<string>;
        title:string;
        titleSynonyms:Array<string>;
        ts:number;
        umiType:string;
        uriFriendlyTitle:string;

        where:number[];
        empty:boolean;
        boundary:UmiBoundary;

        constructor(initObject?:IUmi, where?:number[]) {
            this.creator = initObject && initObject.creator ? initObject.creator : null;
            // gotten from umiType
            this.formal = false;
            this.htmlContent = initObject && initObject.htmlContent ? initObject.htmlContent : null;
            this.id = initObject && initObject.id ? initObject.id : null;
            this.latexContent = initObject && initObject.latexContent ? initObject.latexContent : null;
            this.latexContentId = initObject && initObject.latexContentId ? initObject.latexContentId : null;
            // gotten from umiType
            this.meta = false;
            this.prerequisiteDefinitions = initObject && initObject.prerequisiteDefinitions ? initObject.prerequisiteDefinitions : null;
            this.seeAlso = initObject && initObject.seeAlso ? initObject.seeAlso : null;
            this.tags = initObject && initObject.tags ? initObject.tags : null;
            this.title = initObject && initObject.meta.title ? initObject.meta.title : null;
            this.titleSynonyms = initObject && initObject.titleSynonyms ? initObject.titleSynonyms : null;
            this.ts = initObject && initObject.ts ? initObject.ts : null;
            this.umiType = initObject && initObject.umiType ? this.parseUmiType(initObject.umiType) : null;
            this.uriFriendlyTitle = initObject && initObject.meta.uriFriendlyTitle ? initObject.meta.uriFriendlyTitle : null;

            this.where = where ? where : null;
            this.empty = this.isEmpty();
            this.boundary = new UmiBoundary;
        }

        isEmpty() {
            return _.isEmpty(this.id) || _.isEmpty(this.uriFriendlyTitle);
        }

        private parseUmiType(umiTypeRaw:string):string {
            const regexFormal = new RegExp('Formal', 'g'),
                regexMeta = new RegExp('Meta', 'g'),
                matchFormal = umiTypeRaw.match(regexFormal),
                matchMeta = umiTypeRaw.match(regexMeta);

            this.formal = _.isArray(matchFormal) && matchFormal.length > 0;
            this.meta = _.isArray(matchMeta) && matchMeta.length > 0;

            return umiTypeRaw.replace(regexFormal, '').replace(regexMeta, '');
        }
    }

    export interface IUmiType {
        label: string;
        formal?: boolean;
        meta?: boolean;
    }

    export class UmiTypes {
        Axiom:IUmiType = {
            label: 'Axiom',
            formal: true
        };
        AxiomScheme:IUmiType = {
            label: 'Axiom Scheme',
            formal: true
        };
        LogicalAxiom:IUmiType = {
            label: 'Logical Axiom',
            formal: true
        };
        LogicalAxiomScheme:IUmiType = {
            label: 'Logical Axiom Scheme',
            formal: true,
        };
        Definition:IUmiType = {
            label: 'Definition',
            formal: true,
            meta: true
        };
        Diagram:IUmiType = {
            label: 'Diagram',
        };
        Documentation:IUmiType = {
            label: 'Documentation'
        };
        Example:IUmiType = {
            label: 'Example'
        };
        HistoricalNote:IUmiType = {
            label: 'Historical Note',
        };
        Notation:IUmiType = {
            label: 'Notation',
            formal: true,
            meta: true
        };
        PhilosophicalJustification:IUmiType = {
            label: 'Philosophical Justification'
        };
        Proof:IUmiType = {
            label: 'Proof',
            formal: true,
            meta: true
        };
        Special:IUmiType = {
            label: 'Special'
        };
        Theorem:IUmiType = {
            label: 'Theorem',
            formal: true,
            meta: true
        };
    }
}