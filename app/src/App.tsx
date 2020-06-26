import React from 'react';
import './App.css';
import { HemisphereChooser } from './UI/HemisphereChooser';
import { MainApp } from './UI/MainApp';
import { useLocalStorage } from './helpers/dataHelpers';
import { filterType } from './model/FilterTypes';

function App() {
  const [hemisphere, setHemisphere] = useLocalStorage('hemisphere', undefined);
  const [activeFilter, changeFilter] = useLocalStorage('filterType', filterType.entryAsc);
  const [timeOffset, changeTimeOffset] = useLocalStorage('offset', 0);
  const [hideCaught, changeHideCaught] = useLocalStorage('hideCaught', false);
  const [showAll, changeShowAll] = useLocalStorage('showAll', false);
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
    donateFish,
    activeFilter,
    changeFilter,
    timeOffset,
    changeTimeOffset,
    hideCaught,
    changeHideCaught,
    showAll,
    changeShowAll,
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
