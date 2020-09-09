import React from 'react';
import { critterType } from '../model/CritterType';
import { hemisphere } from '../model/Hemisphere';
import { ICritter } from '../model/ICritter';
import { store, catchCritter, donateCritter } from '../reducers/appReducer';
import CritterThumbnail from './CritterThumbnail';
import CritterCalendar from './CritterCalendar';
import CritterTimes from './CritterTimes';
import { useSelector } from 'react-redux';
import { IAppState } from '../model/AppState';

interface ICritterEntryProps {
    typeOfCritter: critterType;
    critter: ICritter;
    isCaught: boolean;
    isDonated: boolean;
}

function CritterEntry(props: React.PropsWithChildren<ICritterEntryProps>) {
    const { typeOfCritter, critter, isCaught, isDonated } = props;

    const timeOffset: number = useSelector((state: IAppState) => state.timeOffset);
    const hemi: hemisphere | null = useSelector((state: IAppState) => state.hemisphere);

    let path = '';

    switch (typeOfCritter) {
        case critterType.bug: {
            path = 'bugs';
            break;
        }
        case critterType.fish: {
            path = 'fish';
            break;
        }
        case critterType.seaCreature: {
            path = 'seaCreatures';
            break;
        }
    }

    return (
        <li className={'critterEntry'}>
            <h2><span>{critter.name}</span></h2>
            <div className={'critterDetails'}>
                <div className={'critterThumb'}>
                    <CritterThumbnail path={`img/critters/${path}/${critter.thumbnail}`} name={critter.name} />
                </div>
                <ul className={'critterInfo'}>
                    <li>{critter.price} bells</li>
                    <li><CritterTimes availableTimes={critter.times} timeOffset={timeOffset} /></li>
                    <li><CritterCalendar availableMonths={hemi === hemisphere.south ? critter.southMonths : critter.northMonths} timeOffset={timeOffset} /></li>
                </ul>
            </div>
            <ul className={'actionButtons'}>
                <li onClick={() => store.dispatch(catchCritter({ critterId: critter.id, type: typeOfCritter }))}>
                    {isCaught ? 'Caught' : 'Not caught'}
                </li>
                <li onClick={() => store.dispatch(donateCritter({critterId: critter.id, type: typeOfCritter}))}>
                    {isDonated ? 'Donated' : 'Not donated'}
                </li>
            </ul>
        </li>
    );
}

export default CritterEntry;
