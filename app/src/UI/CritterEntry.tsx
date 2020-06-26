import React from 'react';
import {ICritter} from '../model/ICritter';
import { critterType } from '../model/CritterType';

interface ICritterEntry {
    critterType: critterType,
    critterId: number,
    critter: ICritter,
    caught: boolean | undefined,
    donated: boolean | undefined,
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
                    <li onClick={this.props.collectFunction} data-critter-type={this.props.critterType} data-critter-id={this.props.critterId}>{this.props.caught ? 'Caught' : 'Not caught'}</li>
                    <li onClick={this.props.donateFunction} data-critter-type={this.props.critterType} data-critter-id={this.props.critterId}>{this.props.donated ? 'Donated' : 'Not donated'}</li>
                </ul>
            </li>
        )
    }
}