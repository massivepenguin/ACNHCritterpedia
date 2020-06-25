import React from 'react';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import { CritterEntry } from './CritterEntry';
import { correctDates } from '../helpers/dateHelpers';

interface IMainApp {
    hemisphere: string;
    caughtBugs: string[];
    donatedBugs: string[];
    caughtFish: string[];
    donatedFish: string[];
    catchBug: (caughtCritters: string[]) => void;
    catchFish: (caughtCritters: string[]) => void;
    donateBug: (caughtCritters: string[]) => void;
    donateFish: (caughtCritters: string[]) => void;
}

const initialState = {
    currentView: 'all',
    availableCritters: undefined as undefined | ICritterList,
    upcomingCritters: undefined as undefined | ICritterList,
    loading: true,
}

export class MainApp extends React.Component<IMainApp, typeof initialState> {
    public state = initialState;
    public critterList: ICritterList = {bugs: bugs, fish: fish};

    public componentDidMount() {
        this.filterCritterAvailability(this.critterList);
    }

    private filterCritterList = (critterList: ICritter[], upcomingOnly: boolean = false): ICritter[] => {
        const currentTime = new Date();
        const currentMonth = currentTime.getMonth() + 1; // the months in the json files are not zero-indexed
        const availableCritters = critterList.filter((critter: ICritter) => {
            const monthsCritterAppears = this.props.hemisphere === 'north' ? critter.northMonths : critter.southMonths;
            if(monthsCritterAppears.indexOf(currentMonth) > -1) {
                // check if the critter is available at this moment in time
                for(const timeRange of critter.times) {
                    const [startTime, endTime] = correctDates(timeRange.startTime, timeRange.endTime);
                    // console.log(critter.name, currentTime, startTime, endTime);
                    if(!upcomingOnly) {
                        if(startTime <= currentTime && endTime >= currentTime) {
                            return critter;
                        }
                    } else {
                        if(startTime > currentTime) {
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

    public catchCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        console.log("cattled catchCritter");
        const critterId = e.currentTarget.getAttribute('data-critter-id');
        const critterType = e.currentTarget.getAttribute('data-critter-type');
        const caughtArray: string[] = [];
        if(critterId && critterType) {
            switch(critterType) {
                case 'bug': {
                    caughtArray.push(...this.props.caughtBugs);
                    break;
                }
                case 'fish': {
                    caughtArray.push(...this.props.caughtFish);
                    break;
                }
            }
            const caughtIndex = caughtArray.indexOf(critterId);
            if(caughtIndex > -1) {
                caughtArray.splice(caughtIndex, 1);
            } else {
                caughtArray.push(critterId);
            }
            switch(critterType) {
                case 'bug': {
                    this.props.catchBug(caughtArray);
                    break;
                }
                case 'fish': {
                    this.props.catchFish(caughtArray);
                }
            }
        }
    }
    
    public donateCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        const critterId = e.currentTarget.getAttribute('data-critter-id');
        const critterType = e.currentTarget.getAttribute('data-critter-type');
        let donatedArray: string[] = [];
        let caughtArray: string[] = [];
        if(critterId && critterType) {
            switch(critterType) {
                case 'bug': {
                    donatedArray.push(...this.props.donatedBugs);
                    caughtArray.push(...this.props.caughtBugs);
                    break;
                }
                case 'fish': {
                    donatedArray.push(...this.props.donatedFish);
                    caughtArray.push(...this.props.caughtFish);
                    break;
                }
            }
            const donatedIndex = donatedArray.indexOf(critterId);
            const caughtIndex = caughtArray.indexOf(critterId);
            if(donatedIndex > -1) {
                donatedArray.splice(donatedIndex, 1);
            } else {
                donatedArray.push(critterId);
                if(caughtIndex <= -1) {
                    caughtArray.push(critterId);
                }
            }
            switch(critterType) {
                case 'bug': {
                    this.props.catchBug(caughtArray);
                    this.props.donateBug(donatedArray);
                    break;
                }
                case 'fish': {
                    this.props.catchFish(caughtArray);
                    this.props.donateFish(donatedArray);
                }
            }
        }
    }

    render() {
        const { loading } = this.state;
        return (
            loading ? <div>Loading</div> 
            : <div><h1>You can currently catch {this.state.availableCritters?.bugs.length} Bugs:</h1><ul>{
                this.state.availableCritters?.bugs.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={'bug'} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} caught={this.props.caughtBugs.indexOf(bug.id.toString()) > -1} donated={this.props.donatedBugs.indexOf(bug.id.toString()) > -1} /> )
                }</ul><h1>You can catch {this.state.upcomingCritters?.bugs.length} Bugs later today:</h1><ul>{
                    this.state.upcomingCritters?.bugs.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={'bug'} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} caught={this.props.caughtBugs.indexOf(bug.id.toString()) > -1} donated={this.props.donatedBugs.indexOf(bug.id.toString()) > -1} /> )
                    }</ul></div>
        );
    }
}