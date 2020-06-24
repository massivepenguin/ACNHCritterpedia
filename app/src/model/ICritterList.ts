import { ICritter } from './ICritter';
import { IFish } from './IFish';

export interface ICritterList {
    bugs: ICritter[];
    fish: IFish[];
}