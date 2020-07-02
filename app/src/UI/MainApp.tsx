import React, { useState } from 'react';
import { store, hideCaught, showAll } from '../reducers/appReducer';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import { critterType } from '../model/CritterType';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import CritterEntry from './CritterEntry';
import ListSorter from './ListSorter';
import Checkbox from './Checkbox';
import { ICheckedCritterList } from '../model/ICheckedCritterList';
import { filterCritterList, sortCritterList } from '../helpers/critterFilters';

const critterList: ICritterList = { bugs: bugs, fish: fish } as ICritterList;

function MainApp() {
    const [loading, setLoading] = useState(true);
    const [availableCritters, setAvailableCritters] = useState({ bugs: [], fish: [] } as ICritterList);
    const [upcomingCritters, setUpcomingCritters] = useState({ bugs: [], fish: [] } as ICritterList);

    store.subscribe(() => {
        filterCritterAvailability();
    });

    const state = store.getState();

    const filterCritterAvailability = () => {
        setLoading(true);
        const checkedBugs: ICheckedCritterList = filterCritterList(critterList.bugs, state.caughtCritters.bugs);
        const checkedFish: ICheckedCritterList = filterCritterList(critterList.fish, state.caughtCritters.fish);

        const availableCritters: ICritterList = {
            bugs: checkedBugs.available,
            fish: checkedFish.available,
        };

        const upcomingCritters: ICritterList = {
            bugs: checkedBugs.upcoming,
            fish: checkedFish.upcoming,
        };

        setAvailableCritters(availableCritters);
        setUpcomingCritters(upcomingCritters);
        setLoading(false);
    };

    const availableBugs = availableCritters.bugs.sort(sortCritterList);
    const upcomingBugs = upcomingCritters.bugs.sort(sortCritterList);
    const allBugs = critterList.bugs
        .sort(sortCritterList)
        .filter((critter: ICritter) =>
            state.hideCaught ? state.caughtCritters.bugs.indexOf(critter.id) < 0 : critter,
        );
    const availableFish = availableCritters.fish.sort(sortCritterList);
    const upcomingFish = upcomingCritters.fish.sort(sortCritterList);
    const allFish = critterList.fish
        .sort(sortCritterList)
        .filter((critter: ICritter) =>
            state.hideCaught ? state.caughtCritters.fish.indexOf(critter.id) < 0 : critter,
        );

    if (!availableCritters.bugs.length && !availableCritters.fish.length) {
        filterCritterAvailability();
    }

    return loading ? (
        <div>Loading</div>
    ) : (
        <div>
            <ListSorter />
            <Checkbox
                label={'Hide caught critters'}
                isSelected={state.hideCaught}
                onCheckboxChange={() => store.dispatch(hideCaught(!state.hideCaught))}
            />
            <Checkbox
                label={'Show all critters'}
                isSelected={state.showAll}
                onCheckboxChange={() => store.dispatch(showAll(!state.showAll))}
            />
            {state.showAll ? (
                <>
                    <h1>All Bugs</h1>
                    <ul>
                        {allBugs.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.bug}
                                critter={critter}
                                key={`all_bug_${critter.id}`}
                            />
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h1>You can currently catch {availableCritters?.bugs.length} Bugs:</h1>
                    <ul>
                        {availableBugs.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.bug}
                                critter={critter}
                                key={`available_bug_${critter.id}`}
                            />
                        ))}
                    </ul>
                    <h1>You can catch {upcomingCritters.bugs.length} Bugs later today:</h1>
                    <ul>
                        {upcomingBugs.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.bug}
                                critter={critter}
                                key={`donated_bug_${critter.id}`}
                            />
                        ))}
                    </ul>
                </>
            )}
            {state.showAll ? (
                <>
                    <h1>All Fish</h1>
                    <ul>
                        {allFish.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.fish}
                                critter={critter}
                                key={`all_fish_${critter.id}`}
                            />
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h1>You can currently catch {availableCritters.fish.length} Fish:</h1>
                    <ul>
                        {availableFish.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.fish}
                                critter={critter}
                                key={`available_fish_${critter.id}`}
                            />
                        ))}
                    </ul>
                    <h1>You can catch {upcomingCritters.fish.length} Fish later today:</h1>
                    <ul>
                        {upcomingFish.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={critterType.fish}
                                critter={critter}
                                key={`donated_fish_${critter.id}`}
                            />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default MainApp;
