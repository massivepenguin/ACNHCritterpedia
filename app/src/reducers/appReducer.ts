import { configureStore, getDefaultMiddleware, createSlice } from '@reduxjs/toolkit';
import { critterType } from '../model/CritterType';
import { AppState, IAppState, instanceOfAppState } from '../model/AppState';
import { saveData, loadData } from '../helpers/dataHelpers';

const middleware = [
    ...getDefaultMiddleware(),
];

const exampleState = {...AppState} as IAppState;

const critterSlice = createSlice({
    name: 'critters',
    initialState: exampleState.critters,
    reducers: {
        catchCritter: (state, action) => {
            const { critterId, type } = action.payload;
            let caughtArray: number [] = [];
            let donatedArray: number [] = [];
            switch (type) {
                case critterType.bug: {
                    caughtArray = state.caught.bugs;
                    donatedArray = state.donated.bugs;
                    break;
                }
                case critterType.fish: {
                    caughtArray = state.caught.fish;
                    donatedArray = state.donated.fish;
                    break;
                }
                case critterType.seaCreature: {
                    caughtArray = state.caught.seaCreatures;
                    donatedArray = state.donated.seaCreatures;
                    break;
                }
            }
            const caughtIndex = caughtArray.indexOf(critterId);
            if (caughtIndex > -1) {
                caughtArray.splice(caughtIndex, 1);
                // we're marking the critter as uncaught, which means we can't have donated it either.
                // let's remove the critter from the donated array too
                const donatedIndex = donatedArray.indexOf(critterId);
                if(donatedIndex > -1) {
                    donatedArray.splice(donatedIndex, 1);
                }
            } else {
                caughtArray.push(critterId);
            }
            return state;
        },
        donateCritter: (state, action) => {
            const { critterId, type } = action.payload;
            let caughtArray: number [] = [];
            let donatedArray: number [] = [];
            switch (type) {
                case critterType.bug: {
                    caughtArray = state.caught.bugs;
                    donatedArray = state.donated.bugs;
                    break;
                }
                case critterType.fish: {
                    caughtArray = state.caught.fish;
                    donatedArray = state.donated.fish;
                    break;
                }
                case critterType.seaCreature: {
                    caughtArray = state.caught.seaCreatures;
                    donatedArray = state.donated.seaCreatures;
                    break;
                }
            }
            const donatedIndex = donatedArray.indexOf(critterId);
            if(donatedIndex > -1) {
                // we're marking this critter as not donated
                donatedArray.splice(donatedIndex, 1);
            } else {
                // we've not donated this critter. Let's also mark it as caught!
                donatedArray.push(critterId);
                const caughtIndex = caughtArray.indexOf(critterId);
                if(caughtIndex < 0) {
                    caughtArray.push(critterId);
                }
            }
            return state;
        },
    },
});

const hemispehereSlice = createSlice({
    name: 'hemisphere',
    initialState: exampleState.hemisphere,
    reducers: {
        changeHemisphere: (state, action) => {
            const hemi = action.payload;
            state = hemi;
            return state;
        },
    },
});

const timeOffsetSlice = createSlice({
    name: 'timeOffset',
    initialState: exampleState.timeOffset,
    reducers: {
        changeOffset: (state, action) => {
            const offset = action.payload;
            state = offset;
            return state;
        },
        removeOffset: (state, action) => {
            state = 0;
            return state;
        },
    },
});

const sortSlice = createSlice({
    name: 'changeSort',
    initialState: exampleState.activeSort,
    reducers: {
        changeSort: (state, action) => {
            const newFilter = action.payload;
            if (state !== newFilter) {
                state = newFilter;
            }
            return state;
        },
    },
});

const hideCaughtSlice = createSlice({
    name: 'hideCaught',
    initialState: exampleState.hideCaught,
    reducers: {
        changeHideCaught: (state, action) => {
            const newValue = action.payload;
            state = newValue;
            return state;
        },
    },
});

const showAllCritterSlice = createSlice({
    name: 'showAllCritters',
    initialState: exampleState.showAll,
    reducers: {
        changeShowAll: (state, action) => {
            const newValue = action.payload;
            state = newValue;
            return state;
        },
    },
});

const switchAppViewSlice = createSlice({
    name: 'switchView',
    initialState: exampleState.currentView,
    reducers: {
        changeView: (state, action) => {
            const newView = action.payload;
            if (state !== newView) {
                state = newView;
            }
            return state;
        },
    },
});

// TODO: handle errors accessing localStorage
let persistedState = loadData();

export const updateState = (sourceState: any): IAppState => {
    // first, make sure all the top level properties are the same as the IAppState interface
    let newState = {...AppState, ...sourceState} as IAppState;
    newState.critters = {caught: {...AppState.critters.caught, ...sourceState.critters.caught}, donated: {...AppState.critters.donated, ...sourceState.critters.donated}};
    return newState;
};


if(!instanceOfAppState(persistedState)) {
    // if the state doesn't match the interface the app is expecting, we'll upgrade the
    // persistedState to match it - this allows us to extend the creatures while preserving
    // the user's saved state
    persistedState = updateState(persistedState);
    // overwrite the original state so we know it's good for next time
    saveData(persistedState);
} 

export const { changeHemisphere } = hemispehereSlice.actions;
export const { catchCritter, donateCritter } = critterSlice.actions;
export const { changeOffset, removeOffset } = timeOffsetSlice.actions;
export const { changeSort } = sortSlice.actions;
export const { changeView } = switchAppViewSlice.actions;
export const { changeShowAll } = showAllCritterSlice.actions;
export const { changeHideCaught } = hideCaughtSlice.actions;

const hemisphereReducer = hemispehereSlice.reducer;
const critterReducer = critterSlice.reducer;
const timeOffsetReducer = timeOffsetSlice.reducer;
const sortReducer = sortSlice.reducer;
const hideCaughtReducer = hideCaughtSlice.reducer;
const showAllReducer = showAllCritterSlice.reducer;
const appViewReducer = switchAppViewSlice.reducer;

export const store = configureStore({
    reducer: {
        hemisphere: hemisphereReducer,
        critters: critterReducer,
        timeOffset: timeOffsetReducer,
        activeSort: sortReducer,
        hideCaught: hideCaughtReducer,
        showAll: showAllReducer,
        currentView: appViewReducer,
    },
    middleware,
    preloadedState: persistedState,
});

// store that's specifically for testing, so we don't pollute the app's store during testing
export const testStore = configureStore({
    reducer: {
        hemisphere: hemisphereReducer,
        critters: critterReducer,
        timeOffset: timeOffsetReducer,
        activeSort: sortReducer,
        hideCaught: hideCaughtReducer,
        showAll: showAllReducer,
        currentView: appViewReducer,
    },
    middleware,
    preloadedState: exampleState,
});
