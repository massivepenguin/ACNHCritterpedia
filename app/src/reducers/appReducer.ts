import { configureStore, getDefaultMiddleware, createSlice } from '@reduxjs/toolkit';
import { critterType } from '../model/CritterType';
import { AppState, IAppState, instanceOfAppState } from '../model/AppState';

const middleware = [
    ...getDefaultMiddleware(),
    /*YOUR CUSTOM MIDDLEWARES HERE*/
];

const exampleState = {...AppState} as IAppState;

const catchSlice = createSlice({
    name: 'catch',
    initialState: exampleState.caughtCritters,
    reducers: {
        catchCritter: (state, action) => {
            const { critterId, type } = action.payload;
            let sourceArray: number [] = [];
            switch (type) {
                case critterType.bug: {
                    sourceArray = state.bugs;
                    break;
                }
                case critterType.fish: {
                    sourceArray = state.fish;
                    break;
                }
                case critterType.seaCreature: {
                    sourceArray = state.seaCreatures;
                    break;
                }
            }
            const critterIndex = sourceArray.indexOf(critterId);
            if (critterIndex > -1) {
                sourceArray.splice(critterIndex, 1);
            } else {
                sourceArray.push(critterId);
            }
            return state;
        },
    },
});

const donateSlice = createSlice({
    name: 'donate',
    initialState: exampleState.donatedCritters,
    reducers: {
        donateCritter: (state, action) => {
            const { critterId, type } = action.payload;
            switch (type) {
                case critterType.bug: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if (critterIndex > -1) {
                        state.bugs.splice(critterIndex, 1);
                    } else {
                        state.bugs.push(critterId);
                    }
                    break;
                }
                case critterType.fish: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if (critterIndex > -1) {
                        state.fish.splice(critterIndex, 1);
                    } else {
                        state.fish.push(critterId);
                    }
                    break;
                }
                case critterType.seaCreature: {
                    const critterIndex = state.seaCreatures.indexOf(critterId);
                    if (critterIndex > -1) {
                        state.seaCreatures.splice(critterIndex, 1);
                    } else {
                        state.seaCreatures.push(critterId);
                    }
                    break;
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

const filterSlice = createSlice({
    name: 'filter',
    initialState: exampleState.activeFilter,
    reducers: {
        changeFilter: (state, action) => {
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
        hideCaught: (state, action) => {
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
        showAll: (state, action) => {
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

let persistedState = (localStorage.getItem('appState') ? JSON.parse(localStorage.getItem('appState') as string) : AppState);

if(!instanceOfAppState(persistedState)) {
    // if the state doesn't match the interface the app is expecting, we'll upgrade the
    // persistedState to match it - this allows us to extend the creatures while preserving
    // the user's saved state
    let newState = {...AppState, ...persistedState} as IAppState;
    newState.caughtCritters = {...AppState.caughtCritters, ...persistedState.caughtCritters};
    newState.donatedCritters = {...AppState.donatedCritters, ...persistedState.donatedCritters};
    persistedState = newState;
    // overwrite the original state so we know it's good for next time
    localStorage.setItem('appState', JSON.stringify(persistedState));
} 

export const { changeHemisphere } = hemispehereSlice.actions;
export const { catchCritter } = catchSlice.actions;
export const { donateCritter } = donateSlice.actions;
export const { changeOffset, removeOffset } = timeOffsetSlice.actions;
export const { changeFilter } = filterSlice.actions;
export const { changeView } = switchAppViewSlice.actions;
export const { showAll } = showAllCritterSlice.actions;
export const { hideCaught } = hideCaughtSlice.actions;

const hemisphereReducer = hemispehereSlice.reducer;
const catchReducer = catchSlice.reducer;
const donateReducer = donateSlice.reducer;
const timeOffsetReducer = timeOffsetSlice.reducer;
const filterReducer = filterSlice.reducer;
const hideCaughtReducer = hideCaughtSlice.reducer;
const showAllReducer = showAllCritterSlice.reducer;
const appViewReducer = switchAppViewSlice.reducer;

export const store = configureStore({
    reducer: {
        hemisphere: hemisphereReducer,
        caughtCritters: catchReducer,
        donatedCritters: donateReducer,
        timeOffset: timeOffsetReducer,
        activeFilter: filterReducer,
        hideCaught: hideCaughtReducer,
        showAll: showAllReducer,
        currentView: appViewReducer,
    },
    middleware,
    preloadedState: persistedState,
});

// save the store state to localStorage when it's updated
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('appState', JSON.stringify(state));
});
