import React from 'react';
import { sortType, sortValues } from '../model/SortType';
import { store, changeSort } from '../reducers/AppReducer';

function ListSorter() {
    const state = store.getState();

    const changeHandler = (e: React.SyntheticEvent<HTMLSelectElement>): void => {
        const changeValue = parseInt(e.currentTarget.value, 10);
        if (!isNaN(changeValue) && changeValue !== state.activeSort) {
            store.dispatch(changeSort(changeValue));
        }
    };

    const getSelectOptions = () => {
        const elements: JSX.Element[] = [];
        for (const opt in sortType) {
            if (!isNaN(Number(opt))) {
                elements.push(
                    <option key={opt} value={opt}>
                        {sortValues[opt]}
                    </option>,
                );
            }
        }
        return elements;
    };

    return (
        <div>
            <select onChange={changeHandler} defaultValue={state.activeSort}>
                {getSelectOptions()}
            </select>
        </div>
    );
}

export default ListSorter;
