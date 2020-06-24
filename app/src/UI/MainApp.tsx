import React from 'react';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import { ITimeSpan } from '../model/ITimeSpan';
import { CritterEntry } from './CritterEntry';

interface IMainApp {
    hemisphere: string;
    critterList: ICritterList;
    updateCritterList: (critterList: ICritterList) => void;
}

const initialState = {
    currentView: 'all',
    availableCritters: undefined as undefined | ICritterList,
    upcomingCritters: undefined as undefined | ICritterList,
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

    private filterCritterList = (critterList: ICritter[], upcomingOnly: boolean = false): ICritter[] => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // the months in the json files are not zero-indexed
        const availableCritters = critterList.filter((critter: ICritter) => {
            const monthsCritterAppears = this.props.hemisphere === 'north' ? critter.northMonths : critter.southMonths;
            if(monthsCritterAppears.indexOf(currentMonth) > -1) {
                // check if the critter is available at this moment in time
                for(const timeRange of critter.times) {
                    const startTime = new Date(timeRange.startTime);
                    const endTime = new Date(timeRange.endTime);
                    const startDate = new Date();
                    startDate.setHours(startTime.getHours());
                    startDate.setMinutes(startTime.getMinutes());
                    startDate.setSeconds(startTime.getSeconds());
                    startTime.setDate(currentDate.getDate());
                    const endDate = new Date();
                    endDate.setHours(endTime.getHours());
                    endDate.setMinutes(endTime.getMinutes());
                    endDate.setSeconds(endTime.getSeconds());
                    if(startDate.getHours() > endDate.getHours()) {
                        endDate.setDate(endDate.getDate() + 1);
                    }
                    console.log(critter.name, currentDate, startDate, endDate);
                    if(!upcomingOnly) {
                        if(startDate <= currentDate && endDate >= currentDate) {
                            return critter;
                        }
                    } else {
                        if(startDate > currentDate) {
                            return critter;
                        }
                    }
                }
            }
            return null;
        });
        return availableCritters;
    }

    private filterCritterAvailability(critterList: ICritterList) {
        this.setState({
            loading: true,
        });

        const currentCritters: ICritterList = {
            bugs: this.filterCritterList(critterList.bugs),
            fish: this.filterCritterList(critterList.fish)
        }

        const upcomingCritters: ICritterList = {
            bugs: this.filterCritterList(critterList.bugs, true),
            fish: this.filterCritterList(critterList.fish, true),
        }

        this.setState({
            availableCritters: currentCritters,
            upcomingCritters: upcomingCritters,
            loading: false,
        });
    }

    private createCritterList = async() => {
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
            : <div><h1>You can currently catch {this.state.availableCritters?.bugs.length} Bugs:</h1><ul>{
                this.state.availableCritters?.bugs.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={'bug'} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} /> )
                }</ul><h1>You can catch {this.state.upcomingCritters?.bugs.length} Bugs later today:</h1><ul>{
                    this.state.upcomingCritters?.bugs.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={'bug'} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} /> )
                    }</ul></div>
        );
    }
}