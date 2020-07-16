import React from 'react';
import { ICritter } from '../model/ICritter';
import { critterType } from '../model/CritterType';
import { store, catchCritter, donateCritter } from '../reducers/AppReducer';
import CritterThumbnail from './CritterThumbnail';
import CritterCalendar from './CritterCalendar';
import CritterTimes from './CritterTimes';
import { hemisphere } from '../model/Hemisphere';

interface ICritterEntryProps {
    typeOfCritter: critterType;
    critter: ICritter;
}

function CritterEntry(props: React.PropsWithChildren<ICritterEntryProps>) {
    const { typeOfCritter, critter } = props;

    const state = store.getState();

    let caughtSource: number[] = [];
    let donatedSource: number[] = [];
    let path = '';

    switch (typeOfCritter) {
        case critterType.bug: {
            caughtSource = state.critters.caught.bugs;
            donatedSource = state.critters.donated.bugs;
            path = 'bugs';
            break;
        }
        case critterType.fish: {
            caughtSource = state.critters.caught.fish;
            donatedSource = state.critters.donated.fish;
            path = 'fish';
            break;
        }
        case critterType.seaCreature: {
            caughtSource = state.critters.caught.seaCreatures;
            donatedSource = state.critters.donated.seaCreatures;
            path = 'seaCreatures';
            break;
        }
    }

    const caught = caughtSource.indexOf(critter.id) > -1;
    const donated = donatedSource.indexOf(critter.id) > -1;

    return (
        <li className={'critterEntry'}>
            <ul>
                <li><CritterThumbnail path={`img/critters/${path}/${critter.thumbnail}`} name={critter.name} /></li>
                <li>{critter.name}</li>
                <li>{critter.price} bells</li>
                <li><CritterTimes availableTimes={critter.times} timeOffset={state.timeOffset} /></li>
                <li><CritterCalendar availableMonths={state.hemisphere === hemisphere.south ? critter.southMonths : critter.northMonths} timeOffset={state.timeOffset} /></li>
            </ul>
            <ul>
                <li onClick={() => store.dispatch(catchCritter({ critterId: critter.id, type: typeOfCritter }))}>
                    {caught ? 'Caught' : 'Not caught'}
                </li>
                <li onClick={() => store.dispatch(donateCritter({critterId: critter.id, type: typeOfCritter}))}>
                    {donated ? 'Donated' : 'Not donated'}
                </li>
            </ul>
        </li>
    );
}

export default CritterEntry;
