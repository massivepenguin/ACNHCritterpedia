import { ITimeSpan } from "./ITimeSpan";

export interface ICritter {
    id: number;
    name: string;
    thumbnail: string;
    location: string;
    price: number;
    times: ITimeSpan[];
    northMonths: number[];
    southMonths: number[];
    silhouetteSize?: number;
}