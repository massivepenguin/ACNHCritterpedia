import React from 'react';
import { ITimeSpan } from '../model/ITimeSpan';
import { isInTimeRange, convertDates } from '../helpers/DateHelpers';

interface ICritterTimes {
    availableTimes: ITimeSpan[];
    timeOffset: number;
}

function CritterTimes(props: React.PropsWithChildren<ICritterTimes>) {
    const { availableTimes, timeOffset } = props;

    const renderTimes = (): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        let currentDate = new Date();
        let adjustedDate = new Date();
        adjustedDate.setHours(adjustedDate.getHours() + timeOffset); // adjust the time in accordance with the user's specified offset

        const timeToCheck = new Date();
        timeToCheck.setMinutes(1); // set as 1 so we don't hit issues where the end time is an hour boundary (e.g. we don't want the 4-5pm slot filled in when the critter's end time is 4pm)
        timeToCheck.setSeconds(0);
        timeToCheck.setMilliseconds(0);

        const styleObject = {
            marginLeft: 100 / 60 * currentDate.getMinutes() + '%'
        };

        const timeMarker: JSX.Element = <span className={'time-marker'} style={styleObject}>*</span>;

        // loop through the 24-hour clock
        for(let i: number = 0; i < 24; ++i) {
            // set the current hour
            timeToCheck.setHours(i);
            // check all of the available time ranges to check and see if this time is in that range
            let isCurrentlyActive: boolean = false;

            for(const timeRange of availableTimes) {
                const [startTime, endTime] = convertDates(timeRange.startTime, timeRange.endTime);
                isCurrentlyActive = isInTimeRange(timeToCheck, startTime, endTime);
                if(isCurrentlyActive) {
                    break;
                }
            }

            const hourValue12 = i > 12 ? i - 12 : i;
            const hourString = hourValue12 <= 9 ? String("0" + hourValue12).slice(-2) : hourValue12;
            elements.push(<li key={`hour_${i}`} className={isCurrentlyActive ? 'active' : 'inactive'}>{i === currentDate.getHours() ? timeMarker : null}<span className={'hour_label'}>{hourString}</span></li>)
        }

        return elements;
    }

    return (
        <ul className={'times-list'}>
            {
                renderTimes()
            }
        </ul>
    )
}

export default CritterTimes;
