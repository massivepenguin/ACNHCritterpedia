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
    const bugResult = filterCritterList(0, hemisphere.north, bugs, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const fishResult = filterCritterList(0, hemisphere.north, fish, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const seaCreatureResult = filterCritterList(0, hemisphere.north, seaCreatures, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    
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
    const northResultAll = filterCritters(0, hemisphere.north, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    const southResultAll = filterCritters(0, hemisphere.south, sortType.alphaAsc, new Date(2020, 6, 16, 10)); // 16th July 2020 10:00:00
    
    it('matches expected availability length for bugs', () => {
        expect(northResultAll.availableCritters.bugs.length).toEqual(38);
    });
    it('matches expected availability length for the southern hemisphere', () => {
        expect(southResultAll.availableCritters.bugs.length).toEqual(15);
        expect(southResultAll.availableCritters.fish.length).toEqual(24);
        expect(southResultAll.availableCritters.seaCreatures.length).toEqual(16);
    });
});


describe('alphabetical sorting test', () => {
   const alphaAsc = filterCritters(0, hemisphere.north, sortType.alphaAsc);
   const alphaDesc = filterCritters(0, hemisphere.north, sortType.alphaDesc);

   it('matches known values when critters are sorted alphabetically (ascending)', () => {
       expect(alphaAsc.allCritters.bugs[0].name).toEqual('Agrias Butterfly');
       expect(alphaAsc.allCritters.bugs[1].name).toEqual('Ant');
       expect(alphaAsc.allCritters.bugs[alphaAsc.allCritters.bugs.length - 1].name).toEqual('Yellow Butterfly');
   });
   it('matches known values wehn critters are sorted alphabetically (descending)', () => {
       expect(alphaDesc.allCritters.bugs[0].name).toEqual('Yellow Butterfly');
       expect(alphaDesc.allCritters.bugs[alphaDesc.allCritters.bugs.length - 1].name).toEqual('Agrias Butterfly');
   });
});

describe('index sorting test', () => {
    const indexAsc = filterCritters(0, hemisphere.north, sortType.entryAsc);
    const indexDesc = filterCritters(0, hemisphere.north, sortType.entryDesc);

    it('matches known values when critters are sorted by critterpedia index (ascending)', () => {
        expect(indexAsc.allCritters.fish[20].id).toEqual(21);
        expect(indexAsc.allCritters.seaCreatures[0].name).toEqual('Seaweed');
    });
    it('matches known values when critters are sorted by critterpedia index (decending)', () => {
        expect(indexDesc.allCritters.seaCreatures[indexDesc.allCritters.seaCreatures.length - 1].name).toEqual('Seaweed');
        expect(indexDesc.allCritters.seaCreatures[0].name).toEqual('Venus\' Flower Basket');
    });
});

describe('value sorting test', () => {
    const valueAsc = filterCritters(0, hemisphere.north, sortType.valueAsc);
    const valueDesc = filterCritters(0, hemisphere.north, sortType.valueDesc);

    it('matches known values when sorting by value, cheapest first ', () => {
        expect(valueAsc.allCritters.bugs[0].id).toEqual(31);
        expect(valueAsc.allCritters.bugs[0].price).toEqual(10);
        expect(valueAsc.allCritters.fish[valueAsc.allCritters.fish.length - 1].name).toEqual('Coelacanth');
        expect(valueAsc.allCritters.fish[valueAsc.allCritters.fish.length - 1].price).toEqual(15000);
    });
    it('matches known values when sorting by value, most expensive first ', () => {
        expect(valueDesc.allCritters.seaCreatures[0].id).toEqual(18);
        expect(valueDesc.allCritters.seaCreatures[0].price).toEqual(15000);
        expect(valueDesc.allCritters.seaCreatures[valueDesc.allCritters.seaCreatures.length - 1].name).toEqual('Sea Anemone');
        expect(valueDesc.allCritters.seaCreatures[valueDesc.allCritters.seaCreatures.length - 1].price).toEqual(500);
    });
});

describe('remaining (today) sorting test', () => {
    const todayAsc = filterCritters(0, hemisphere.north, sortType.todayAsc, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const todayDesc = filterCritters(0, hemisphere.north, sortType.todayDesc, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM

    it('matches known values when sorting by time remaining today (shortest first)', () => {
        expect(todayAsc.availableCritters.bugs[0].name).toBe('Queen Alexandra\'s Birdwing');
    });
    it('matches known values when sorting by time remaining today (longest first)', () => {
        expect(todayDesc.availableCritters.bugs[0].name).toBe('Saw Stag');
    });
});

describe('remaining (year) sorting test', () => {
    const yearAsc = filterCritters(0, hemisphere.north, sortType.yearAsc, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM
    const yearDesc = filterCritters(0, hemisphere.north, sortType.yearDesc, new Date(2020, 7, 3, 13)); // 3rd August 2020 1PM

    it('matches known values when sorting by time remaining today (shortest first)', () => {
        expect(yearAsc.availableCritters.bugs[0].name).toBe('Blue Weevil Beetle');
    });
    it('matches known values when sorting by time remaining today (longest first)', () => {
        expect(yearDesc.availableCritters.bugs[0].name).toBe('Fly');
    });
});
