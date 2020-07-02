import { EnumDictionary } from "./EnumDictionary";

export enum hemisphere {
    north,
    south
}

export const hemisphereValues: EnumDictionary<hemisphere, string> = {
    [hemisphere.north]: 'North',
    [hemisphere.south]: 'South',
}
