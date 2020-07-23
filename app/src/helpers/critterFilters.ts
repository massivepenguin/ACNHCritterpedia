import { ICritter } from '../model/ICritter';
import { ICheckedCritterList } from '../model/ICheckedCritterList';
import { convertDates, isInTimeRange, createAdjustedEndTime } from './DateHelpers';
import { hemisphere } from '../model/Hemisphere';
import { sortType } from '../model/SortType';
import { ICritterList } from '../model/ICritterList';
import { ICritterState } from '../model/ICritterState';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import seaCreatures from '../data/seaCreatures.json';

const critterList: ICritterList = { bugs: bugs, fish: fish, seaCreatures: seaCreatures } as ICritterList;

/**
 * takes a list of ICritters (one of the three main types: bugs, fish, seaCreatures) and returns an object with the critters we can catch right now,
 * and the ones we can catch later today.
 * 
 * @param {number} timeOffset - the difference (positive or negative) between the app and the user's Switch console
 * @param {hemisphere} hemi - the hemisphere in which the user's island is located
 * @param {boolean} hideCaught - whether the user wants to hide critters they've already caught
 * @param {ICritter[]} critterListIn - an array of critters to sort (one of available critterTypes)
 * @param {number[]} caughtArray - an array of numerical IDs belonging to caught critters
 * @param {Date} currentTime - the date we're using as a comparitor (set to the current date if none provided)
 * @returns {ICheckedCritterList} - an object containing the critters that we can catch now, and the ones that are available later
 */
