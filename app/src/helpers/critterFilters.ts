import { ICritter } from '../model/ICritter';
import { ICheckedCritterList } from '../model/ICheckedCritterList';
import { setDateToCurrentDate, correctDates } from './DateHelpers';
import { hemisphere } from '../model/Hemisphere';
import { filterType } from '../model/FilterTypes';
import { IAppState } from '../model/AppState';
import { store } from '../reducers/AppReducer';

export const filterCritterList = (critterListIn: ICritter[], caughtArray: number[]): ICheckedCritterList => {
    const state = store.getState();
    const upcomingCritters: ICritter[] = [];
    let currentTime = new Date();
    if (state.timeOffset !== 0) {
        currentTime.setHours(currentTime.getHours() + state.timeOffset);
        currentTime = setDateToCurrentDate(currentTime); // in case we crossed a time boundary, we reset the date to the current date (keeping the time)
    }
    // for readability, the months in the json files are not zero-indexed (January = 1), but the date object's month is (January = 0).
    // We add 1 to the current date's month to address this
    const currentMonth = currentTime.getMonth() + 1;
    const availableCritters = critterListIn.filter((critter: ICritter) => {
        // skip out of the rest of the function if we've caught this critter and are hiding ones we've caught
        if (state.hideCaught && caughtArray.indexOf(critter.id) > -1) {
            return null;
        }
        const monthsCritterAppears = state.hemisphere === hemisphere.north ? critter.northMonths : critter.southMonths;
        if (monthsCritterAppears.indexOf(currentMonth) > -1) {
            // check if the critter is available at this moment in time
            for (const timeRange of critter.times) {
                const [startTime, endTime] = correctDates(timeRange.startTime, timeRange.endTime);
                const critterAppearingNow =
                    startTime <= endTime
                        ? currentTime >= startTime && currentTime < endTime
                        : endTime > currentTime && startTime > currentTime;
                if (critterAppearingNow) {
                    return critter;
                } else {
                    if (startTime > currentTime && !upcomingCritters.includes(critter)) {
                        upcomingCritters.push(critter);
                        continue;
                    }
                }
            }
        }
        return null;
    });
    return { available: availableCritters, upcoming: upcomingCritters };
};

