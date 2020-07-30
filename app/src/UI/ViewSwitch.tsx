import React from 'react';
import { mainAppView } from '../model/MainAppView';
import { store, changeView } from '../reducers/appReducer';

interface IViewSwitch {
    viewType: mainAppView
}

function ViewSwitch(props:  React.PropsWithChildren<IViewSwitch>): JSX.Element {
    const {viewType} = props;

    return (

        <ul className={'viewSwitchList'}>
            <li onClick={() => store.dispatch(changeView(mainAppView.all))}>All</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.bugs))}>Bugs</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.fish))}>Fish</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.seaCreatures))}>Sea Creatures</li>
        </ul>
    );
}

export default ViewSwitch;
