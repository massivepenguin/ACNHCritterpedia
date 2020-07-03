import React, { useState } from "react";
import SettingsMenu from "./SettingsMenu";

function SettingsButton() {
    const [isOpen, toggleOpen] = useState(false);

    return (
        <div className={'settingsMenu'}>
            <input type={'button'} className={'settings-button'} value={'Settings'} onClick={() => toggleOpen(!isOpen)} />
            {
                isOpen ? <div className={'settings-dropdown'}><SettingsMenu /></div> : null
            }
        </div>
    );
}

export default SettingsButton;
