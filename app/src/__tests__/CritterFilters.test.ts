import { hemisphere } from '../model/Hemisphere';
import { filterCritters } from '../helpers/CritterFilters';
import { ICritterState } from '../model/ICritterState';
import { sortType } from '../model/SortType';

const blankCritterSet: ICritterState = {caught: {bugs: [], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}};
const caughtCritterSet: ICritterState = {caught: {bugs: [10, 75], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}}

describe('availability filtering', () => {
    const northResultAll = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const northResultCaughtHidden = filterCritters(0, hemisphere.north, caughtCritterSet, true, sortType.entryAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const southResultAll = filterCritters(0, hemisphere.south, blankCritterSet, false, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    
    it('matches expected availability length for bugs', () => {
        expect(northResultAll.available.bugs.length).toEqual(39);
    });
    it('matches availability length when caught critters are hidden', () =>{
        expect(northResultCaughtHidden.available.bugs.length).toEqual(37);
    });
    it('matches expected availability length for the southern hemisphere', () => {
        expect(southResultAll.available.bugs.length).toEqual(15);
        expect(southResultAll.available.fish.length).toEqual(24);
        expect(southResultAll.available.seaCreatures.length).toEqual(17);
    });
});


describe('alphabetical sorting test', () => {
   const alphaAsc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.alphaAsc);
   const alphaDesc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.alphaDesc);

   it('matches known values when critters are sorted alphabetically (ascending)', () => {
       expect(alphaAsc.all.bugs[0].name).toEqual('Agrias Butterfly');
       expect(alphaAsc.all.bugs[1].name).toEqual('Ant');
       expect(alphaAsc.all.bugs[alphaAsc.all.bugs.length - 1].name).toEqual('Yellow Butterfly');
   });
   it('matches known values wehn critters are sorted alphabetically (descending)', () => {
       expect(alphaDesc.all.bugs[0].name).toEqual('Yellow Butterfly');
       expect(alphaDesc.all.bugs[alphaDesc.all.bugs.length - 1].name).toEqual('Agrias Butterfly');
   });
});

describe('index sorting test', () => {
    const indexAsc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.entryAsc);
    const indexDesc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.entryDesc);

    it('matches known values when critters are sorted by critterpedia index (ascending)', () => {
        expect(indexAsc.all.fish[20].id).toEqual(21);
        expect(indexAsc.all.seaCreatures[0].name).toEqual('Seaweed');
    });
    it('matches known values when critters are sorted by critterpedia index (decending)', () => {
        expect(indexDesc.all.seaCreatures[indexDesc.all.seaCreatures.length - 1].name).toEqual('Seaweed');
        expect(indexDesc.all.seaCreatures[0].name).toEqual('Venus\' flower basket');
    });
});

describe('value sorting test', () => {
    const valueAsc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.valueAsc);
    const valueDesc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.valueDesc);

    it('matches known values when sorting by value, cheapest first ', () => {
        expect(valueAsc.all.bugs[0].id).toEqual(31);
        expect(valueAsc.all.bugs[0].price).toEqual(10);
        expect(valueAsc.all.fish[valueAsc.all.fish.length - 1].name).toEqual('Coelacanth');
        expect(valueAsc.all.fish[valueAsc.all.fish.length - 1].price).toEqual(15000);
    });
    it('matches known values when sorting by value, most expensive first ', () => {
        expect(valueDesc.all.seaCreatures[0].id).toEqual(18);
        expect(valueDesc.all.seaCreatures[0].price).toEqual(15000);
        expect(valueDesc.all.seaCreatures[valueDesc.all.seaCreatures.length - 1].name).toEqual('Sea Anemone');
        expect(valueDesc.all.seaCreatures[valueDesc.all.seaCreatures.length - 1].price).toEqual(500);
    });
});

describe('remaining (today) sorting test', () => {
    // TODO: add tests
    const todayAsc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.todayAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const todayDesc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.todayDesc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
});

describe('remaining (year) sorting test', () => {
    // TODO: add tests
    const yearAsc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.yearAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const yearDesc = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.yearDesc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
});
