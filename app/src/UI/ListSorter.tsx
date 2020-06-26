import React from 'react';
import { filterType, filterDescriptions } from '../model/FilterTypes';

interface IListFilter {
    activeFilter: number;
    filterChangeFunction: (newFilter: number) => void;
}

export function ListSorter(props: IListFilter) {
    const changeHandler = (e: React.SyntheticEvent<HTMLSelectElement>): void => {
        const changeValue = parseInt(e.currentTarget.value, 10);
        if(!isNaN(changeValue) && changeValue !== props.activeFilter) {
            props.filterChangeFunction(changeValue);
        }
    }

    const getSelectOptions = () => {
        const elements: JSX.Element[] = [];
        for (const opt in filterType) {
            if (!isNaN(Number(opt))) {
                elements.push(<option key={opt} value={opt}>{filterDescriptions[opt]}</option>);
            }
        }
        return elements;
    }

    return (
        <div>
            <select onChange={changeHandler} defaultValue={props.activeFilter}>
                {
                    getSelectOptions()
                }
            </select>
        </div>
    )
}