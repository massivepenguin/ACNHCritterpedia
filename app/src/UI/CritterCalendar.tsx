import React from 'react';

interface ICritterCalendar {
    availableMonths: number[];
    timeOffset: number;
}

function CritterCalendar(props: React.PropsWithChildren<ICritterCalendar>) {
    const { availableMonths, timeOffset } = props;

    const monthArray: JSX.Element[] = [
        <>J<span className={'monthName--mid'}>an</span><span className={'monthName--rest'}>uary</span></>,
        <>F<span className={'monthName--mid'}>eb</span><span className={'monthName--rest'}>ruary</span></>,
        <>M<span className={'monthName--mid'}>ar</span><span className={'monthName--rest'}>ch</span></>,
        <>A<span className={'monthName--mid'}>pr</span><span className={'monthName--rest'}>il</span></>,
        <>M<span className={'monthName--mid'}>ay</span></>,
        <>J<span className={'monthName--mid'}>un</span><span className={'monthName--rest'}>e</span></>,
        <>J<span className={'monthName--mid'}>ul</span><span className={'monthName--rest'}>y</span></>,
        <>A<span className={'monthName--mid'}>ug</span><span className={'monthName--rest'}>ust</span></>,
        <>S<span className={'monthName--mid'}>ept</span><span className={'monthName--rest'}>ember</span></>,
        <>O<span className={'monthName--mid'}>ct</span><span className={'monthName--rest'}>ober</span></>,
        <>N<span className={'monthName--mid'}>ov</span><span className={'monthName--rest'}>ember</span></>,
        <>D<span className={'monthName--mid'}>ec</span><span className={'monthName--rest'}>ember</span></>,
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
        <>
            <h3>Active Months</h3>
            <ul className={'critterCalendar'}>
                {
                    renderMonths()
                }
            </ul>
        </>
    );
}

export default CritterCalendar;
