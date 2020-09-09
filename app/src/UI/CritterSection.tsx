import React from 'react';
import { ICritter } from '../model/ICritter';
import { critterType, critterTypeValues } from '../model/CritterType';
import CritterEntry from './CritterEntry';
import { useSelector } from 'react-redux';
import { IAppState } from '../model/AppState';

interface ICritterSection {
    showAll: boolean;
    allCritters: ICritter[],
    availableCritters: ICritter[],
    upcomingCritters: ICritter[],
    typeOfCritter: critterType,
}

const CritterSection = (props: React.PropsWithChildren<ICritterSection>): JSX.Element => {
    
    const { showAll, allCritters, availableCritters, upcomingCritters, typeOfCritter } = props;

    const hideCaught = useSelector((state: IAppState) => state.hideCaught);
    const caughtBugs = useSelector((state: IAppState) => state.critters.caught.bugs);
    const donatedBugs = useSelector((state: IAppState) => state.critters.donated.bugs);
    const caughtFish = useSelector((state: IAppState) => state.critters.caught.fish);
    const donatedFish = useSelector((state: IAppState) => state.critters.donated.fish);
    const caughtSeaCreatures = useSelector((state: IAppState) => state.critters.caught.seaCreatures);
    const donatedSeaCreatures = useSelector((state: IAppState) => state.critters.donated.seaCreatures);

    let caughtArray: number[];
    let donatedArray: number[];

    switch(props.typeOfCritter) {
        case critterType.bug:
            caughtArray = caughtBugs;
            donatedArray = donatedBugs;
            break;
        case critterType.fish:
            caughtArray = caughtFish;
            donatedArray = donatedFish;
            break;
        case critterType.seaCreature:
            caughtArray = caughtSeaCreatures;
            donatedArray = donatedSeaCreatures;
            break;
    }

    const critterName: string = critterTypeValues[typeOfCritter];
    const critterNamePlural: string = critterName !== 'Fish' ? critterName + 's' : critterName;

    const displayCritter = (critter: ICritter, key: string): JSX.Element | null => {
        const isCaught = caughtArray.indexOf(critter.id) > -1;
        const isDonated = donatedArray.indexOf(critter.id) > -1;
        return hideCaught && isCaught ? null :
            <CritterEntry
                typeOfCritter={typeOfCritter}
                critter={critter}
                isCaught={isCaught}
                isDonated={isDonated}
                key={`${key}_${critterNamePlural.toLowerCase().replace(' ', '_')}_${critter.id}`}
            />
    }

    if(showAll) {
        return (
            <div className={'critterSection'}>
                <h1>All {critterNamePlural}</h1>
                    <ul className={'critterList'}>
                        {
                            allCritters.map((critter: ICritter) => {
                                return displayCritter(critter, 'all');
                            })
                        }
                    </ul>
            </div>
        )
    }

    return (
        <div className={'critterSection'}>
            <h1>You can currently catch {availableCritters.length} {availableCritters.length !== 1 ? critterNamePlural : critterName}:</h1>
            <ul className={'critterList'}>
                {
                    availableCritters.map((critter: ICritter) => {
                        return displayCritter(critter, 'available');
                    })
                }
            </ul>
            <h1>You can catch {upcomingCritters.length} {upcomingCritters.length !== 1 ? critterNamePlural : critterName} later today:</h1>
            <ul className={'critterList'}>
                {
                    upcomingCritters.map((critter: ICritter) => {
                        return displayCritter(critter, 'upcoming');
                    })
                }
            </ul>
        </div>
    )
}

export default CritterSection;
