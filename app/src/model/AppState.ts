import { ICritterIdList } from './ICritterIdList';
import { mainAppView } from './MainAppView';
import { filterType } from './FilterTypes';
import { hemisphere } from './Hemisphere';

export interface IAppState {
    currentView: mainAppView;
    caughtCritters: ICritterIdList;
    donatedCritters: ICritterIdList;
    activeFilter: filterType;
    timeOffset: number;
    hemisphere: null | hemisphere;
    hideCaught: boolean;
    showAll: boolean;
}

// used for cloning correct state into out-of-date data
export const AppState: IAppState = {
    currentView: mainAppView.all,
    caughtCritters: { bugs: [], fish: [], seaCreatures: [] } as ICritterIdList,
    donatedCritters: { bugs: [], fish: [], seaCreatures: [] } as ICritterIdList,
    activeFilter: filterType.entryAsc,
    timeOffset: 0,
    hemisphere: null,
    hideCaught: false,
    showAll: false,
};

// comparator function to ensure that saved states match the current data shape
export const instanceOfAppState = (object: any): object is IAppState => {
    return 'currentView' in object
    && 'caughtCritters' in object
    && 'bugs' in object['caughtCritters']
    && 'fish' in object['caughtCritters']
    && 'seaCreatures' in object['caughtCritters']
    && 'donatedCritters' in object
    && 'bugs' in object['donatedCritters']
    && 'fish' in object['donatedCritters']
    && 'seaCreatures' in object['donatedCritters']
    && 'activeFilter' in object
    && 'timeOffset' in object
    && 'hemisphere' in object
    && 'hideCaught' in object
    && 'showAll' in object;
}
