import React from 'react';

interface ICritterCalendar {
    availableMonths: number[];
    timeOffset: number;
}

function CritterCalendar(props: React.PropsWithChildren<ICritterCalendar>) {
    const { availableMonths, timeOffset } = props;

    const monthArray: JSX.Element[] = [
        <>J<span className={'month-name-mid'}>an</span><span className={'month-name-rest'}>uary</span></>,
        <>F<span className={'month-name-mid'}>eb</span><span className={'month-name-rest'}>ruary</span></>,
        <>M<span className={'month-name-mid'}>ar</span><span className={'month-name-rest'}>ch</span></>,
        <>A<span className={'month-name-mid'}>pr</span><span className={'month-name-rest'}>il</span></>,
        <>M<span className={'month-name-mid'}>ay</span></>,
        <>J<span className={'month-name-mid'}>un</span><span className={'month-name-rest'}>e</span></>,
        <>J<span className={'month-name-mid'}>ul</span><span className={'month-name-rest'}>y</span></>,
        <>A<span className={'month-name-mid'}>ug</span><span className={'month-name-rest'}>ust</span></>,
        <>S<span className={'month-name-mid'}>ept</span><span className={'month-name-rest'}>ember</span></>,
        <>O<span className={'month-name-mid'}>ct</span><span className={'month-name-rest'}>ober</span></>,
        <>N<span className={'month-name-mid'}>ov</span><span className={'month-name-rest'}>ember</span></>,
        <>D<span className={'month-name-mid'}>ec</span><span className={'month-name-rest'}>ember</span></>,
    ];

    const renderMonths = (): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + timeOffset); // we add the timeOffset in case adding or removing that time would cross a date boundary
        const currentMonth: number = currentDate.getMonth();

        for(let i = 0; i < 12; ++i) {
            elements.push(<li key={`month_${i}`} className={`month ${availableMonths.indexOf(i + 1) > -1 ? 'active' : 'inactive'} ${i === currentMonth ? 'current' : ''}`}>{monthArray[i]}</li>);
        }

        return elements;
    }

    return (
        <ul className={'critter-calendar'}>
            {
                renderMonths()
            }
        </ul>
    );
}

export default CritterCalendar;
