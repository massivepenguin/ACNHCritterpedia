import React, { useState } from 'react';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import seaCreatures from '../data/seaCreatures.json';
import { store, hideCaught, showAll } from '../reducers/AppReducer';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import { critterType } from '../model/CritterType';
import { ICheckedCritterList } from '../model/ICheckedCritterList';
import { filterCritterList, sortCritterList } from '../helpers/CritterFilters';
import ListSorter from './ListSorter';
import Checkbox from './Checkbox';
import SettingsButton from './SettingsButton';
import CritterSection from './CritterSection';
import LoadingSpinner from './LoadingSpinner';
import { filterValues } from '../model/FilterTypes';

const critterList: ICritterList = { bugs: bugs, fish: fish, seaCreatures: seaCreatures } as ICritterList;

function MainApp() {
    const [loading, setLoading] = useState(true);
    const [availableCritters, setAvailableCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);
    const [upcomingCritters, setUpcomingCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);

    const state = store.getState();

    store.subscribe(() => {
        filterCritterAvailability();
    });

    const filterCritterAvailability = () => {
        setLoading(true);
        const checkedBugs: ICheckedCritterList = filterCritterList(critterList.bugs, state.caughtCritters.bugs);
        const checkedFish: ICheckedCritterList = filterCritterList(critterList.fish, state.caughtCritters.fish);
        const checkedSeaCreatures: ICheckedCritterList = filterCritterList(critterList.seaCreatures, state.caughtCritters.seaCreatures);

        console.log(filterValues[state.activeFilter]);
        console.log(checkedBugs.available);

        const availableCritters: ICritterList = {
            bugs: checkedBugs.available.sort(sortCritterList),
            fish: checkedFish.available.sort(sortCritterList),
            seaCreatures: checkedSeaCreatures.available.sort(sortCritterList)
        };

        console.log(availableCritters.bugs);

        const upcomingCritters: ICritterList = {
            bugs: checkedBugs.upcoming.sort(sortCritterList),
            fish: checkedFish.upcoming.sort(sortCritterList),
            seaCreatures: checkedSeaCreatures.upcoming.sort(sortCritterList)
        };

        setAvailableCritters(availableCritters);
        setUpcomingCritters(upcomingCritters);
        setLoading(false);
    };

    const allCritters: ICritterList = {
        bugs: critterList.bugs.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.caughtCritters.bugs.indexOf(critter.id) < 0 : critter,
        ),
        fish: critterList.fish.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.caughtCritters.fish.indexOf(critter.id) < 0 : critter,
        ),
        seaCreatures: critterList.seaCreatures.sort(sortCritterList)
        .filter((critter: ICritter) =>
        state.hideCaught ? state.caughtCritters.seaCreatures.indexOf(critter.id) < 0 : critter,
        )
    };

    if (!availableCritters.bugs.length && !availableCritters.fish.length && !availableCritters.seaCreatures.length) {
        filterCritterAvailability();
    }

    return loading ? (
        <LoadingSpinner />
    ) : (
        <div>
            <div className={'controls'}>
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
                <SettingsButton />
            </div>
            <CritterSection showAll={state.showAll} allCritters={allCritters.bugs} availableCritters={availableCritters.bugs} upcomingCritters={upcomingCritters.bugs} typeOfCritter={critterType.bug} />
            <CritterSection showAll={state.showAll} allCritters={allCritters.fish} availableCritters={availableCritters.fish} upcomingCritters={upcomingCritters.fish} typeOfCritter={critterType.fish} />
            <CritterSection showAll={state.showAll} allCritters={allCritters.seaCreatures} availableCritters={availableCritters.seaCreatures} upcomingCritters={upcomingCritters.seaCreatures} typeOfCritter={critterType.seaCreature} />
        </div>
    );
}

export default MainApp;
