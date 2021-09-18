declare module 'catcus' {
    export interface User {
        id: string;
        name: string;
        currentPlant: CurrentPlant;
        garden: GrownPlant[]
    }

    export interface CurrentPlant {
        dateTimeCreated: string;
        spokenPhrases: Phrase[];
        growth: number // 0 is new, 100 is grown
    }

    export interface GrownPlant {
        topPhrases: [Phrase, Phrase, Phrase]
    }

    export interface Phrase {
        text: string;
    }
}