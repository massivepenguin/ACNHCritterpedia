import React from 'react';
import { ICritter } from '../model/ICritter';
import { critterType, critterTypeValues } from '../model/CritterType';
import CritterEntry from './CritterEntry';

interface ICritterSection {
    showAll: boolean;
    allCritters: ICritter[],
    availableCritters: ICritter[],
    upcomingCritters: ICritter[],
    typeOfCritter: critterType,
}

function CritterSection(props: React.PropsWithChildren<ICritterSection>) {
    const { showAll, allCritters, availableCritters, upcomingCritters, typeOfCritter } = props;

    const critterName: string = critterTypeValues[typeOfCritter];
    const critterNamePlural: string = critterName !== 'Fish' ? critterName + 's' : critterName;

    if(showAll) {
        return (
            <div className={'critter-section'}>
                <h1>All {critterNamePlural}</h1>
                    <ul>
                        {allCritters.map((critter: ICritter) => (
                            <CritterEntry
                                typeOfCritter={typeOfCritter}
                                critter={critter}
                                key={`all_${critterNamePlural.toLowerCase().replace(' ', '_')}_${critter.id}`}
                            />
                        ))}
                    </ul>
            </div>
        )
    }

    return (
        <div className={'critter-section'}>
            <h1>You can currently catch {availableCritters.length} {availableCritters.length !== 1 ? critterNamePlural : critterName}:</h1>
            <ul>
                {availableCritters.map((critter: ICritter) => (
                    <CritterEntry
                        typeOfCritter={typeOfCritter}
                        critter={critter}
                        key={`available_${critterNamePlural.toLowerCase().replace(' ', '_')}_${critter.id}`}
                    />
                ))}
            </ul>
                <h1>You can catch {upcomingCritters.length} {upcomingCritters.length !== 1 ? critterNamePlural : critterName} later today:</h1>
            <ul>
                {upcomingCritters.map((critter: ICritter) => (
                    <CritterEntry
                        typeOfCritter={typeOfCritter}
                        critter={critter}
                        key={`donated_${critterNamePlural.toLowerCase().replace(' ', '_')}_${critter.id}`}
                    />
                ))}
            </ul>
        </div>
    )
}

export default CritterSection;
