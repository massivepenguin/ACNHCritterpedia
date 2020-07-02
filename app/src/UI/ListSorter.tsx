import React from 'react';
import { filterType, filterValues } from '../model/FilterTypes';
import { store, changeFilter } from '../reducers/appReducer';

function ListSorter() {
    const state = store.getState();

    const changeHandler = (e: React.SyntheticEvent<HTMLSelectElement>): void => {
        const changeValue = parseInt(e.currentTarget.value, 10);
        if(!isNaN(changeValue) && changeValue !== state.activeFilter) {
            store.dispatch(changeFilter(changeValue));
        }
    }

    const getSelectOptions = () => {
        const elements: JSX.Element[] = [];
        for (const opt in filterType) {
            if(!isNaN(Number(opt))) {
                elements.push(<option key={opt} value={opt}>{filterValues[opt]}</option>);
            }
        }
        return elements;
    }

    return (
        <div>
            <select onChange={changeHandler} defaultValue={state.activeFilter}>
                {
                    getSelectOptions()
                }
            </select>
        </div>
    )
}

export default ListSorter;