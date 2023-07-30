import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/dropDownSelection.module.scss";

const CustomDropdown = ({ options, onSelect, size, label, selectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setFilteredOptions(
      options.filter((option) => {
        const optionString = option.toString(); // Convert option to a string
        return optionString.toLowerCase().includes(inputValue.toLowerCase());
      })
    );
    // Update the selectedOption state as well
    onSelect(inputValue);
  };

  const handleOptionClick = (option) => {
    setIsOpen(false);
    onSelect(option); // Call the onSelect prop to update the selected option in the parent
  };

  const getInputClassName = () => {
    let inputClassName = "form__field form_field_med form_field_color";

    if (size) {
      if (size.includes("-")) {
        const [sizeValue, width] = size.split("-");
        if (sizeValue === "slim") {
          inputClassName = `form__field form_field_slim form_field_color`;
        } else if (sizeValue === "large") {
          inputClassName = `form__field form_field_large form_field_color`;
        }
        if (width) {
          inputClassName += ` ${styles.customWidth}`;
          inputClassName += ` ${styles[`w${width}`] || ""}`;
        }
      } else {
        // If no width specified, apply default width
        if (size === "slim") {
          inputClassName = `form__field form_field_slim form_field_color`;
        } else if (size === "large") {
          inputClassName = `form__field form_field_large form_field_color`;
        }
      }
    }

    return inputClassName;
  };

  return (
    <>
    <div>
    <div
      ref={dropdownRef}
      className={`form__group field ${styles.dropdownContainer}`}
    >
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={selectedOption}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          className={getInputClassName()}
          placeholder={`Select ${label}`}
          id="dropdownInput"
        />
        <label htmlFor="dropdownInput" className="form__label txt-upper">
          {label}
        </label>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.icon} ${isOpen ? styles.opened : ""}`}
          onClick={toggleDropdown}
        />
      </div>
      {isOpen && (
        <ul
          className={`form__field form_field_med form_field_color ${styles.optionsList}`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className={selectedOption === option ? styles.activeOption : ""}
              >
                {option}{" "}
              </li>
            ))
          ) : (
            <li className={`form__label txt-upper ${styles.noOptions}`}>
              No Options
            </li>
          )}{" "}
        </ul>
      )}
      {isOpen && (
        <div className={styles.collapseOverlay} onClick={toggleDropdown}></div>
      )}{" "}
    </div>
    </div>
    </>
  );
};

export default CustomDropdown;
