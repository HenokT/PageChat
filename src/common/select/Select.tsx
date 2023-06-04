import classNames from "classnames";
import React from "react";
import styles from "./Select.module.css";

interface Option {
  readonly value: string | number;
  readonly label?: string;
  readonly disabled?: boolean;
}

export interface SelectProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  options: Option[];
}

export const Select = ({
  className,
  name,
  label,
  placeholder,
  options,
  ...rest
}: SelectProps) => {
  return (
    <div className={classNames(className, styles.selectContainer)}>
      {label && <label htmlFor={name}>{label}</label>}
      <div>
        <select {...rest}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label ?? option.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
