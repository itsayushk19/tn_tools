import styles from '../../styles/checkBox.module.scss'

export default function CustomCheckbox({ options, orientation, checkedOptions, onCheckboxChange }) {
  const handleCheckboxChange = (option) => {
    onCheckboxChange(option);
  };

  return (
    <div
      className={`${styles.checkboxContainer} ${
        orientation === "horizontal" ? styles.horizontal : styles.vertical
      }`}
    >
      {options.map((option) => (
        <label key={option} className={`${styles.checkboxLabel}`}>
          <input
            type="checkbox"
            checked={checkedOptions[option]} // Use the object key to check if the option is true
            onChange={() => handleCheckboxChange(option)}
          />
          <span className={styles.customCheckbox}>
            {checkedOptions[option] && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className={styles.checkIcon}
              >
                {/* Include the SVG path for the checkmark icon */}
                <polyline points="20 6 9 17 4 12" stroke="#E75C5A" strokeWidth={4} />
              </svg>
            )}
          </span>
          {option}
        </label>
      ))}
    </div>
  );
};
