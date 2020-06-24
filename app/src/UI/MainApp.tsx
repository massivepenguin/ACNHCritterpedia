import React from 'react';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import { ITimeSpan } from '../model/ITimeSpan';
import { IFish } from '../model/IFish';
import { CritterEntry} from './CritterEntry';


interface IMainApp {
    hemisphere: string;
    critterList: ICritterList;
    updateCritterList: (critterList: ICritterList) => void;
}

const initialState = {
    currentView: 'all',
    filteredCritters: undefined as undefined | ICritterList,
    loading: true,
}

export class MainApp extends React.Component<IMainApp, typeof initialState> {
    public state = initialState;

    public componentDidMount() {
        // initialise the critter list if it's blank
        if(!this.props.critterList) {
            this.createCritterList();
        } else {
            this.filterCritterAvailability(this.props.critterList);
        }
    }

    public componentDidUpdate(prevProps: IMainApp) {
        if(prevProps.critterList !== this.props.critterList) {
            this.filterCritterAvailability(this.props.critterList);
        }
    }

    private async filterCritterAvailability(critterList: ICritterList) {
        this.setState({
            loading: true,
        });
        const currentMonth = new Date().getMonth();
        const currentTime = new Date().getTime();
        critterList.bugs.map((critter: ICritter) => {
            const monthsCritterAppears = this.props.hemisphere === 'north' ? critter.northMonths : critter.southMonths;
            if(monthsCritterAppears.indexOf(currentMonth) > -1) {
                return critter;
            }
            return false;
        });
        critterList.fish.map((critter: IFish) => {
            const monthsCritterAppears = this.props.hemisphere === 'north' ? critter.northMonths : critter.southMonths;
            if(monthsCritterAppears.indexOf(currentMonth) > -1) {
                return critter;
            }
            return false;
        });

        this.setState({
            filteredCritters: critterList,
            loading: false,
        });
    }

    private createCritterList = async() => {
        console.log("init");
      const sourceBugList = bugs;
      const critterList: ICritterList = { bugs: [], fish: []};
      for(const bug of sourceBugList) {
        critterList.bugs.push({...bug, times: bug.times as ITimeSpan[], caught: false, donated: false});
      }
      const sourceFishList = fish;
      for(const fish of sourceFishList) {
        critterList.fish.push({...fish, times: fish.times as ITimeSpan[], caught: false, donated: false});
      }
      this.props.updateCritterList(critterList);
    }

    public catchCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        const critterName = e.currentTarget.getAttribute('data-critter-name');
        const critterType = e.currentTarget.getAttribute('data-critter-type');
        const critterList: ICritterList = {bugs: [], fish: []};
        switch(critterType) {
            case 'bug': {
                for(const bug of this.props.critterList.bugs) {
                    if(bug.name === critterName) {
                        critterList.bugs.push({...bug, caught: !bug.caught});
                    } else {
                        critterList.bugs.push(bug);
                    }
                }
                break;
            }
            case 'fish': {
                for(const fish of this.props.critterList.fish) {
                    if(fish.name === critterName) {
                        critterList.fish.push({...fish, caught: !fish.caught});
                    } else {
                        critterList.fish.push(fish);
                    }
                }
                break;
            }
        }
        console.log(critterList);
        this.props.updateCritterList(critterList);
    }
    
    public donateCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        const critterName = e.currentTarget.getAttribute('data-critter-name');
        const critterType = e.currentTarget.getAttribute('data-critter-type');
        const critterList: ICritterList = {bugs: [], fish: []};
        switch(critterType) {
            case 'bug': {
                for(const bug of this.props.critterList.bugs) {
                    if(bug.name === critterName) {
                        critterList.bugs.push({...bug, caught: !bug.donated ? true : bug.caught, donated: !bug.donated});
                    } else {
                        critterList.bugs.push(bug);
                    }
                }
                break;
            }
            case 'fish': {
                for(const fish of this.props.critterList.fish) {
                    if(fish.name === critterName) {
                        critterList.fish.push({...fish, caught: !fish.donated ? true : fish.caught, donated: !fish.donated});
                    } else {
                        critterList.fish.push(fish);
                    }
                }
                break;
            }
        }
        this.props.updateCritterList(critterList);
    }

    render() {
        const { loading } = this.state;
        return (
            loading ? <div>Loading</div> 
            : <div><h1>What can I catch right now?</h1><ul>{
                this.state.filteredCritters?.bugs.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critter={bug} key={bug.name} /> )
                }</ul></div>
        );
    }
}