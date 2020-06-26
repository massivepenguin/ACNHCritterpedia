import React from 'react';
import { ICritterList } from '../model/ICritterList';
import { ICritter } from '../model/ICritter';
import { critterType } from '../model/CritterType';
import bugs from '../data/bugs.json';
import fish from '../data/fish.json';
import { CritterEntry } from './CritterEntry';
import { correctDates, setDateToCurrentDate } from '../helpers/dateHelpers';
import { filterType } from '../model/FilterTypes';
import { ListSorter } from './ListSorter';
import Checkbox from './Checkbox';

interface IMainApp {
    hemisphere: string;
    caughtBugs: string[];
    donatedBugs: string[];
    caughtFish: string[];
    donatedFish: string[];
    activeFilter: number;
    timeOffset: number;
    hideCaught: boolean;
    showAll: boolean;
    changeFilter: (filter: number) => void;
    changeTimeOffset: (newOffset: number) => void;
    changeHideCaught: (shouldHide: boolean) => void;
    changeShowAll:  (shouldHide: boolean) => void;
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
    showAllCritters: false,
}

export class MainApp extends React.Component<IMainApp, typeof initialState> {

    public state = initialState;
    public critterList: ICritterList = {bugs: bugs, fish: fish} as ICritterList;

    public componentDidMount() {
        this.filterCritterAvailability();
    }

    public componentDidUpdate(prevProps: IMainApp) {
        // if we've changed one of the major things that affects how we view the critter lists, we re-filter them
        if( prevProps.activeFilter !== this.props.activeFilter || 
            prevProps.hideCaught !== this.props.hideCaught || 
            prevProps.timeOffset !== this.props.timeOffset ||
            prevProps.caughtBugs !== this.props.caughtBugs || 
            prevProps.caughtFish !== this.props.caughtFish) {
            this.filterCritterAvailability();
        }
    }

    private sortCritterList = (a: ICritter, b: ICritter): number => {
        let currentTime = new Date();
        if(this.props.timeOffset !== 0) {
            currentTime.setHours(currentTime.getHours() + this.props.timeOffset);
            currentTime = setDateToCurrentDate(currentTime); // in case we crossed a time boundary, we reset the date to the current date (keeping the time)
        }
        switch(filterType[this.props.activeFilter]) {
            case "alphaAsc": {
                return b.name.toUpperCase() > a.name.toUpperCase() ? -1 : b.name.toUpperCase() < a.name.toUpperCase() ? 1 : 0;
            }
            case "alphaDesc": {
                return a.name.toUpperCase() > b.name.toUpperCase() ? -1 : a.name.toUpperCase() < b.name.toUpperCase() ? 1 : 0; 
            }
            case "entryDesc": {
                return a.id > b.id ? -1 : a.id < b.id ? 1 : 0; 
            }
            case "entryAsc": {
                return b.id > a.id ? -1 : b.id < a.id ? 1 : 0; 
            }
            case "valueAsc": {
                return a.price > b.price ? -1 : a.price < b.price ? 1 : 0; 
            }
            case "valueDesc": {
                return b.price > a.price ? -1 : b.price < a.price ? 1 : 0; 
            }
            case "todayAsc": {
                // get the difference between current time and when the critter disappears

            }
        }
        return 0;
    }