export const sortCritterList = (a: ICritter, b: ICritter): number => {
    const state = store.getState();
    let currentTime = new Date();
    if (state.timeOffset !== 0) {
        currentTime.setHours(currentTime.getHours() + state.timeOffset);
        currentTime = setDateToCurrentDate(currentTime); // in case we crossed a time boundary, we reset the date to the current date (keeping the time)
    }
    switch (state.activeFilter) {
        case filterType.alphaAsc:
        case filterType.alphaDesc:{
            // uppercase names and remove spaces to allow for accurate alphabetical sorting
            const aName = a.name.toUpperCase().replace(' ', '');
            const bName = b.name.toUpperCase().replace(' ', '');
            return bName > aName
                ? (state.activeFilter === filterType.alphaAsc ? -1 : 1)
                : bName < aName
                ? (state.activeFilter === filterType.alphaAsc ? 1 : -1)
                : 0;
        }
        case filterType.entryDesc: {
            return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
        }
        case filterType.entryAsc: {
            return b.id > a.id ? -1 : b.id < a.id ? 1 : 0;
        }
        case filterType.valueAsc: {
            return a.price > b.price ? -1 : a.price < b.price ? 1 : 0;
        }
        case filterType.valueDesc: {
            return b.price > a.price ? -1 : b.price < a.price ? 1 : 0;
        }
        case filterType.todayAsc:
        case filterType.todayDesc: {
            // get the difference between current time and when the critter disappears
            const remainingTimesForA: number[] = [];
            const remainingTimesForB: number[] = [];
            for (const timeRange of a.times) {
                const [startTime, endTime] = correctDates(timeRange.startTime, timeRange.endTime);
                const critterAppearingNow =
                    startTime <= endTime
                        ? currentTime >= startTime && currentTime < endTime
                        : endTime > currentTime && startTime > currentTime;
                const adjustedEndTime = new Date(endTime);
                adjustedEndTime.setDate(endTime.getDate() + 1);
                if (critterAppearingNow) {
                    remainingTimesForA.push(
                        startTime < currentTime
                            ? endTime.getTime() - currentTime.getTime()
                            : adjustedEndTime.getTime() - currentTime.getTime(),
                    );
                }
            }
            for (const timeRange of b.times) {
                const [startTime, endTime] = correctDates(timeRange.startTime, timeRange.endTime);
                const critterAppearingNow =
                    startTime <= endTime
                        ? currentTime >= startTime && currentTime < endTime
                        : endTime > currentTime && startTime > currentTime;
                const adjustedEndTime = new Date(endTime);
                adjustedEndTime.setDate(endTime.getDate() + 1);
                if (critterAppearingNow) {
                    remainingTimesForB.push(
                        startTime < currentTime
                            ? endTime.getTime() - currentTime.getTime()
                            : adjustedEndTime.getTime() - currentTime.getTime(),
                    );
                }
            }
            if (remainingTimesForA.length && remainingTimesForB.length) {
                const sortFunction = (a: number, b: number) => (a > b ? 1 : b < a ? -1 : 0);
                remainingTimesForA.sort(sortFunction);
                remainingTimesForB.sort(sortFunction);
                if (filterType[state.activeFilter] === 'todayAsc') {
                    return remainingTimesForA[0] > remainingTimesForB[0]
                        ? 1
                        : remainingTimesForA[0] < remainingTimesForB[0]
                        ? -1
                        : 0;
                } else {
                    return remainingTimesForA[0] < remainingTimesForB[0]
                        ? 1
                        : remainingTimesForA[0] > remainingTimesForB[0]
                        ? -1
                        : 0;
                }
            }
            return 0;
        }
        case filterType.yearAsc:
        case filterType.yearDesc: {
            const aMonths = state.hemisphere === hemisphere.north ? a.northMonths : a.southMonths;
            const bMonths = state.hemisphere === hemisphere.south ? b.northMonths : b.southMonths;
            const sortMonths = (a: number, b: number) => (a > b ? 1 : b < a ? -1 : 0);
            aMonths.sort(sortMonths);
            bMonths.sort(sortMonths);

            const calculateMonthsRemaining = (sourceMonths: number[]): number => {
                // get the month and adjust it to account for the fact that the critter months are 1-indexed rather than 0-indexed
                const thisMonth = currentTime.getMonth() + 1;
                const startIndex = sourceMonths.indexOf(thisMonth);
                if (startIndex > -1) {
                    let remainingMonths = 0;
                    let currentMonthIndex = startIndex;
                    while (remainingMonths < 12) {
                        // we'll be looping round to January if we hit December, so we put a limit on this to stop infinite loops
                        const currentMonthNumber: number = sourceMonths[currentMonthIndex];
                        // if the next month is contiguous, add 1 to the remaining months and proceed
                        if (
                            sourceMonths.length > currentMonthIndex &&
                            sourceMonths[currentMonthIndex + 1] === currentMonthNumber + 1
                        ) {
                            ++remainingMonths;
                            ++currentMonthIndex;
                        } else if (currentMonthNumber === 12 && sourceMonths[0] === 1) {
                            ++remainingMonths;
                            currentMonthIndex = 0;
                        } else {
                            break;
                        }
                    }
                    return remainingMonths;
                }
                return 0;
            };

            const remainingMonthsForA = calculateMonthsRemaining(aMonths);
            const remainingMonthsForB = calculateMonthsRemaining(bMonths);
            if (filterType[state.activeFilter] === 'yearAsc') {
                return remainingMonthsForA > remainingMonthsForB
                    ? 1
                    : remainingMonthsForA < remainingMonthsForB
                    ? -1
                    : 0;
            } else {
                return remainingMonthsForA < remainingMonthsForB
                    ? 1
                    : remainingMonthsForA > remainingMonthsForB
                    ? -1
                    : 0;
            }
        }
    }
    return 0;
};
