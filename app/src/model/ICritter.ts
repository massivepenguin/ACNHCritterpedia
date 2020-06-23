import { ITimeSpan } from "./ITimeSpan";

export interface ICritter {
    name: string;
    thumbnail: string;
    location: string;
    price: number;
    times: ITimeSpan[];
    northMonths: number[];
    southMonths: number[];
    caught?: boolean;
    donated?: boolean;
}