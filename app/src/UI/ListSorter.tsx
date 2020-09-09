import React from 'react';
import { sortType, sortValues } from '../model/SortType';
import { store, changeSort } from '../reducers/appReducer';
import { useSelector } from 'react-redux';
import { IAppState } from '../model/AppState';

function ListSorter() {
    const activeSort = useSelector((state: IAppState) => state.activeSort);

    const changeHandler = (e: React.SyntheticEvent<HTMLSelectElement>): void => {
        const changeValue = parseInt(e.currentTarget.value, 10);
        if (!isNaN(changeValue) && changeValue !== activeSort) {
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
            <select onChange={changeHandler} defaultValue={activeSort}>
                {getSelectOptions()}
            </select>
        </div>
    );
}

export default ListSorter;
