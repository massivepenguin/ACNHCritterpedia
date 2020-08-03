import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import seaCreatures from '../data/seaCreatures.json';

describe('check data integrity', () => {
    it('matches known length of data', () => {
        expect(bugs && bugs.length).toBe(80);
        expect(fish && fish.length).toBe(80);
        expect(seaCreatures && seaCreatures.length).toBe(40);
    });
});