    private async filterCritterAvailability() {
        const availableBugs: number[] = [];
        const availableFish: number[] = [];

        const filterCritterList = (critterListIn: ICritter[], typeOfCritter: critterType, upcomingOnly: boolean = false): ICritter[] => {
            let currentTime = new Date();
            if(this.props.timeOffset !== 0) {
                currentTime.setHours(currentTime.getHours() + this.props.timeOffset);
                currentTime = setDateToCurrentDate(currentTime); // in case we crossed a time boundary, we reset the date to the current date (keeping the time)
            }
            const currentMonth = currentTime.getMonth() + 1; // the months in the json files are not zero-indexed
            const availableCritters = critterListIn.filter((critter: ICritter) => {
                // skip out of the rest of the function if we've caught this critter and are hiding ones we've caught
                if(this.props.hideCaught) {
                    switch(typeOfCritter) {
                        case critterType.bug: {
                            if(this.props.caughtBugs.indexOf(critter.id.toString()) > -1) {
                                return null;
                            }
                            break;
                        }
                        case critterType.fish: {
                            if(this.props.caughtFish.indexOf(critter.id.toString()) > -1) {
                                return null;
                            }
                            break;
                        }
                    }
                }

                const monthsCritterAppears = this.props.hemisphere === 'north' ? critter.northMonths : critter.southMonths;
                if(monthsCritterAppears.indexOf(currentMonth) > -1) {
                    // check if the critter is available at this moment in time
                    for(const timeRange of critter.times) {
                        const [startTime, endTime] = correctDates(timeRange.startTime, timeRange.endTime);
                        const isInTimeRange = endTime > startTime ? currentTime >= startTime && currentTime <= endTime : currentTime >= startTime || currentTime <= endTime;
                        if(!upcomingOnly) {
                            if(isInTimeRange) {
                                switch(typeOfCritter) {
                                    case critterType.bug: {
                                        availableBugs.push(critter.id);
                                        break;
                                    }
                                    case critterType.fish: {
                                        availableFish.push(critter.id);
                                        break;
                                    }
                                }
                                return critter;
                            }
                        } else {
                            if(!isInTimeRange && startTime > currentTime) {
                                switch(typeOfCritter) {
                                    case critterType.bug: {
                                        if(availableBugs.indexOf(critter.id) < 0) {
                                            return critter;
                                        }
                                        break;
                                    }
                                    case critterType.fish: {
                                        if(availableFish.indexOf(critter.id) < 0) {
                                            return critter;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return null;
            });
            return availableCritters;
        };

        this.setState({
            loading: true,
        });

        const availableCritters: ICritterList = {
            bugs: filterCritterList(this.critterList.bugs, critterType.bug),
            fish: filterCritterList(this.critterList.fish, critterType.fish)
        }

        const upcomingCritters: ICritterList = {
            bugs: filterCritterList(this.critterList.bugs, critterType.bug, true),
            fish: filterCritterList(this.critterList.fish, critterType.fish, true),
        }

        this.setState({
            availableCritters,
            upcomingCritters,
            loading: false,
        });
    }

    public catchCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        console.log("catching");
        const critterId = e.currentTarget.getAttribute('data-critter-id');
        const typeOfCritter = e.currentTarget.getAttribute('data-critter-type');
        const caughtArray: string[] = [];
        if(critterId && typeOfCritter) {
            switch(typeOfCritter) {
                case "bug": {
                    caughtArray.push(...this.props.caughtBugs);
                    break;
                }
                case "fish": {
                    caughtArray.push(...this.props.caughtFish);
                    break;
                }
                default: {
                    console.log(typeOfCritter);
                }
            }
            const caughtIndex = caughtArray.indexOf(critterId);
            if(caughtIndex > -1) {
                caughtArray.splice(caughtIndex, 1);
            } else {
                caughtArray.push(critterId);
            }
            switch(typeOfCritter) {
                case "bug": {
                    this.props.catchBug(caughtArray);
                    break;
                }
                case "fish": {
                    this.props.catchFish(caughtArray);
                }
            }
        }
    }
    
    public donateCritter = (e: React.SyntheticEvent<HTMLElement>) => {
        const critterId = e.currentTarget.getAttribute('data-critter-id');
        const typeOfCritter = e.currentTarget.getAttribute('data-critter-type');
        let donatedArray: string[] = [];
        let caughtArray: string[] = [];
        if(critterId && typeOfCritter) {
            switch(typeOfCritter) {
                case "bug": {
                    donatedArray.push(...this.props.donatedBugs);
                    caughtArray.push(...this.props.caughtBugs);
                    break;
                }
                case "fish": {
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
            switch(typeOfCritter) {
                case "bug": {
                    this.props.catchBug(caughtArray);
                    this.props.donateBug(donatedArray);
                    break;
                }
                case "fish": {
                    this.props.catchFish(caughtArray);
                    this.props.donateFish(donatedArray);
                }
            }
        }
    }

    private toggleShowAllCritters = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const changeValue = e.currentTarget.checked;
        this.props.changeShowAll(changeValue);
    }

    private changeHideCaught = (e: React.SyntheticEvent<HTMLInputElement>): void => {
        const changeValue = e.currentTarget.checked;
        this.props.changeHideCaught(changeValue);
    }

    render() {
        const { loading } = this.state;
        const availableBugs = this.state.availableCritters?.bugs.sort(this.sortCritterList);
        const upcomingBugs = this.state.upcomingCritters?.bugs.sort(this.sortCritterList);
        const allBugs = this.critterList.bugs.sort(this.sortCritterList).filter((critter: ICritter) => this.props.hideCaught ? this.props.caughtBugs.indexOf(critter.id.toString()) < 0 : critter );
        const availableFish = this.state.availableCritters?.fish.sort(this.sortCritterList);
        const upcomingFish = this.state.upcomingCritters?.fish.sort(this.sortCritterList);
        const allFish = this.critterList.fish.sort(this.sortCritterList).filter((critter: ICritter) => this.props.hideCaught ? this.props.caughtBugs.indexOf(critter.id.toString()) < 0 : critter );

        return (
            loading ? <div>Loading</div> 
            : <div>
                <ListSorter activeFilter={this.props.activeFilter} filterChangeFunction={this.props.changeFilter} />
                <Checkbox label={'Hide caught critters?'} isSelected={this.props.hideCaught} onCheckboxChange={this.changeHideCaught} />
                <Checkbox label={'Show all Critters?'} isSelected={this.props.showAll} onCheckboxChange={this.toggleShowAllCritters} />
                {
                    this.props.showAll ? <><h1>All Bugs</h1>
                    <ul>
                        {
                            allBugs?.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={critterType.bug} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} caught={this.props.caughtBugs.indexOf(bug.id.toString()) > -1} donated={this.props.donatedBugs.indexOf(bug.id.toString()) > -1} /> )
                        }
                    </ul></>
                    : <><h1>You can currently catch {this.state.availableCritters?.bugs.length} Bugs:</h1>
                    <ul>
                        {
                            availableBugs?.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={critterType.bug} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} caught={this.props.caughtBugs.indexOf(bug.id.toString()) > -1} donated={this.props.donatedBugs.indexOf(bug.id.toString()) > -1} /> )
                        }
                    </ul>
                    <h1>You can catch {this.state.upcomingCritters?.bugs.length} Bugs later today:</h1>
                    <ul>
                        {
                            upcomingBugs?.map((bug:ICritter) => <CritterEntry collectFunction={this.catchCritter} donateFunction={this.donateCritter} critterType={critterType.bug} critterId={bug.id} critter={bug} key={`bug_${bug.id}`} caught={this.props.caughtBugs.indexOf(bug.id.toString()) > -1} donated={this.props.donatedBugs.indexOf(bug.id.toString()) > -1} /> )
                        }
                    </ul></>
                }
                
            </div>
        );
    }
}