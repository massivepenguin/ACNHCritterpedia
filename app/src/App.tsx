import React, { useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './reducers/appReducer';
import HemisphereChooser from './UI/HemisphereChooser';
import MainApp from './UI/MainApp';

function App() {
    const initialState = store.getState();
    const [appContent, setAppContent] = useState(
        initialState.hemisphere !== null ? <MainApp /> : <HemisphereChooser />,
    );

    store.subscribe(() =>
        setAppContent(() => {
            const state = store.getState();
            localStorage.setItem('appState', JSON.stringify(state));
            return state.hemisphere !== null ? <MainApp /> : <HemisphereChooser />;
        }),
    );

    return (
        <Provider store={store}>
            <div className="App">{appContent}</div>
        </Provider>
    );
}

export default App;
