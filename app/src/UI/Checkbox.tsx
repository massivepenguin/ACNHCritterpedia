import React from 'react';

interface ICheckbox {
    label: string;
    isSelected: boolean;
    onCheckboxChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}

function Checkbox(props: React.PropsWithChildren<ICheckbox>) {
    const { label, isSelected, onCheckboxChange } = props;

    return (
        <div className="form-check">
            <label>
                <input
                    type="checkbox"
                    name={label}
                    checked={isSelected}
                    onChange={onCheckboxChange}
                    className="form-check-input"
                />
                {props.label}
            </label>
        </div>
    );
}

export default Checkbox;
