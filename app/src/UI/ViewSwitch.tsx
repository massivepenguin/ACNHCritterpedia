import React from 'react';
import { createUseStyles } from 'react-jss';
import { mainAppView } from '../model/MainAppView';
import { store, changeView } from '../reducers/appReducer';
import { sharedStyles } from '../styles/SharedStyles';

interface IViewSwitch {
    viewType: mainAppView
}

function ViewSwitch(props:  React.PropsWithChildren<IViewSwitch>): JSX.Element {
    const {viewType} = props;

    const classes = createUseStyles({
        activeButton: {

        },
        switchButton: {
            cursor: 'pointer',
        },
        viewSwitchList: {
            ...sharedStyles.inlineList,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    })();

    return (

        <ul className={classes.viewSwitchList}>
            <li onClick={() => store.dispatch(changeView(mainAppView.all))}>All</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.bugs))}>Bugs</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.fish))}>Fish</li>
            <li onClick={() => store.dispatch(changeView(mainAppView.seaCreatures))}>Sea Creatures</li>
        </ul>
    );
}

export default ViewSwitch;
