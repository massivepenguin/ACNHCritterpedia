import React, { useState } from 'react';
import { store, hideCaught, showAll } from '../reducers/AppReducer';
import { ICritterList } from '../model/ICritterList';
import { critterType } from '../model/CritterType';
import { filterCritters } from '../helpers/CritterFilters';
import ListSorter from './ListSorter';
import Checkbox from './Checkbox';
import SettingsButton from './SettingsButton';
import CritterSection from './CritterSection';
import LoadingSpinner from './LoadingSpinner';

function MainApp() {
    const [loading, setLoading] = useState(true);
    const [allCritters, setAllCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);
    const [availableCritters, setAvailableCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);
    const [upcomingCritters, setUpcomingCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);

    const state = store.getState();

    store.subscribe(() => {
        filterCritterAvailability();
    });
  

    const filterCritterAvailability = () => {
        setLoading(true);

        const { all, available, upcoming } = filterCritters();

        setAllCritters(all);
        setAvailableCritters(available);
        setUpcomingCritters(upcoming);

        setLoading(false);
    };

    // call filterCritters on first run when availableCritters' properties are empty
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
