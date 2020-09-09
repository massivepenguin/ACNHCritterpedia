import React, { useState } from 'react';
import { store, changeOffset } from '../reducers/appReducer';
import 'react-rangeslider/lib/index.css';
import { useSelector } from 'react-redux';
import { IAppState } from '../model/AppState';

function TimeOffsetSlider() {
    const timeOffset: number = useSelector((state: IAppState) => state.timeOffset);

    const [textVal, setTextVal] = useState(timeOffset.toString());

    const setValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
        // set the app's timeOffset property only when interaction is complete to prevent re-renders on inout movement
        store.dispatch(changeOffset(parseInt(e.currentTarget.value, 10)));
    }

    const updateTextValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
        // set the component's state value, not the app's state
        setTextVal(e.currentTarget.value.toString());
    }

    return (
        <div className={'offset-slider'}>
            <label>Timezone Offset</label>
            <div>{textVal}</div>
            <input 
                type={'range'} 
                min={-12} 
                max={12} 
                step={0.5} 
                defaultValue={timeOffset} 
                id={'offset'} 
                onInput={updateTextValue} 
                onMouseUp={setValue} 
                onTouchEnd={setValue}
            />
        </div>
    );
}

export default TimeOffsetSlider;
