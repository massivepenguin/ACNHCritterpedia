import {
    configureStore,
    getDefaultMiddleware,
    createSlice,
  } from "@reduxjs/toolkit";
import { critterType } from "../model/CritterType";
import { mainAppView } from "../model/MainAppView";
import { filterType } from "../model/FilterTypes";
  
  const middleware = [
    ...getDefaultMiddleware(),
    /*YOUR CUSTOM MIDDLEWARES HERE*/
  ];

  const catchSlice = createSlice({
    name: 'catch',
    initialState: {bugs: [] as number[], fish: [] as number[]},
    reducers: {
        catchCritter: (state, action) => {
            const {critterId, type} = action.payload;
            switch (type) {
                case critterType.bug: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if(critterIndex > -1) {
                        state.bugs.splice(critterIndex, 1);
                    } else {
                        state.bugs.push(critterId);
                    }
                    break;
                }
                case critterType.fish: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if(critterIndex> -1) {
                        state.fish.splice(critterIndex, 1);
                    } else {
                        state.fish.push(critterId);
                    }
                    break;
                }
                default:
                    return state;
            }
            return state;
        }
    }
});

const donateSlice = createSlice({
    name: 'donate',
    initialState: {bugs: [] as number[], fish: [] as number[]},
    reducers: {
        donateCritter: (state, action) => {
            const {critterId, type} = action.payload;
            switch (type) {
                case critterType.bug: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if(critterIndex> -1) {
                        state.bugs.splice(critterIndex, 1);
                    } else {
                        state.bugs.push(critterId);
                    }
                    break;
                }
                case critterType.fish: {
                    const critterIndex = state.bugs.indexOf(critterId);
                    if(critterIndex> -1) {
                        state.fish.splice(critterIndex, 1);
                    } else {
                        state.fish.push(critterId);
                    }
                    break;
                }
                default:
                    return state;
            }
            return state;
        }
    }
});

const hemispehereSlice = createSlice({
    name: 'hemisphere',
    initialState: null,
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
    initialState: 0,
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
    initialState: filterType.entryAsc,
    reducers: {
        changeFilter: (state, action) => {
            const newFilter = action.payload;
            if(state !== newFilter) {
                state = newFilter;
                return state;
            }
        },
    },
});

const hideCaughtSlice = createSlice({
    name: 'hideCaught',
    initialState: false,
    reducers: {
        hideCaught: (state, action) => {
            const newValue = action.payload;
            state = newValue;
            return state;
        }
    },
});

const showAllCritterSlice = createSlice({
    name: 'showAllCritters',
    initialState: false,
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
    initialState: mainAppView.all,
    reducers: {
        changeView: (state, action) => {
            const newView = action.payload;
            if(state !== newView) {
                state = newView;
                return state;
            }
        },
    },
});

const persistedState = localStorage.getItem('appState') ? JSON.parse(localStorage.getItem('appState') as string) : {};

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
        appView: appViewReducer,
    },
    middleware,
    preloadedState: persistedState,
});