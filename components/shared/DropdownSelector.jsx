import { useRef } from "react";
import PropTypes from "prop-types";

export default function DropdownSelector({
  id,
  options,
  selectedOption,
  onSelect,
  label,
  size = "slim",
  errorOnDuplicate = false,
  compareWith,
}) {
  const ref = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    const shouldError = errorOnDuplicate && value === compareWith;

    if (shouldError) {
      ref.current?.classList.add("error-animation");
      setTimeout(() => ref.current?.classList.remove("error-animation"), 500);
    } else {
      onSelect(value);
    }
  };

  return (
    <div id={id} ref={ref} className={`dropdown-form ${size}`}>
      {label && <label className="form__label">{label}</label>}
      <select value={selectedOption} onChange={handleChange} className="form__field">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

DropdownSelector.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOption: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  errorOnDuplicate: PropTypes.bool,
  compareWith: PropTypes.string,
};
