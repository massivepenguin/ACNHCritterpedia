import { EnumDictionary } from "./EnumDictionary";

export enum critterType {
    bug,
    fish,
}

export const critterTypeValues: EnumDictionary<critterType, string> = {
    [critterType.bug]: 'Bug',
    [critterType.fish]: 'Fish',
}
