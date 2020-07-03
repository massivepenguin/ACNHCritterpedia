import React from 'react';
import { store, changeHemisphere } from '../reducers/AppReducer';
import { hemisphere } from '../model/Hemisphere';

function HemisphereChooser() {
    return (
        <div>
            <h1>Where is your Island?</h1>
            <ul>
                <li onClick={() => store.dispatch(changeHemisphere(hemisphere.north))}>Northern Hemisphere</li>
                <li onClick={() => store.dispatch(changeHemisphere(hemisphere.south))}>Southern Hemisphere</li>
            </ul>
        </div>
    );
}

export default HemisphereChooser;
