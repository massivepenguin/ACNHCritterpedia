import React from 'react';
import './App.css';
import { HemisphereChooser } from './UI/HemisphereChooser';
import { MainApp } from './UI/MainApp';
import { useLocalStorage } from './helpers/dataHelpers';

function App() {
  const [hemisphere, setHemisphere] = useLocalStorage('hemisphere', undefined);
  const [caughtBugs, catchBug] = useLocalStorage('caughtBugs', []);
  const [donatedBugs, donateBug] = useLocalStorage('donatedBugs', []);
  const [caughtFish, catchFish] = useLocalStorage('caughtFish', []);
  const [donatedFish, donateFish] = useLocalStorage('donatedFish', []);
  
  const mainAppProps = {
    hemisphere,
    caughtBugs, 
    donatedBugs,
    caughtFish,
    donatedFish,
    catchBug,
    donateBug,
    catchFish,
    donateFish
  }

  return (
    <div className="App">
      {
        hemisphere ? <MainApp {...mainAppProps}  /> : <HemisphereChooser toggleHemisphere={setHemisphere} />
      }
    </div>
  );
}

export default App;
