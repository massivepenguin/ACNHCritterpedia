import { IAppState, AppState } from "../model/AppState"

// localStorage check modified from https://mathiasbynens.be/notes/localstorage-pattern
const storage = () => {
	const uid = new Date().toString();
	let result;
	try {
		localStorage.setItem(uid, uid);
		result = localStorage.getItem(uid) === uid;
		localStorage.removeItem(uid);
		return result && localStorage;
	} catch (exception) {
        console.warn('Could not access localStorage');
        return false;
    }
};

export const loadData = (): IAppState => {
    if(storage()) {
        return localStorage.getItem('appState') ? JSON.parse(localStorage.getItem('appState') as string) : AppState;
    } else {
        return AppState;
    }
}

export const saveData = (state: IAppState) => {
    if(storage()) {
        localStorage.setItem('appState', JSON.stringify(state));
    }
}
