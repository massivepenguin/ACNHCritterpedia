import React from 'react';
import {ICritter} from '../model/ICritter';

interface ICritterEntry {
    critterType: string,
    critterId: number,
    critter: ICritter,
    collectFunction: (e: React.SyntheticEvent<HTMLElement>) => void;
    donateFunction: (e: React.SyntheticEvent<HTMLElement>) => void;
}

export class CritterEntry extends React.Component<ICritterEntry> {
    render () {
        return (
            <li className={'critterEntry'}>
                <ul>
                    <li>{this.props.critter.name}</li>
                </ul>
                <ul>
                    <li onClick={this.props.collectFunction} data-critter-id={this.props.critterId}>{this.props.critter.caught ? 'Caught' : 'Not caught'}</li>
                    <li onClick={this.props.donateFunction} data-critter-id={this.props.critterId}>{this.props.critter.donated ? 'Donated' : 'Not donated'}</li>
                </ul>
            </li>
        )
    }
}