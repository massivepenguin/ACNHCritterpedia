import React from 'react';
import HemisphereChooser from './HemisphereChooser';
import TimeOffsetSlider from './TimeOffsetSlider';

function SettingsMenu() {
    
    return (
        <ul className={'settings-menu'}>
            <li><HemisphereChooser /></li>
            <li><TimeOffsetSlider /></li>
        </ul>
    );
}

export default SettingsMenu;
