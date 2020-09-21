import React from 'react';
import { store, changeHemisphere } from '../reducers/appReducer';
import { hemisphere } from '../model/Hemisphere';

function HemisphereChooser() {
    return (
        <div className="hemisphereChooser">
            <h1>Where is your Island?</h1>
            <ul>
                <li><button onClick={() => store.dispatch(changeHemisphere(hemisphere.north))}>Northern Hemisphere</button></li>
                <li><button onClick={() => store.dispatch(changeHemisphere(hemisphere.south))}>Southern Hemisphere</button></li>
            </ul>
        </div>
    );
}

export default HemisphereChooser;