const filterCritterList = (timeOffset: number, hemi: hemisphere, hideCaught: boolean, critterListIn: ICritter[], caughtArray: number[], currentTime: Date): ICheckedCritterList => {
    // get the current state so we know which hemisphere we're in, what the time offset is, and whether we're hiding caught critters
    const upcomingCritters: ICritter[] = [];
    if (timeOffset !== 0) {
        currentTime.setHours(currentTime.getHours() + timeOffset);
    }
    // for readability, the months in the json files are not zero-indexed (January = 1), but the date object's month is (January = 0).
    // We add 1 to the current date's month to address this
    const currentMonth = currentTime.getMonth() + 1;
    const availableCritters = critterListIn.filter((critter: ICritter) => {
        // skip out of the rest of the function if we've caught this critter and are hiding ones we've caught
        if (hideCaught && caughtArray.indexOf(critter.id) > -1) {
            return null;
        }
        const monthsCritterAppears = hemi === hemisphere.south ? critter.southMonths : critter.northMonths;
        if (monthsCritterAppears.indexOf(currentMonth) > -1) {
            // check if the critter is available at this moment in time
            for (const timeRange of critter.times) {
                const [startTime, endTime] = convertDates(timeRange.startTime, timeRange.endTime, currentTime);
                const critterAppearingNow = isInTimeRange(currentTime, startTime, endTime);
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
 * sorts a list of critters based on the current sortBy value
 *
 * @param {ICritter[]} critterListIn - the list of critters to sort
 * @param {number} timeOffset - the difference (positive or negative) between the app and the user's Switch console
 * @param {sortType} activeSort - how we're sorting the list of critters
 * @param {hemisphere} hemi - the hemisphere in which the user's island is located
 * @param {Date} currentTime - the date we're using as a comparitor
 * @returns {ICritter[]}
 */
const sortCritterList = (critterListIn: ICritter[], timeOffset: number, activeSort: sortType, hemi: hemisphere, currentTime: Date): ICritter[] => {

    const mutatableCritterList: ICritter[] = [...critterListIn];

    const sortFunction = (a: ICritter, b: ICritter): number => {
        const aMonths = hemi === hemisphere.south ? a.southMonths : a.northMonths;
        const bMonths = hemi === hemisphere.south ? b.southMonths : b.northMonths;

        // create a new date to use as a comparator
        if (timeOffset !== 0) {
            currentTime.setHours(currentTime.getHours() + timeOffset);
        }
        switch (activeSort) {
            case sortType.alphaAsc:
            case sortType.alphaDesc:{
                // uppercase names and remove spaces to allow for accurate alphabetical sorting
                const aName = a.name.toUpperCase().replace(' ', '');
                const bName = b.name.toUpperCase().replace(' ', '');
                return bName > aName
                    ? (activeSort === sortType.alphaAsc ? -1 : 1)
                    : bName < aName
                    ? (activeSort === sortType.alphaAsc ? 1 : -1)
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
            case sortType.valueDesc: {
                // simple descending order based on sale price
                return a.price > b.price ? -1 : a.price < b.price ? 1 : 0;
            }
            case sortType.valueAsc: {
                // simple ascending order based on sale price
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
                    const [startTime, endTime] = convertDates(timeRange.startTime, timeRange.endTime, currentTime);
                    // we create an adjusted end time to use if the end time is earlier than the start time - e.g. if we need to trip over into the next day
                    let adjustedEndTime = createAdjustedEndTime(endTime, aMonths);
                    const critterAppearingNow = isInTimeRange(currentTime, startTime, endTime);
                    if (critterAppearingNow) {
                        remainingTimesForA.push(
                            startTime < currentTime
                                ? endTime.getTime() - currentTime.getTime()
                                : adjustedEndTime.getTime() - currentTime.getTime(),
                        );
                    }
                }
                for (const timeRange of b.times) {
                    const [startTime, endTime] = convertDates(timeRange.startTime, timeRange.endTime, currentTime);
                    const critterAppearingNow = isInTimeRange(currentTime, startTime, endTime);
                    let adjustedEndTime = createAdjustedEndTime(endTime, bMonths);
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
                    if (sortType[activeSort] === 'todayAsc') {
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
                if (sortType[activeSort] === 'yearAsc') {
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
    }

    mutatableCritterList.sort(sortFunction);

    return mutatableCritterList;
};



 /**
 * sorts and filters the source list of critters depending on various factors
 *
 * @param {number} timeOffset - the difference (positive or negative) between the app and the user's Switch console
 * @param {hemisphere} hemi - the hemisphere in which the user's island is located
 * @param {ICritterState} critters - which critters have been caught and donated 
 * @param {boolean} hideCaught - whether the user wants to hide critters they've already caught
 * @param {sortType} sortBy - how we're sorting the critter list
 * @param {Date} currentTime - the date we're using as a comparitor (set to the current date if none provided)
 * @returns {{all: ICritterList, available: ICritterList, upcoming: ICritterList}}
 */
export const filterCritters = (timeOffset: number, hemi: hemisphere, critters: ICritterState, hideCaught: boolean, sortBy: sortType, currentDate: Date = new Date()): {all: ICritterList, available: ICritterList, upcoming: ICritterList} => {
    const checkedBugs: ICheckedCritterList = filterCritterList(timeOffset, hemi, hideCaught, critterList.bugs, critters.caught.bugs, currentDate);
    const checkedFish: ICheckedCritterList = filterCritterList(timeOffset, hemi, hideCaught, critterList.fish, critters.caught.fish, currentDate);
    const checkedSeaCreatures: ICheckedCritterList = filterCritterList(timeOffset, hemi, hideCaught, critterList.seaCreatures, critters.caught.seaCreatures, currentDate);

    const availableCritters: ICritterList = {
        bugs: sortCritterList(checkedBugs.available, timeOffset, sortBy, hemi, currentDate),
        fish: sortCritterList(checkedFish.available, timeOffset, sortBy, hemi, currentDate),
        seaCreatures: sortCritterList(checkedSeaCreatures.available, timeOffset, sortBy, hemi, currentDate)
    };

    const upcomingCritters: ICritterList = {
        bugs: sortCritterList(checkedBugs.upcoming, timeOffset, sortBy, hemi, currentDate),
        fish: sortCritterList(checkedFish.upcoming, timeOffset, sortBy, hemi, currentDate),
        seaCreatures: sortCritterList(checkedSeaCreatures.upcoming, timeOffset, sortBy, hemi, currentDate)
    };

    // for the list of all critters, we sort by the current sortBy option, then filter out the caught ones (if that option is set)
    const allCritters: ICritterList = {
        bugs: sortCritterList(critterList.bugs, timeOffset, sortBy, hemi, currentDate)
        .filter((critter: ICritter) =>
            hideCaught ? critters.caught.bugs.indexOf(critter.id) < 0 : critter,
        ),
        fish: sortCritterList(critterList.fish, timeOffset, sortBy, hemi, currentDate)
        .filter((critter: ICritter) =>
            hideCaught ? critters.caught.fish.indexOf(critter.id) < 0 : critter,
        ),
        seaCreatures: sortCritterList(critterList.seaCreatures, timeOffset, sortBy, hemi, currentDate)
        .filter((critter: ICritter) =>
            hideCaught ? critters.caught.seaCreatures.indexOf(critter.id) < 0 : critter,
        )
    };


    return {all: allCritters, available: availableCritters, upcoming: upcomingCritters};
}
