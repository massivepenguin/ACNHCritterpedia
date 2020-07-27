import { testStore, catchCritter, donateCritter, updateState } from "../reducers/appReducer";
import { critterType } from "../model/CritterType";
import { instanceOfAppState } from "../model/AppState";
import { mainAppView } from "../model/MainAppView";
import { sortType } from "../model/SortType";

describe('catch bug with ID of 10', () => {
    const store = testStore;
    const critterId:number = 10;
    store.dispatch(catchCritter({ critterId: critterId, type: critterType.bug }));
    const state = store.getState();
    it('should contain the ID of the critter we\'ve caught', () => {
        expect(state.critters.caught.bugs).toContain(critterId);
    })
});

describe('donate a fish with ID of 15', () => {
    const store = testStore;
    const critterId:number = 15;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.fish }));
    const state = store.getState();
    it('should have the caught critter\'s ID in the \'donated\' array', () => {
        expect(state.critters.donated.fish).toContain(critterId);
    });
    it('should also have the caught critter\'s ID in the \'caught\' array', () => {
        expect(state.critters.caught.fish).toContain(critterId);
    });
});

describe('donate a seaCreature with ID of 30, then mark as uncaught', () => {
    const store = testStore;
    const critterId:number = 30;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.seaCreature }));
    store.dispatch(catchCritter({ critterId: critterId, type: critterType.seaCreature }));
    const state = store.getState();
    it('should have removed the critter from the \'caught\' array', () => {
        expect(state.critters.caught.seaCreatures).not.toContain(critterId);
    });
    it('should also have removed the critter from the \'donated\' array, as you can\'t donate something you haven\'t caught', () => {
        expect(state.critters.donated.seaCreatures).not.toContain(critterId);
    });
});

describe('donate a bug with ID of 10, then undonate', () => {
    const store = testStore;
    const critterId:number = 10;
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.bug }));
    store.dispatch(donateCritter({ critterId: critterId, type: critterType.bug }));
    const state = store.getState();
    it('should not have the critter ID in the \'donated\' array', () => {
        expect(state.critters.donated.bugs).not.toContain(critterId);
    });
    it('should still have the critter ID in the \'caught\' array', () => {
        expect(state.critters.caught.bugs).toContain(critterId);
    });
});

describe('update out-of-date state to current app state', () => {
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
    const updatedState = updateState(outOfDateState);

    it('should return false as the \'critters\' proerty is missing \'seaCreatures\'', () => {
        expect(instanceOfAppState(outOfDateState)).toEqual(false);
    });
    it('should have reshaped the state into a compatible one', () => {
        expect(instanceOfAppState(updatedState)).toEqual(true);
    });
    it('should have preserved the caught bugs array', () => {
        expect(updatedState.critters.caught.bugs.length).toEqual(3);
        expect(updatedState.critters.caught.bugs).toContain(5);
    });
    it('should have preserved the caught fish array', () => {
        expect(updatedState.critters.caught.fish.length).toEqual(4);
        expect(updatedState.critters.caught.fish).toContain(67);
    });
    it('should have preserved the donated bugs array', () => {
        expect(updatedState.critters.donated.bugs.length).toEqual(1);
        expect(updatedState.critters.donated.bugs).toContain(5);
    });
    it('should have preserved the donated fish array', () => {
        expect(updatedState.critters.donated.fish.length).toEqual(2);
        expect(updatedState.critters.donated.fish).toContain(25);
    });
    it('should have added the donated/caught seaCreatures arrays', () => {
        expect(updatedState.critters.caught.seaCreatures.length).toEqual(0);
        expect(updatedState.critters.donated.seaCreatures.length).toEqual(0);
    });
});
