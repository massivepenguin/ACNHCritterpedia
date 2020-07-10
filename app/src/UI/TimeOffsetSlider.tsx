import React, { useState } from 'react';
import { store, changeOffset } from '../reducers/AppReducer';
import 'react-rangeslider/lib/index.css';

function TimeOffsetSlider() {
    const state = store.getState();

    const [textVal, setTextVal] = useState(state.timeOffset.toString());

    let sliderVal = state.timeOffset;

    const setValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
        store.dispatch(changeOffset(parseInt(e.currentTarget.value, 10)));
    }

    const updateValue = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setTextVal(e.currentTarget.value);
    }

    return (
        <div className={'offset-slider'}>
            <label>Timezone Offset</label>
            <div>{textVal}</div>
            <input type={'range'} min={-12} max={12} step={0.5} defaultValue={sliderVal} id={'offset'} onInput={updateValue} onMouseUp={setValue} onTouchEnd={setValue} onDrop={setValue} />
        </div>
    );
}

export default TimeOffsetSlider;
