import React, {useState} from 'react';
import './App.css';
import { HemisphereChooser } from './UI/HemisphereChooser';
import { MainApp } from './UI/MainApp';
import { ICritter } from './model/ICritter';
import bugs from './data/bugs.json';
import { ITimeSpan } from './model/ITimeSpan';

function App() {
  const [hemisphere, setHemisphere] = useLocalStorage('hemisphere', undefined);
  const [bugList, updateBugList] = useLocalStorage('bugs', createBugList());

  function createBugList() {
    const sourceBugList = bugs;
    const bugList: ICritter[] = [];
    for(const bug of sourceBugList) {
      bugList.push({...bug, times: bug.times as ITimeSpan[], caught: false, donated: false});
    }
    updateBugList(bugList);
  }

  return (
    <div className="App">
      {
        hemisphere ? <MainApp hemisphere={hemisphere} bugList={bugList} /> : <HemisphereChooser toggleHemisphere={setHemisphere} />
      }
    </div>
  );
}

function useLocalStorage(key: string, initialValue: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default App;
