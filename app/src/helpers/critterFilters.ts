import { ICritter } from '../model/ICritter';
import { ICheckedCritterList } from '../model/ICheckedCritterList';
import { setDateToCurrentDate, correctDates } from './DateHelpers';
import { hemisphere } from '../model/Hemisphere';
import { sortType } from '../model/SortType';
import { store } from '../reducers/AppReducer';
import { ICritterList } from '../model/ICritterList';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import seaCreatures from '../data/seaCreatures.json';

const critterList: ICritterList = { bugs: bugs, fish: fish, seaCreatures: seaCreatures } as ICritterList;

/**
 * takes a list of ICritters (one of the three main types: bugs, fish, seaCreatures) and returns an object with the critters we can catch right now,
 * and the ones we can catch later today.
 * 
 * @param {ICritter[]} critterListIn - an array of critters to sort (one of available critterTypes)
 * @param {number[]} caughtArray - an array of numerical IDs belonging to caught critters
 * @returns {ICheckedCritterList} - an object containing the critters that we can catch now, and the ones that are available later
 */
const filterCritterList = (critterListIn: ICritter[], caughtArray: number[]): ICheckedCritterList => {
    // get the current state so we know which hemisphere we're in, what the time offset is, and whether we're hiding caught critters
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

/**
 * sorts a list of critters by the provided sortType
 *
 * @param {ICritter} a
 * @param {ICritter} b
 * @returns {number}
 */
const sortCritterList = (a: ICritter, b: ICritter): number => {
    // get the current state so we know which sortType we're using and what the time offset is
    const state = store.getState();
    // create a new date to use as a comparator
    let currentTime = new Date();
    if (state.timeOffset !== 0) {
        currentTime.setHours(currentTime.getHours() + state.timeOffset);
        currentTime = setDateToCurrentDate(currentTime); // in case we crossed a time boundary, we reset the date to the current date (keeping the time)
    }
    switch (state.activeSort) {
        case sortType.alphaAsc:
        case sortType.alphaDesc:{
            // uppercase names and remove spaces to allow for accurate alphabetical sorting
            const aName = a.name.toUpperCase().replace(' ', '');
            const bName = b.name.toUpperCase().replace(' ', '');
            return bName > aName
                ? (state.activeSort === sortType.alphaAsc ? -1 : 1)
                : bName < aName
                ? (state.activeSort === sortType.alphaAsc ? 1 : -1)
                : 0;
        }
        case sortType.entryDesc: {
            // simple descending order based on numerical ID
            return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
        }
        case sortType.entryAsc: {
            // simple ascending order based on numerical ID
            return b.id > a.id ? -1 : b.id < a.id ? 1 : 0;
        }
        case sortType.valueAsc: {
            // simple ascending order based on sale price
            return a.price > b.price ? -1 : a.price < b.price ? 1 : 0;
        }
        case sortType.valueDesc: {
            // simple descending order based on sale price
            return b.price > a.price ? -1 : b.price < a.price ? 1 : 0;
        }
        case sortType.todayAsc:
        case sortType.todayDesc: {
            // sort based on the time each critter has remaining today
            // to complicate matters, each critter could have multiple appearance windows so we need to take that into account
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
                // sort the remaining times for each in ascending order, so we get the shortest amount of time first
                const sortFunction = (a: number, b: number) => (a > b ? 1 : b < a ? -1 : 0);
                remainingTimesForA.sort(sortFunction);
                remainingTimesForB.sort(sortFunction);
                if (sortType[state.activeSort] === 'todayAsc') {
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
        case sortType.yearAsc:
        case sortType.yearDesc: {
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
            if (sortType[state.activeSort] === 'yearAsc') {
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
};

export const filterCritters = (): {all: ICritterList, available: ICritterList, upcoming: ICritterList} => {
    const state = store.getState();
    const checkedBugs: ICheckedCritterList = filterCritterList(critterList.bugs, state.critters.caught.bugs);
    const checkedFish: ICheckedCritterList = filterCritterList(critterList.fish, state.critters.caught.fish);
    const checkedSeaCreatures: ICheckedCritterList = filterCritterList(critterList.seaCreatures, state.critters.caught.seaCreatures);

    const availableCritters: ICritterList = {
        bugs: checkedBugs.available.sort(sortCritterList),
        fish: checkedFish.available.sort(sortCritterList),
        seaCreatures: checkedSeaCreatures.available.sort(sortCritterList)
    };

    const upcomingCritters: ICritterList = {
        bugs: checkedBugs.upcoming.sort(sortCritterList),
        fish: checkedFish.upcoming.sort(sortCritterList),
        seaCreatures: checkedSeaCreatures.upcoming.sort(sortCritterList)
    };

    const allCritters: ICritterList = {
        bugs: critterList.bugs.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.critters.caught.bugs.indexOf(critter.id) < 0 : critter,
        ),
        fish: critterList.fish.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.critters.caught.fish.indexOf(critter.id) < 0 : critter,
        ),
        seaCreatures: critterList.seaCreatures.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.critters.caught.seaCreatures.indexOf(critter.id) < 0 : critter,
        )
    };


    return {all: allCritters, available: availableCritters, upcoming: upcomingCritters};
}
