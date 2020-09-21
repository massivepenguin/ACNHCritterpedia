import React, { useState, useEffect } from 'react';
import { filterCritters } from '../helpers/critterFilters';
import { critterType } from '../model/CritterType';
import { mainAppView } from '../model/MainAppView';
import { store, changeHideCaught, changeShowAll } from '../reducers/appReducer';
import Checkbox from './Checkbox';
import CritterSection from './CritterSection';
import ListSorter from './ListSorter';
import SettingsButton from './SettingsButton';
import ViewSwitch from './ViewSwitch';
import { IAppState } from '../model/AppState';
import { useSelector } from 'react-redux';
import { ICritterList } from '../model/ICritterList';
import LoadingSpinner from './LoadingSpinner';

const MainApp = () => {

    const timeOffset = useSelector((state: IAppState) => state.timeOffset);
    const hemisphere = useSelector((state: IAppState) => state.hemisphere);
    const hideCaught = useSelector((state: IAppState) => state.hideCaught);
    const activeSort = useSelector((state: IAppState) => state.activeSort);
    const showAll = useSelector((state: IAppState) => state.showAll);
    const currentView = useSelector((state: IAppState) => state.currentView);
    
    const emptyCritterList: ICritterList = {bugs: [], fish: [], seaCreatures: []};

    const [loading, setLoading] = useState(true);
    const [all, setAllCritters] = useState(emptyCritterList);
    const [available, setAvailableCritters] = useState(emptyCritterList);
    const [upcoming, setUpcomingCritters] = useState(emptyCritterList);

    // only run the filtering step if something changes that will have a material effect on the list of critters
    useEffect(() => {
        setLoading(true);
        const {allCritters, availableCritters, upcomingCritters} = filterCritters(timeOffset, hemisphere!, activeSort);
        setAllCritters(allCritters);
        setAvailableCritters(availableCritters);
        setUpcomingCritters(upcomingCritters);
        setLoading(false);
    }, [timeOffset, hemisphere, hideCaught, activeSort, showAll, currentView]);

    return (loading ? <LoadingSpinner /> : <div className={'mainApp'}>
        <div className={'controls'}>
            <ListSorter />
            <Checkbox
                label={'Hide caught critters'}
                isSelected={hideCaught}
                onCheckboxChange={() => store.dispatch(changeHideCaught(!hideCaught))}
            />
            <Checkbox
                label={'Show all critters'}
                isSelected={showAll}
                onCheckboxChange={() => store.dispatch(changeShowAll(!showAll))}
            />
            <SettingsButton />
        </div>
        <div className={'critterPaneHolder'}>
            <div className={`critterPane ${currentView === mainAppView.all || currentView === mainAppView.bugs ? 'viewableList' : 'hiddenList'}`}>
                <CritterSection 
                    showAll={showAll} 
                    allCritters={all.bugs} 
                    availableCritters={available.bugs} 
                    upcomingCritters={upcoming.bugs} 
                    typeOfCritter={critterType.bug}
                />
            </div>
            <div className={`critterPane ${currentView === mainAppView.all || currentView === mainAppView.fish ? 'viewableList' : 'hiddenList'}`}>
                <CritterSection 
                    showAll={showAll} 
                    allCritters={all.fish} 
                    availableCritters={available.fish} 
                    upcomingCritters={upcoming.fish} 
                    typeOfCritter={critterType.fish}
                />
            </div>
            <div className={`critterPane ${currentView === mainAppView.all || currentView === mainAppView.seaCreatures ? 'viewableList' : 'hiddenList'}`}>
                <CritterSection 
                    showAll={showAll} 
                    allCritters={all.seaCreatures} 
                    availableCritters={available.seaCreatures} 
                    upcomingCritters={upcoming.seaCreatures} 
                    typeOfCritter={critterType.seaCreature}
                />
            </div>
        </div>
        <div className={'viewSwitch'}>
            <ViewSwitch viewType={currentView} />
        </div>
    </div>);
}

export default MainApp;
