import { hemisphere } from '../model/Hemisphere';
import { filterCritters } from './CritterFilters';
import { ICritterState } from '../model/ICritterState';
import { sortType } from '../model/SortType';

it('sorting test', () => {
    const critterSet1: ICritterState = {caught: {bugs: [], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}}
    const critterSet2: ICritterState = {caught: {bugs: [10, 75], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}}
    const northResultAll = filterCritters(0, hemisphere.north, critterSet1, false, sortType.entryAsc, new Date('2020-07-13T10:00:00.0000'));
    const northResultCaughtHidden = filterCritters(0, hemisphere.north, critterSet2, true, sortType.entryAsc, new Date('2020-07-13T10:00:00.0000'));
    expect(northResultAll.available.bugs.length).toEqual(39);
    expect(northResultCaughtHidden.available.bugs.length).toEqual(37);
});