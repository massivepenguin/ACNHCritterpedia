import React from 'react';
import {ICritter} from '../model/ICritter';
import { IFish } from '../model/IFish';

interface ICritterEntry {
    critter: ICritter | IFish,
    collectFunction: (e: React.SyntheticEvent<HTMLElement>) => void;
    donateFunction: (e: React.SyntheticEvent<HTMLElement>) => void;
}

export class CritterEntry extends React.Component<ICritterEntry> {
    private isCritterFish = (toBeDetermined: ICritter | IFish): toBeDetermined is IFish => {
        if((toBeDetermined as IFish).size) {
            return true;
        }
        return false;
    }


    render () {
        return (
            <li className={'critterEntry'}>
                <ul>
                    <li>{this.props.critter.name}</li>
                </ul>
                <ul>
                    <li onClick={this.props.collectFunction} data-critter-name={this.props.critter.name} data-critter-type={this.isCritterFish(this.props.critter) ? 'fish' : 'bug'}>{this.props.critter.caught ? 'Caught' : 'Not caught'}</li>
                    <li onClick={this.props.donateFunction} data-critter-name={this.props.critter.name} data-critter-type={this.isCritterFish(this.props.critter) ? 'fish' : 'bug'}>{this.props.critter.donated ? 'Donated' : 'Not donated'}</li>
                </ul>
            </li>
        )
    }
}