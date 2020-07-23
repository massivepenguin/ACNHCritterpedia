import { critterTypeValues, critterType } from "../model/CritterType";

it('critter type alias test', () => {
    const shouldBeBug = critterTypeValues[critterType.bug];
    const shouldBeFish = critterTypeValues[critterType.fish];
    const shouldBeSeaCreature = critterTypeValues[critterType.seaCreature];
    expect(shouldBeBug).toEqual('Bug');
    expect(shouldBeFish).toEqual('Fish');
    expect(shouldBeSeaCreature).toEqual('Sea Creature');
});
