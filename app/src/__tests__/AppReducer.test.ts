import { testStore, catchCritter, donateCritter } from "../reducers/AppReducer";
import { critterType } from "../model/CritterType";

it('catch bug with ID of 10', () => {
    const store = testStore;
    const critterId:number = 10;
    store.dispatch(catchCritter({ critterId: critterId, type: critterType.bug }));
    const state = store.getState();
    expect(state.critters.caught.bugs).toContain(critterId);
});

it('donate a fish with ID of 15', () => {
    const store = testStore;
    const critterId:number = 15;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.fish }));
    const state = store.getState();
    expect(state.critters.caught.fish).toContain(critterId);
    expect(state.critters.donated.fish).toContain(critterId);
});

it('donate a seaCreature with ID of 30, then mark as uncaught', () => {
    const store = testStore;
    const critterId:number = 30;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.seaCreature }));
    store.dispatch(catchCritter({ critterId: critterId, type: critterType.seaCreature }));
    const state = store.getState();
    expect(state.critters.caught.seaCreatures).not.toContain(critterId);
    expect(state.critters.donated.seaCreatures).not.toContain(critterId);
});

it('donate a bug with ID of 10, then undonate', () => {
    const store = testStore;
    const critterId:number = 10;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.bug }));
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.bug }));
    const state = store.getState();
    expect(state.critters.caught.bugs).toContain(critterId);
    expect(state.critters.donated.bugs).not.toContain(critterId);
});