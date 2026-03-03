import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterDropdown = ({ options, value, onChange, placeholder = "Filter..." }) => {
  return (
    <div className="filter-dropdown">
      <FaFilter className="filter-icon" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
