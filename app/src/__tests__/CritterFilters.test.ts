import { hemisphere } from '../model/Hemisphere';
import { filterCritters, filterCritterList, sortCritterList } from '../helpers/critterFilters';
import { ICritterState } from '../model/ICritterState';
import { sortType } from '../model/SortType';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import seaCreatures from '../data/seaCreatures.json';

const blankCritterSet: ICritterState = {caught: {bugs: [], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}};
const caughtCritterSet: ICritterState = {caught: {bugs: [10, 75], fish: [], seaCreatures: []}, donated: {bugs: [], fish: [], seaCreatures: []}}



describe('check filtering step', () => {
    const bugResult = filterCritterList(0, hemisphere.north, false, bugs, [], new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const fishResult = filterCritterList(0, hemisphere.north, false, fish, [], new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const seaCreatureResult = filterCritterList(0, hemisphere.north, false, seaCreatures, [], new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    
    it('matches expected availability length for bugs', () => {
        expect(bugResult.available.length).toEqual(41);
    });
    it('matches expected upcoming availability length for bugs', () => {
        expect(bugResult.upcoming.length).toEqual(22);
    });
    it('matches expected availability length for fish', () => {
        expect(fishResult.available.length).toEqual(45);
    });
    it('matches expected upcoming availability length for fish', () => {
        expect(fishResult.upcoming.length).toEqual(15);
    });
    it('matches expected availability length for sea cretaures', () => {
        expect(seaCreatureResult.available.length).toEqual(17);
    });
    it('matches expected upcoming availability length for sea cretaures', () => {
        expect(seaCreatureResult.upcoming.length).toEqual(7);
    });
});

describe('check sorting step', () => {
    // these tests are expanded further down, so we ony test a limited amount here
    const bugAlphaAsc = sortCritterList(bugs, 0, sortType.alphaAsc, hemisphere.north, new Date());
    const bugAlphaDesc = sortCritterList(bugs, 0, sortType.alphaDesc, hemisphere.north, new Date());
    const fishValueAsc = sortCritterList(fish, 0, sortType.valueAsc, hemisphere.north, new Date());
    const fishValueDesc = sortCritterList(fish, 0, sortType.valueDesc, hemisphere.north, new Date());
    const seaCreaturesIndexAsc = sortCritterList(seaCreatures, 0, sortType.entryAsc, hemisphere.north, new Date());
    const seaCreaturesIndexDesc = sortCritterList(seaCreatures, 0, sortType.entryDesc, hemisphere.north, new Date());

    it('matches known values for bugs when sorted alphabetically (asc)', () => {
        expect(bugAlphaAsc[0].name).toBe('Agrias Butterfly');
        expect(bugAlphaAsc[bugAlphaAsc.length - 1].name).toBe('Yellow Butterfly');
    });
    it('matches known values for bugs when sorted alphabetically (desc)', () => {
        expect(bugAlphaDesc[0].name).toBe('Yellow Butterfly');
        expect(bugAlphaDesc[bugAlphaDesc.length - 1].name).toBe('Agrias Butterfly');
    });

    it('matches known values for fish when sorted by value (asc)', () => {
        expect(fishValueAsc[0].name).toBe('Tadpole');
        expect(fishValueAsc[fishValueAsc.length - 1].name).toBe('Coelacanth');
    });
    it('matches known values for fish when sorted by value (desc)', () => {
        expect(fishValueDesc[0].name).toBe('Coelacanth');
        expect(fishValueDesc[fishValueDesc.length - 1].name).toBe('Tadpole');
    });

    it('matches known values for sea creatures when sorted by Critterpedia index (asc)', () => {
        expect(seaCreaturesIndexAsc[0].name).toBe('Seaweed');
        expect(seaCreaturesIndexAsc[seaCreaturesIndexAsc.length - 1].name).toBe('Venus\' Flower Basket');
    });
    it('matches known values for sea creatures when sorted by Critterpedia index (desc)', () => {
        expect(seaCreaturesIndexDesc[0].name).toBe('Venus\' Flower Basket');
        expect(seaCreaturesIndexDesc[seaCreaturesIndexDesc.length - 1].name).toBe('Seaweed');
    });
});

describe('availability filtering', () => {
    const northResultAll = filterCritters(0, hemisphere.north, blankCritterSet, false, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const northResultCaughtHidden = filterCritters(0, hemisphere.north, caughtCritterSet, true, sortType.entryAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const southResultAll = filterCritters(0, hemisphere.south, blankCritterSet, false, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    
    it('matches expected availability length for bugs', () => {
        expect(northResultAll.available.bugs.length).toEqual(38);
    });
    it('matches availability length when caught critters are hidden', () =>{
        expect(northResultCaughtHidden.available.bugs.length).toEqual(36);
    });
    it('matches expected availability length for the southern hemisphere', () => {
        expect(southResultAll.available.bugs.length).toEqual(15);
        expect(southResultAll.available.fish.length).toEqual(24);
        expect(southResultAll.available.seaCreatures.length).toEqual(16);
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
        expect(indexDesc.all.seaCreatures[0].name).toEqual('Venus\' Flower Basket');
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
