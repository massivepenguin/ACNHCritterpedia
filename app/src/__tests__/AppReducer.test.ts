import { testStore, catchCritter, donateCritter, updateState } from "../reducers/AppReducer";
import { critterType } from "../model/CritterType";
import { instanceOfAppState } from "../model/AppState";
import { mainAppView } from "../model/MainAppView";
import { sortType } from "../model/SortType";
import { ICritterIdList } from "../model/ICritterIdList";

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

it('update out-of-date state to current app state', () => {
    const outOfDateState = {
        currentView: mainAppView.all,
        critters: {
            caught: { bugs: [1,5,7], fish: [8,25,67,48]  } as any, // missing seaCreatures
            donated: { bugs: [5], fish: [8,25] } as any, // missing seaCreatures
        },
        activeSort: sortType.entryAsc,
        timeOffset: 0,
        hemisphere: null,
        hideCaught: false,
        showAll: false,
    };
    expect(instanceOfAppState(outOfDateState)).toEqual(false);
    const updatedState = updateState(outOfDateState);
    expect(instanceOfAppState(updatedState)).toEqual(true);
    expect(updatedState.critters.caught.bugs.length).toEqual(3);
    expect(updatedState.critters.caught.bugs).toContain(5);
    expect(updatedState.critters.caught.fish.length).toEqual(4);
    expect(updatedState.critters.caught.fish).toContain(67);
    expect(updatedState.critters.donated.bugs.length).toEqual(1);
    expect(updatedState.critters.donated.bugs).toContain(5);
    expect(updatedState.critters.donated.fish.length).toEqual(2);
    expect(updatedState.critters.donated.fish).toContain(25);
    expect(updatedState.critters.caught.seaCreatures.length).toEqual(0);
    expect(updatedState.critters.donated.seaCreatures.length).toEqual(0);
});