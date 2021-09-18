declare module 'cactus' {
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

    type RecursivePartial<T> = {
        [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] :
            T[P] extends object ? RecursivePartial<T[P]> :
                T[P];
    };

}

declare module 'cactus-response' {
    export interface GenericResponse {
        error?: string;
    }

    export interface GetUser extends GenericResponse {
        user: User;
    }

}