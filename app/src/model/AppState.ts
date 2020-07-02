import { ICritterIdList } from "./ICritterIdList";
import { mainAppView } from "./MainAppView";
import { filterType } from "./FilterTypes";
import { hemisphere } from "./Hemisphere";

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

export const AppState: IAppState = {
    currentView: mainAppView.all,
    caughtCritters: {bugs: [], fish: []} as ICritterIdList,
    donatedCritters: {bugs: [], fish: []} as ICritterIdList,
    activeFilter: filterType.entryAsc,
    timeOffset: 0,
    hemisphere: null,
    hideCaught: false,
    showAll: false,
}
