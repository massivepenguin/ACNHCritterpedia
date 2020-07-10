import { ICritterIdList } from './ICritterIdList';
import { mainAppView } from './MainAppView';
import { sortType } from './SortType';
import { hemisphere } from './Hemisphere';
import { ICritterState } from './ICritterState';

export interface IAppState {
    currentView: mainAppView;
    critters: ICritterState;
    activeSort: sortType;
    timeOffset: number;
    hemisphere: null | hemisphere;
    hideCaught: boolean;
    showAll: boolean;
}

// used for cloning correct state into out-of-date data
export const AppState: IAppState = {
    currentView: mainAppView.all,
    critters: {
        caught: { bugs: [], fish: [], seaCreatures: [] } as ICritterIdList,
        donated: { bugs: [], fish: [], seaCreatures: [] } as ICritterIdList,
    },
    activeSort: sortType.entryAsc,
    timeOffset: 0,
    hemisphere: null,
    hideCaught: false,
    showAll: false,
};

// comparator function to ensure that saved states match the current data shape
export const instanceOfAppState = (object: any): object is IAppState => {
    return 'currentView' in object
    && 'critters' in object
    && 'caught' in object['critters']
    && 'bugs' in object['critters']['caught']
    && 'fish' in object['critters']['caught']
    && 'seaCreatures' in object['critters']['caught']
    && 'donated' in object['critters']
    && 'bugs' in object['critters']['donated']
    && 'fish' in object['critters']['donated']
    && 'seaCreatures' in object['critters']['donated']
    && 'activeSort' in object
    && 'timeOffset' in object
    && 'hemisphere' in object
    && 'hideCaught' in object
    && 'showAll' in object;
}
