import React from 'react';
import { ICritter } from '../model/ICritter';

interface IMainApp {
    hemisphere: string;
    bugList: ICritter[];
}

export class MainApp extends React.Component<IMainApp> {
    render() {
        return <div>Your island is in the {this.props.hemisphere}ern hemisphere.</div>;
    }
}