import React from 'react';
import {ICritter} from '../model/ICritter';
import { critterType } from '../model/CritterType';
import { store, catchCritter, donateCritter } from '../reducers/appReducer';

interface ICritterEntryProps {
    typeOfCritter: critterType;
    critter: ICritter;
 }

function CritterEntry(props: React.PropsWithChildren<ICritterEntryProps>) {
    const {typeOfCritter, critter} = props;

    const critterId = critter.id;

    const state = store.getState();

    let caughtSource: number[] = [];
    let donatedSource: number[] = [];

    switch(typeOfCritter) {
        case critterType.bug: {
            caughtSource = state.caughtCritters.bugs;
            donatedSource = state.donatedCritters.bugs;
            break;
        }
        case critterType.fish: {
            caughtSource = state.caughtCritters.fish;
            donatedSource = state.donatedCritters.fish;
        }
    }

    const caught = caughtSource.indexOf(critterId) > -1;
    const donated = donatedSource.indexOf(critterId) > -1;

    const donateCritterCatchCheck = () => {
        // special case - we need to 'catch' the critter if we haven't done so already when donating it
        let caughtArray: number[] = [];
        let donatedArray: number[] = [];
        switch(typeOfCritter) {
            case critterType.bug: {
                caughtArray = state.caughtCritters.bugs;
                donatedArray = state.donatedCritters.bugs;
                break;
            }
            case critterType.fish: {
                caughtArray = state.caughtCritters.fish;
                donatedArray = state.donatedCritters.fish;
                break;
            }
        }
        if(caughtArray.indexOf(critterId) < 0 && donatedArray.indexOf(critterId) < 0) {
            store.dispatch(catchCritter({critterId: critterId, type: typeOfCritter}));
        }
        store.dispatch(donateCritter({critterId: critterId, type: typeOfCritter}));
    }

    return (
        <li className={'critterEntry'}>
            <ul>
                <li>{critter.name}</li>
                <li>{critter.price} bells</li>
            </ul>
            <ul>
                <li onClick={() => store.dispatch(catchCritter({critterId: critterId, type: typeOfCritter}))}>{caught ? 'Caught' : 'Not caught'}</li>
                <li onClick={donateCritterCatchCheck}>{donated ? 'Donated' : 'Not donated'}</li>
            </ul>
        </li>
    );
}

export default CritterEntry;