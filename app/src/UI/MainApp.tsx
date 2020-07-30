import React, { useState } from 'react';
import { filterCritters } from '../helpers/critterFilters';
import { critterType } from '../model/CritterType';
import { hemisphere } from '../model/Hemisphere';
import { ICritterList } from '../model/ICritterList';
import { ICritterState } from '../model/ICritterState';
import { mainAppView } from '../model/MainAppView';
import { sortType } from '../model/SortType';
import { store, hideCaught, showAll } from '../reducers/appReducer';
import Checkbox from './Checkbox';
import CritterSection from './CritterSection';
import ListSorter from './ListSorter';
import LoadingSpinner from './LoadingSpinner';
import SettingsButton from './SettingsButton';
import ViewSwitch from './ViewSwitch';

function MainApp() {
    const [loading, setLoading] = useState(true);
    const [allCritters, setAllCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);
    const [availableCritters, setAvailableCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);
    const [upcomingCritters, setUpcomingCritters] = useState({ bugs: [], fish: [], seaCreatures: [] } as ICritterList);

    const state = store.getState();

    store.subscribe(() => {
        const newState = store.getState();
        filterCritterAvailability(newState.timeOffset, newState.hemisphere || hemisphere.north, newState.critters, newState.hideCaught, newState.activeSort);
    });
  

    const filterCritterAvailability = (timeOffset: number, hemi: hemisphere, critters: ICritterState, hideCaught: boolean, sortBy: sortType) => {
        setLoading(true);

        const { all, available, upcoming } = filterCritters(timeOffset, hemi, critters, hideCaught, sortBy);

        setAllCritters(all);
        setAvailableCritters(available);
        setUpcomingCritters(upcoming);

        setLoading(false);
    };

    // call filterCritters on first run when availableCritters' properties are empty
    if (!availableCritters.bugs.length && !availableCritters.fish.length && !availableCritters.seaCreatures.length) {
        filterCritterAvailability(state.timeOffset, state.hemisphere || hemisphere.north, state.critters, state.hideCaught, state.activeSort);
    }

    return loading ? (
        <LoadingSpinner />
    ) : (
        <div className={'mainApp'}>
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
            <div className={'critterPaneHolder'}>
                <div className={`critterPane ${state.currentView === mainAppView.all || state.currentView === mainAppView.bugs ? 'viewableList' : 'hiddenList'}`}>
                    <CritterSection 
                        showAll={state.showAll} 
                        allCritters={allCritters.bugs} 
                        availableCritters={availableCritters.bugs} 
                        upcomingCritters={upcomingCritters.bugs} 
                        typeOfCritter={critterType.bug}
                    />
                </div>
                <div className={`critterPane ${state.currentView === mainAppView.all || state.currentView === mainAppView.fish ? 'viewableList' : 'hiddenList'}`}>
                    <CritterSection 
                        showAll={state.showAll} 
                        allCritters={allCritters.fish} 
                        availableCritters={availableCritters.fish} 
                        upcomingCritters={upcomingCritters.fish} 
                        typeOfCritter={critterType.fish}
                    />
                </div>
                <div className={`critterPane ${state.currentView === mainAppView.all || state.currentView === mainAppView.seaCreatures ? 'viewableList' : 'hiddenList'}`}>
                    <CritterSection 
                        showAll={state.showAll} 
                        allCritters={allCritters.seaCreatures} 
                        availableCritters={availableCritters.seaCreatures} 
                        upcomingCritters={upcomingCritters.seaCreatures} 
                        typeOfCritter={critterType.seaCreature}
                    />
                </div>
            </div>
            <div className={'viewSwitch'}>
                <ViewSwitch viewType={state.currentView} />
            </div>
        </div>
    );
}

export default MainApp;
