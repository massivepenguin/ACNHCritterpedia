import React from 'react';

interface ICheckbox {
    label: string,
    isSelected: boolean,
    onCheckboxChange: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

const Checkbox = (props: ICheckbox) => (
    <div className="form-check">
      <label>
        <input
          type="checkbox"
          name={props.label}
          checked={props.isSelected}
          onChange={props.onCheckboxChange}
          className="form-check-input"
        />
        {props.label}
      </label>
    </div>
  );
  
  export default Checkbox;