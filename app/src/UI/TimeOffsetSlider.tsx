import React, { useState } from 'react';
import { store, changeOffset } from '../reducers/AppReducer';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

function TimeOffsetSlider() {
    const state = store.getState();

    let sliderVal = state.timeOffset;

    const onChange = (value: number) => {
        sliderVal = value;
    }

    const changeComplete = (value: number) => {
        console.log(sliderVal);
    }

    console.log('rendering');

    return (
        <Slider
            min={-12}
            max={12}
            step={0.5}
            value={Number(sliderVal)}
            onChange={onChange}
            onChangeComplete={changeComplete}
      />
    );
}

export default TimeOffsetSlider;
