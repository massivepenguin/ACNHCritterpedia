import React from 'react';

interface IHemisphereChooser {
    toggleHemisphere: (val: string | null) => void;
}

export class HemisphereChooser extends React.Component<IHemisphereChooser> {
    private changeHemisphere = (e: React.SyntheticEvent<HTMLElement>) => {
        const newHemisphere = e.currentTarget.getAttribute('data-hemisphere');
        this.props.toggleHemisphere(newHemisphere);
    }

    render() {
        return <div>
            <h1>Where is your Island?</h1>
            <ul>
                <li data-hemisphere={'north'} onClick={this.changeHemisphere}>Northern Hemisphere</li>
                <li data-hemisphere={'south'} onClick={this.changeHemisphere}>Southern Hemisphere</li>
            </ul>
        </div>;
    }
}